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

    @classmethod
    def search_products(cls, search_term, category_name=None):
        url = f"https://www.amazon.in/s?k={search_term.replace(' ', '+')}"
        
        try:
            # Add small delay to prevent immediate bot detection
            time.sleep(random.uniform(0.5, 1.5))
            response = requests.get(url, headers=cls.HEADERS, timeout=10)
            
            if response.status_code == 503 or '<form action="/errors/validateCaptcha"' in response.text:
                print("Amazon returned a CAPTCHA or 503 blocked the request.")
                if search_term != 'bestsellers':
                    return cls.search_products('bestsellers', category_name)
                return []
                
            soup = BeautifulSoup(response.content, 'lxml')
            items = soup.find_all('div', {'data-component-type': 's-search-result'})
            
            if not items:
                print("No search results found on the page or selector changed.")
                if search_term != 'bestsellers':
                    print(f"Falling back {search_term} block to bestsellers.")
                    return cls.search_products('bestsellers', category_name)
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
                    return cls.search_products('bestsellers', category_name)
                return []
                
            return cls._map_and_save_results(results, category_name)
            
        except Exception as e:
            print(f"Error scraping Amazon directly: {e}")
            if search_term != 'bestsellers':
                return cls.search_products('bestsellers', category_name)
            return []

    @classmethod
    def get_product_details(cls, asin):
        """Fetches product details, prioritizing local DB cache."""
        try:
            product = Product.objects.get(asin=asin)
            return cls._serialize_product(product)
        except Product.DoesNotExist:
            return None

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

            product, created = Product.objects.update_or_create(
                asin=asin,
                defaults={
                    'name': item.get('title')[:200] if item.get('title') else 'Unknown',
                    'image': img,
                    'price': price_val,
                    'rating': item.get('stars', 0),
                    'brand': item.get('brand', 'Amazon'),
                    'category': category,
                    'countInStock': random.randint(5, 50),
                    'description': item.get('description') or item.get('title'),
                    # For real Amazon items, we'll try to guess some variant images or just keep it empty for now
                    # Real scraping of gallery images usually requires a separate request to the product page
                    'additional_images': item.get('additional_images', '[]')
                }
            )
            mapped.append(cls._serialize_product(product))
        return mapped

    @staticmethod
    def _serialize_product(product):
        """Converts a Product model instance to a dictionary for API response."""
        import json
        try:
            additional_images = json.loads(product.additional_images or '[]')
        except:
            additional_images = []

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

