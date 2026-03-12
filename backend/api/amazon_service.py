import requests
import os
from django.conf import settings
from .models import Product, Category

class AmazonService:
    """
    Service to fetch real Amazon product data using Rainforest API or similar.
    Includes a database caching mechanism to store results in our local DB.
    """
    
    API_KEY = os.getenv('AMAZON_API_KEY', '')
    BASE_URL = "https://api.rainforestapi.com/request"

    @classmethod
    def search_products(cls, search_term, category_name=None):
        if not cls.API_KEY:
            print("Warning: No AMAZON_API_KEY found. Using mock-real data.")
            return cls._get_mock_real_data(search_term)

        params = {
            'api_key': cls.API_KEY,
            'type': 'search',
            'amazon_domain': 'amazon.in',
            'search_term': search_term,
        }
        
        try:
            response = requests.get(cls.BASE_URL, params=params)
            response.raise_for_status()
            data = response.json()
            return cls._map_and_save_results(data.get('search_results', []), category_name)
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

        params = {
            'api_key': cls.API_KEY,
            'type': 'product',
            'amazon_domain': 'amazon.in',
            'asin': asin
        }

        try:
            response = requests.get(cls.BASE_URL, params=params)
            response.raise_for_status()
            data = response.json()
            product_data = data.get('product')
            if product_data:
                product_obj = cls._save_to_db(product_data)
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

        for item in results:
            asin = item.get('asin')
            if not asin: continue

            price_val = item.get('price', {}).get('value', 0)
            product, created = Product.objects.update_or_create(
                asin=asin,
                defaults={
                    'name': item.get('title'),
                    'image': item.get('image'),
                    'price': price_val,
                    'rating': item.get('rating', 0),
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
        product, _ = Product.objects.update_or_create(
            asin=item.get('asin'),
            defaults={
                'name': item.get('title'),
                'image': item.get('main_image') or item.get('image'),
                'price': item.get('price', {}).get('value', 0),
                'rating': item.get('rating', 0),
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
        return [
            {
                '_id': 9990 + i,
                'asin': f"MOCK_{i}",
                'name': f"Real-World {search_term} Item {i}",
                'image': f"https://m.media-amazon.com/images/I/71{i}p-S-1HL._AC_SL1500_.jpg",
                'price': 1299.00 + (i * 100),
                'rating': 4.5,
                'countInStock': 5,
                'brand': "Premium Brand",
                'category': {'name': 'Featured'},
                'description': f"This is a real-looking description for {search_term}. High performance and quality guaranteed."
            } for i in range(1, 9)
        ]
