import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Product, Category
from django.contrib.auth.models import User

def seed_data():
    # Clear existing data
    Product.objects.all().delete()
    Category.objects.all().delete()
    
    # Create Categories
    electronics = Category.objects.create(name='Electronics', slug='electronics', image='https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2020/May/Dashboard/Fuji_Dash_Electronics_1x._SY304_CB432774322_.jpg')
    home = Category.objects.create(name='Home', slug='home', image='https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2020/May/Dashboard/Fuji_Dash_HomeBedding_1x._SY304_CB428564660_.jpg')
    fashion = Category.objects.create(name='Fashion', slug='fashion', image='https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2020/May/Dashboard/Fuji_Dash_Fashion_1x._SY304_CB432774322_.jpg')
    beauty = Category.objects.create(name='Beauty', slug='beauty', image='https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2020/May/Dashboard/Fuji_Dash_Beauty_1x._SY304_CB432774322_.jpg')

    # Create Products
    products = [
        {
            'asin': 'B0CHX2F5QT',
            'name': 'Apple iPhone 15 (128 GB) - Black',
            'image': 'https://m.media-amazon.com/images/I/71657TiFeHL._SX679_.jpg',
            'additional_images': '["https://m.media-amazon.com/images/I/71657TiFeHL._SX679_.jpg", "https://m.media-amazon.com/images/I/71v2jVh6nIL._SX679_.jpg", "https://m.media-amazon.com/images/I/516R0GzFp6L._SX679_.jpg", "https://m.media-amazon.com/images/I/71B9B494KML._SX679_.jpg"]',
            'brand': 'Apple',
            'category': electronics,
            'description': 'DYNAMIC ISLAND COMES TO IPHONE 15 — Dynamic Island bubbles up alerts and Live Activities — so you don’t miss them while you’re doing something else. You can see who’s calling, track your next ride, check your flight status, and so much more.',
            'rating': 4.6,
            'numReviews': 14500,
            'price': 79900.00,
            'countInStock': 50,
            'isDeal': True,
            'discountPercentage': 12,
            'specifications': '{"Model Name": "iPhone 15", "Wireless Provider": "Unlocked for All Carriers", "Operating System": "iOS", "Cellular Technology": "5G", "Storage": "128 GB", "Screen Size": "6.1 Inches"}',
            'variants': '[{"type": "Color", "values": ["Black", "Blue", "Green", "Yellow", "Pink"]}, {"type": "Storage", "values": ["128GB", "256GB", "512GB"]}]'
        },
        {
            'asin': 'B08N5XSG89',
            'name': 'Apple MacBook Air Laptop M1 chip',
            'image': 'https://m.media-amazon.com/images/I/71jG+e7roXL._SX679_.jpg',
            'additional_images': '["https://m.media-amazon.com/images/I/71jG+e7roXL._SX679_.jpg", "https://m.media-amazon.com/images/I/71f5Eu5lJSL._SX679_.jpg", "https://m.media-amazon.com/images/I/71y6PHT4ZtL._SX679_.jpg"]',
            'brand': 'Apple',
            'category': electronics,
            'description': 'All-Day Battery Life – Go longer than ever with up to 18 hours of battery life. Powerful Performance – Take on everything from professional-quality editing to action-packed gaming with ease.',
            'rating': 4.7,
            'numReviews': 8230,
            'price': 83990.00,
            'countInStock': 25,
            'isDeal': False,
            'specifications': '{"Model Name": "MacBook Air", "Screen Size": "13.3 Inches", "Hard Disk Size": "256 GB", "CPU Model": "Apple M1", "RAM Memory Installed Size": "8 GB", "Operating System": "Mac OS"}',
        },
        {
            'asin': '1847941834',
            'name': 'Atomic Habits: Tiny Changes, Remarkable Results',
            'image': 'https://m.media-amazon.com/images/I/91bYsX41DVL.jpg',
            'additional_images': '["https://m.media-amazon.com/images/I/91bYsX41DVL.jpg", "https://m.media-amazon.com/images/I/71y6-2vXjXL.jpg", "https://m.media-amazon.com/images/I/51LTCXyBRwL.jpg"]',
            'brand': 'James Clear',
            'category': home,
            'description': 'Atomic Habits is the most comprehensive and practical guide on how to create good habits, break bad ones, and get 1 percent better every day.',
            'rating': 4.8,
            'numReviews': 450000,
            'price': 521.00,
            'countInStock': 1000,
            'specifications': '{"Author": "James Clear", "Format": "Paperback", "Pages": "288", "Language": "English", "ISBN-10": "1847941834"}',
        },
        {
            'name': 'Noise Pulse 2 Max 1.85" Display, Bluetooth Calling Smart Watch',
            'image': 'https://m.media-amazon.com/images/I/61ZuL8CUigL._SX679_.jpg',
            'additional_images': '["https://m.media-amazon.com/images/I/61ZuL8CUigL._SX679_.jpg", "https://m.media-amazon.com/images/I/61vYfBfWzDL._SX679_.jpg", "https://m.media-amazon.com/images/I/71Xm06qfK2L._SX679_.jpg", "https://m.media-amazon.com/images/I/61mNnOlvzHL._SX679_.jpg"]',
            'brand': 'Noise',
            'category': electronics,
            'description': '1.85” TFT LCD: The smart watch features a massive 1.85” display. 550 Nits brightness: Enjoy easy viewing even in bright sunlight. BT calling.',
            'rating': 4.0,
            'numReviews': 78000,
            'price': 1199.00,
            'countInStock': 300,
        }
    ]

    for p in products:
        Product.objects.create(**p)

    print('Database seeded successfully!')

if __name__ == '__main__':
    seed_data()
