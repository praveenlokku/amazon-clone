import requests
import os
from django.conf import settings
from .models import Product, Category

class AmazonService:
    """
    Service to fetch real Amazon product data using Rainforest API or similar.
    Includes a database caching mechanism to store results in our local DB.
    """
    
    API_KEY = os.getenv('RAPIDAPI_KEY', '')
    API_HOST = os.getenv('RAPIDAPI_HOST', 'amazon-data-scraper110.p.rapidapi.com')

    @classmethod
    def search_products(cls, search_term, category_name=None):
        if not cls.API_KEY:
            print("Warning: No RAPIDAPI_KEY found. Using mock-real data.")
            return cls._get_mock_real_data(search_term)

        url = f"https://{cls.API_HOST}/search/{search_term}"
        
        headers = {
            "x-rapidapi-host": cls.API_HOST,
            "x-rapidapi-key": cls.API_KEY,
            "Content-Type": "application/json"
        }
        
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            # The Amazon Data Scraper returns results usually inside a 'results' or similar key, or as a list
            results = data.get('results', []) if isinstance(data, dict) else data
            return cls._map_and_save_results(results, category_name)
        except Exception as e:
            print(f"Error fetching from Amazon API: {e}")
            return cls._get_mock_real_data(search_term)

    @classmethod
    def get_product_details(cls, asin):
        """Fetches product details, prioritizing local DB cache."""
        try:
            product = Product.objects.get(asin=asin)
            return cls._serialize_product(product)
        except Product.DoesNotExist:
            pass

        if not cls.API_KEY:
            return None

        url = f"https://{cls.API_HOST}/product/{asin}"
        
        headers = {
            "x-rapidapi-host": cls.API_HOST,
            "x-rapidapi-key": cls.API_KEY,
            "Content-Type": "application/json"
        }

        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            if data:
                product_obj = cls._save_to_db(data)
                return cls._serialize_product(product_obj)
            return None
        except Exception as e:
            print(f"Error fetching product details: {e}")
            return None

    @classmethod
    def _map_and_save_results(cls, results, category_name):
        """Maps external API response to our local Product schema and saves to DB."""
        mapped = []
        category, _ = Category.objects.get_or_create(name=category_name or 'Real Amazon Item')

        # Limit to 10 results to not overload DB in dev
        for item in results[:10]:
            asin = item.get('asin')
            if not asin: continue

            # Handle price string to float conversion mapping
            price_val = 0
            raw_price = item.get('price', '0')
            if isinstance(raw_price, dict):
                price_val = float(raw_price.get('value', 0) or 0)
            elif isinstance(raw_price, str):
                try:
                    price_val = float(raw_price.replace('₹', '').replace('$', '').replace(',', '').strip() or 0)
                except:
                    price_val = 0
            elif isinstance(raw_price, (int, float)):
                price_val = float(raw_price)

            product, created = Product.objects.update_or_create(
                asin=asin,
                defaults={
                    'name': item.get('title')[:200] if item.get('title') else 'Unknown',
                    'image': item.get('thumbnail') or item.get('image'),
                    'price': price_val,
                    'rating': item.get('stars', 0) or item.get('rating', 0),
                    'brand': item.get('brand', 'Amazon'),
                    'category': category,
                    'countInStock': 10,
                    'description': item.get('title')
                }
            )
            mapped.append(cls._serialize_product(product))
        return mapped

    @classmethod
    def _save_to_db(cls, item):
        category, _ = Category.objects.get_or_create(name='Real Amazon Item')
        
        price_val = 0
        raw_price = item.get('price', '0')
        if isinstance(raw_price, dict):
            price_val = float(raw_price.get('value', 0) or 0)
        elif isinstance(raw_price, str):
            try:
                price_val = float(raw_price.replace('₹', '').replace('$', '').replace(',', '').strip() or 0)
            except:
                price_val = 0
        elif isinstance(raw_price, (int, float)):
            price_val = float(raw_price)
            
        product, _ = Product.objects.update_or_create(
            asin=item.get('asin'),
            defaults={
                'name': item.get('title')[:200] if item.get('title') else 'Unknown',
                'image': item.get('main_image') or item.get('image'),
                'price': price_val,
                'rating': item.get('stars', 0) or item.get('rating', 0),
                'brand': item.get('brand', 'Amazon'),
                'category': category,
                'countInStock': 10,
                'description': item.get('description') or item.get('title')
            }
        )
        return product

    @staticmethod
    def _serialize_product(product):
        """Converts a Product model instance to a dictionary for API response."""
        return {
            '_id': product._id,
            'asin': product.asin,
            'name': product.name,
            'image': product.image,
            'price': float(product.price) if product.price else 0,
            'rating': float(product.rating) if product.rating else 0,
            'countInStock': product.countInStock,
            'brand': product.brand,
            'category': {'name': product.category.name if product.category else 'General'},
            'description': product.description
        }

    @staticmethod
    def _get_mock_real_data(search_term):
        valid_images = [
            "https://m.media-amazon.com/images/I/41-lS7+xM4L._AC_SL1500_.jpg",
            "https://m.media-amazon.com/images/I/41uS8IovmHL._AC_SL1500_.jpg",
            "https://m.media-amazon.com/images/I/41-qX8Y-eUL._AC_SL1500_.jpg",
            "https://m.media-amazon.com/images/I/41m9O-pEaDL._AC_SL1500_.jpg",
            "https://m.media-amazon.com/images/I/41rT2uS1rDL._AC_SL1500_.jpg",
            "https://m.media-amazon.com/images/I/41vK2S-xXKL._AC_SL1500_.jpg",
            "https://m.media-amazon.com/images/I/41wR2uS-rPL._AC_SL1500_.jpg",
            "https://m.media-amazon.com/images/I/41X8-E-pURL._AC_SL1500_.jpg"
        ]
        return [
            {
                '_id': 9990 + i,
                'asin': f"MOCK_{i}",
                'name': f"Premium {search_term} - Variant {i}",
                'image': valid_images[i - 1],
                'price': 1299.00 + (i * 100),
                'rating': 4.5,
                'countInStock': 5,
                'brand': "Amazon Vendor",
                'category': {'name': 'Featured'},
                'description': f"This is a premium {search_term} with excellent build quality and warranty."
            } for i in range(1, 9)
        ]
