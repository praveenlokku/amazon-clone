import requests
from bs4 import BeautifulSoup
import os
import random
import time
from django.conf import settings
from .models import Product, Category

class AmazonService:
    """
    Service to fetch real Amazon product data by directly scraping Amazon.in.
    Includes a database caching mechanism to store results in our local DB.
    """
    
    HEADERS = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
    }
    
    @staticmethod
    def clean_amazon_url(url):
        """
        Cleans an Amazon image URL to get the highest resolution version.
        Removes modifiers like ._AC_SY200_ or ._SR100,100_
        """
        if not url or not isinstance(url, str):
            return url
        
        # Amazon image URLs often look like: 
        # https://m.media-amazon.com/images/I/71657TiFeHL._AC_SY200_.jpg
        # We want: https://m.media-amazon.com/images/I/71657TiFeHL.jpg
        # Or: https://m.media-amazon.com/images/I/71657TiFeHL._SX679_.jpg (which is also high res)
        
        # Regex to find the part between the last dot before the extension and the extension
        import re
        # This matches the period followed by underscore and alphanumeric characters until another period
        cleaned_url = re.sub(r'\._[A-Z0-9,_-]+\.', '.', url)
        return cleaned_url

    @classmethod
    def search_products(cls, search_term, category_name=None):
        """
        Main entry point for product search. 
        Prioritizes RapidAPI for reliability in production, falls back to scraping for local dev.
        """
        api_key = os.environ.get('RAPIDAPI_KEY')
        api_host = os.environ.get('RAPIDAPI_HOST', 'real-time-amazon-data.p.rapidapi.com')

        if api_key and api_key != 'YOUR_RAPIDAPI_KEY':
            print(f"Using RapidAPI for search: {search_term}")
            return cls._search_via_api(search_term, category_name)
        
        print(f"Falling back to scraping for search: {search_term}")
        return cls._search_via_scraping(search_term, category_name)

    @classmethod
    def _search_via_api(cls, search_term, category_name=None):
        api_key = os.environ.get('RAPIDAPI_KEY')
        api_host = os.environ.get('RAPIDAPI_HOST', 'real-time-amazon-data.p.rapidapi.com')
        
        url = f"https://{api_host.strip('/')}/search"
        querystring = {"query": search_term, "page": "1", "country": "IN", "sort_by": "RELEVANCE"}
        
        headers = {
            "X-RapidAPI-Key": api_key,
            "X-RapidAPI-Host": api_host.strip('/')
        }

        try:
            print(f"Calling RapidAPI: {url}")
            response = requests.get(url, headers=headers, params=querystring, timeout=15)
            if response.status_code == 200:
                data = response.json()
                products = data.get('data', {}).get('products', [])
                
                results = []
                for p in products:
                    if p.get('asin') and p.get('product_title'):
                        results.append({
                            'asin': p.get('asin'),
                            'title': p.get('product_title'),
                            'price': p.get('product_price', '0').replace('₹', '').replace(',', ''),
                            'image': p.get('product_photo'),
                            'stars': float(p.get('product_star_rating', 4.0)) if p.get('product_star_rating') else 4.0,
                            'brand': p.get('brand', 'Amazon Vendor'),
                            'description': p.get('product_title')
                        })
                
                if results:
                    return cls._map_and_save_results(results, category_name)
            
            print(f"RapidAPI failed with status {response.status_code}. Falling back to scraping.")
            return cls._search_via_scraping(search_term, category_name)
            
        except Exception as e:
            print(f"Error calling RapidAPI: {e}")
            return cls._search_via_scraping(search_term, category_name)

    @classmethod
    def _search_via_scraping(cls, search_term, category_name=None):
        url = f"https://www.amazon.in/s?k={search_term.replace(' ', '+')}"
        
        try:
            # Add small delay to prevent immediate bot detection
            time.sleep(random.uniform(0.5, 1.5))
            response = requests.get(url, headers=cls.HEADERS, timeout=10)
            
            if response.status_code == 503 or '<form action="/errors/validateCaptcha"' in response.text:
                print("Amazon returned a CAPTCHA or 503 blocked the request.")
                if search_term != 'bestsellers':
                    return cls._search_via_scraping('bestsellers', category_name)
                # If even bestsellers fails, return empty list (we'll handle fallback in search_products)
                return []
                
            soup = BeautifulSoup(response.content, 'lxml')
            items = soup.find_all('div', {'data-component-type': 's-search-result'})
            
            if not items:
                print("No search results found on the page or selector changed.")
                if search_term != 'bestsellers':
                    return cls._search_via_scraping('bestsellers', category_name)
                return []

            results = []
            for item in items[:48]:  # Get top 48 items
                asin = item.get('data-asin')
                title_elem = item.find('h2')
                title = title_elem.text.strip() if title_elem else ''
                
                price_elem = item.find('span', {'class': 'a-price-whole'})
                price = price_elem.text.strip().replace(',', '') if price_elem else '0'
                
                img_elem = item.find('img', {'class': 's-image'})
                image = img_elem.get('src') if img_elem else ''
                image = cls.clean_amazon_url(image)
                
                rating_elem = item.find('span', {'class': 'a-icon-alt'})
                rating_text = rating_elem.text if rating_elem else '4.0 out of 5 stars'
                try:
                    rating = float(rating_text.split(' ')[0])
                except:
                    rating = 4.0
                
                if asin and title and image:
                    results.append({
                        'asin': asin,
                        'title': title,
                        'price': price,
                        'image': image,
                        'stars': rating,
                        'brand': 'Amazon Vendor',
                        'description': title
                    })

            if not results:
                if search_term != 'bestsellers':
                    return cls._search_via_scraping('bestsellers', category_name)
                return []
                
            return cls._map_and_save_results(results, category_name)
            
        except Exception as e:
            print(f"Error scraping Amazon directly: {e}")
            if search_term != 'bestsellers':
                return cls._search_via_scraping('bestsellers', category_name)
            return []

    @classmethod
    def get_product_details(cls, asin):
        """Fetches product details, prioritizing local DB cache."""
        try:
            product = Product.objects.get(asin=asin)
            
            # If product exists but has no additional images, try to fetch them
            import json
            try:
                gallery = json.loads(product.additional_images or '[]')
                if not gallery or len(gallery) <= 1:
                    cls.fetch_full_product_info(asin)
                    product.refresh_from_db()
            except:
                cls.fetch_full_product_info(asin)
                product.refresh_from_db()

            return cls._serialize_product(product)
        except Product.DoesNotExist:
            # If not in DB, we could fetch it now
            cls.fetch_full_product_info(asin)
            try:
                product = Product.objects.get(asin=asin)
                return cls._serialize_product(product)
            except Product.DoesNotExist:
                return None

    @classmethod
    def fetch_full_product_info(cls, asin):
        """
        Main entry point for fetching full product info (gallery, description).
        Prioritizes RapidAPI for reliability in production, falls back to scraping.
        """
        api_key = os.environ.get('RAPIDAPI_KEY')
        if api_key and api_key != 'YOUR_RAPIDAPI_KEY':
            print(f"Using RapidAPI for product info: {asin}")
            success = cls._fetch_info_via_api(asin)
            if success: return
        
        print(f"Falling back to scraping for product info: {asin}")
        cls._fetch_info_via_scraping(asin)

    @classmethod
    def _fetch_info_via_api(cls, asin):
        api_key = os.environ.get('RAPIDAPI_KEY')
        api_host = os.environ.get('RAPIDAPI_HOST', 'real-time-amazon-data.p.rapidapi.com')
        
        url = f"https://{api_host}/product-details"
        querystring = {"asin": asin, "country": "IN"}
        
        headers = {
            "X-RapidAPI-Key": api_key,
            "X-RapidAPI-Host": api_host
        }

        try:
            response = requests.get(url, headers=headers, params=querystring, timeout=15)
            if response.status_code == 200:
                data = response.json().get('data', {})
                if not data: return False

                # 1. Extract Images
                images = []
                # Main photo
                if data.get('product_photo'):
                    images.append(cls.clean_amazon_url(data['product_photo']))
                
                # Additional photos
                for p in data.get('product_photos', []):
                    cleaned = cls.clean_amazon_url(p)
                    if cleaned not in images:
                        images.append(cleaned)

                # 2. Description
                description = data.get('product_description', '')
                if not description and data.get('about_product'):
                    description = "\n".join(data['about_product'])

                # 3. Update DB
                if images:
                    import json
                    Product.objects.filter(asin=asin).update(
                        additional_images=json.dumps(images),
                        image=images[0],
                        description=description or Product.objects.get(asin=asin).description
                    )
                    return True
            return False
        except Exception as e:
            print(f"Error calling RapidAPI for details: {e}")
            return False

    @classmethod
    def _fetch_info_via_scraping(cls, asin):
        if not asin: return
        
        url = f"https://www.amazon.in/dp/{asin}"
        try:
            time.sleep(random.uniform(1.5, 3))
            response = requests.get(url, headers=cls.HEADERS, timeout=15)
            if response.status_code != 200:
                print(f"Failed to fetch product page for {asin}: {response.status_code}")
                return

            soup = BeautifulSoup(response.content, 'lxml')
            
            # 1. Extract Images Gallery
            images = []
            scripts = soup.find_all('script', type='text/javascript')
            for script in scripts:
                if script.string and 'colorImages' in script.string:
                    import re
                    import json
                    match = re.search(r'["\']colorImages["\']:\s*({.*?}),\s*["\']columnLayout["\']', script.string, re.DOTALL)
                    if match:
                        try:
                            json_str = match.group(1).replace("'", '"')
                            data = json.loads(json_str)
                            initial_images = data.get('initial', [])
                            for img_obj in initial_images:
                                hi_res = img_obj.get('hiRes') or img_obj.get('large') or img_obj.get('main', {}).get('url')
                                if hi_res and isinstance(hi_res, str) and hi_res.startswith('http'):
                                    cleaned = cls.clean_amazon_url(hi_res)
                                    if cleaned not in images:
                                        images.append(cleaned)
                        except Exception as e:
                            print(f"Error parsing colorImages JSON for {asin}: {e}")
                    break
            
            if not images:
                thumb_container = soup.select_one('#altImages') or soup.select_one('#imageBlock')
                if thumb_container:
                    thumbs = thumb_container.select('img')
                    for thumb in thumbs:
                        src = thumb.get('src')
                        if src and 'm.media-amazon.com/images/I/' in src:
                            if any(x in src.lower() for x in ['play-icon', 'video-icon', 'sprite']):
                                continue
                            cleaned = cls.clean_amazon_url(src)
                            if cleaned not in images:
                                images.append(cleaned)

            # 2. Extract Description
            desc_elem = soup.select_one('#feature-bullets')
            description = ""
            if desc_elem:
                bullets = desc_elem.select('li span.a-list-item')
                description = "\n".join([b.text.strip() for b in bullets if b.text.strip() and not b.get('class')])

            # 3. Update DB
            if images:
                import json
                Product.objects.filter(asin=asin).update(
                    additional_images=json.dumps(images),
                    image=images[0] if images else None,
                    description=description or Product.objects.get(asin=asin).description
                )
                print(f"Updated gallery for {asin} with {len(images)} images.")

        except Exception as e:
            print(f"Error fetching full product info for {asin}: {e}")

    @classmethod
    def _map_and_save_results(cls, results, category_name):
        """Maps scraped data response to our local Product schema and saves to DB."""
        mapped = []
        category, _ = Category.objects.get_or_create(name=category_name or 'Real Amazon Item')

        for item in results:
            asin = item.get('asin')
            if not asin: continue

            raw_price = str(item.get('price', '0'))
            try:
                clean_price = ''.join(c for c in raw_price if c.isdigit() or c == '.')
                # In case there are multiple dots or a trailing dot
                clean_price = clean_price.rstrip('.')
                price_val = float(clean_price) if clean_price else 0.0
            except:
                price_val = 0.0

            # Filter out missing image links
            img = item.get('image', '')
            if not img.startswith('http'):
                continue

            defaults = {
                'name': item.get('title')[:200] if item.get('title') else 'Unknown',
                'image': img,
                'price': price_val,
                'rating': item.get('stars', 0),
                'brand': item.get('brand', 'Amazon'),
                'category': category,
                'countInStock': random.randint(5, 50),
                'description': item.get('description', '') or item.get('title', ''),
            }

            # Only update additional_images if we actually have new images, 
            # otherwise keep existing ones from seed
            new_imgs = item.get('additional_images', '[]')
            if new_imgs and new_imgs != '[]':
                defaults['additional_images'] = new_imgs

            product, created = Product.objects.update_or_create(
                asin=asin,
                defaults=defaults
            )
            mapped.append(cls._serialize_product(product))
        return mapped

    @staticmethod
    def _serialize_product(product):
        """Converts a Product model instance to a dictionary for API response."""
        import json
        try:
            additional_images = json.loads(product.additional_images or '[]')
            # Fallback if additional_images is empty but we have a main image
            if not additional_images and product.image:
                additional_images = [product.image]
        except:
            additional_images = [product.image] if product.image else []

        try:
            specifications = json.loads(product.specifications or '{}')
        except:
            specifications = {}

        try:
            variants = json.loads(product.variants or '[]')
        except:
            variants = []

        return {
            '_id': product._id,
            'asin': product.asin,
            'name': product.name,
            'image': product.image,
            'additional_images': additional_images,
            'specifications': specifications,
            'variants': variants,
            'isDeal': product.isDeal,
            'discountPercentage': product.discountPercentage,
            'price': float(product.price) if product.price else 0,
            'rating': float(product.rating) if product.rating else 0,
            'countInStock': product.countInStock,
            'brand': product.brand,
            'category': {'name': product.category.name if product.category else 'General'},
            'description': product.description
        }

