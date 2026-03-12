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
            'name': 'Apple iPhone 15 (128 GB) - Black',
            'image': 'https://m.media-amazon.com/images/I/71657TiFeHL._SX679_.jpg',
            'brand': 'Apple',
            'category': electronics,
            'description': 'DYNAMIC ISLAND COMES TO IPHONE 15 — Dynamic Island bubbles up alerts and Live Activities — so you don’t miss them while you’re doing something else. You can see who’s calling, track your next ride, check your flight status, and so much more.',
            'rating': 4.6,
            'numReviews': 14500,
            'price': 79900.00,
            'countInStock': 50,
        },
        {
            'name': 'Apple MacBook Air Laptop M1 chip, 13.3-inch/33.74 cm Retina Display, 8GB RAM, 256GB SSD Storage, Backlit Keyboard, FaceTime HD Camera, Touch ID. Works with iPhone/iPad; Space Grey',
            'image': 'https://m.media-amazon.com/images/I/71jG+e7roXL._SX679_.jpg',
            'brand': 'Apple',
            'category': electronics,
            'description': 'All-Day Battery Life – Go longer than ever with up to 18 hours of battery life. Powerful Performance – Take on everything from professional-quality editing to action-packed gaming with ease.',
            'rating': 4.7,
            'numReviews': 8230,
            'price': 83990.00,
            'countInStock': 25,
        },
        {
            'name': 'Sony WH-1000XM5 Wireless Active Noise Cancelling Headphones, 8 Mics for Clear Calling, 30Hr Battery, 3 Min Super Fast Charge, Multipoint Connectivity - Black',
            'image': 'https://m.media-amazon.com/images/I/61vJtKbAssL._SX679_.jpg',
            'brand': 'Sony',
            'category': electronics,
            'description': 'Industry-leading noise cancellation optimized to you. Magnificent Sound, engineered to perfection. Crystal clear hands-free calling.',
            'rating': 4.4,
            'numReviews': 4500,
            'price': 29990.00,
            'countInStock': 100,
        },
        {
            'name': 'Puma Men\'s Dazzler Sneakers',
            'image': 'https://m.media-amazon.com/images/I/61B1qIfiBTL._SY695_.jpg',
            'brand': 'Puma',
            'category': fashion,
            'description': 'Sole: Rubber | Closure: Lace-Up | Fit Type: Regular | Shoe Width: Medium | Upper Material: Synthetic',
            'rating': 4.1,
            'numReviews': 15600,
            'price': 1499.00,
            'countInStock': 120,
        },
        {
            'name': 'Pigeon Polypropylene Mini Handy and Compact Chopper with 3 Blades for Effortlessly Chopping Vegetables and Fruits for Your Kitchen (12420, Green, 400 ml)',
            'image': 'https://m.media-amazon.com/images/I/51EZhJ3A3eL._SX679_.jpg',
            'brand': 'Pigeon',
            'category': home,
            'description': 'Made from high quality 100% food grade Plastic that is BPA free. Spring action mechanism that allows easy pulling and lasts long.',
            'rating': 4.2,
            'numReviews': 250000,
            'price': 199.00,
            'countInStock': 500,
        },
        {
            'name': 'L\'Oreal Paris Moisture Filling Shampoo, With Hyaluronic Acid, For Dry & Dehydrated Hair, Adds Shine & Bounce, Hyaluron Moisture 72H, 1L',
            'image': 'https://m.media-amazon.com/images/I/51HBE23hZTL._SX679_.jpg',
            'brand': 'L\'Oreal Paris',
            'category': beauty,
            'description': 'Moisture filling shampoo for dry and dehydrated hair. Cleanses and hydrates hair from root to tip, Leaving it bouncy, shiny, and free-flowing.',
            'rating': 4.3,
            'numReviews': 12300,
            'price': 899.00,
            'countInStock': 45,
        },
        {
            'name': 'Samsung 108 cm (43 inches) Crystal iSmart 4K Ultra HD Smart LED TV UA43CUE60AKLXL (Black)',
            'image': 'https://m.media-amazon.com/images/I/711T1hM-iQL._SX679_.jpg',
            'brand': 'Samsung',
            'category': electronics,
            'description': 'Resolution: 4K Ultra HD (3840 x 2160) | Refresh Rate: 50 Hertz. Connectivity: 3 HDMI ports to connect set top box, Blu-ray speakers or a gaming console | 1 USB port to connect hard drives or other USB devices.',
            'rating': 4.2,
            'numReviews': 6700,
            'price': 28990.00,
            'countInStock': 15,
        },
        {
            'name': 'Noise Pulse 2 Max 1.85" Display, Bluetooth Calling Smart Watch, 10 Days Battery, 550 NITS Brightness, Smart DND, 100 Sports Modes, Smartwatch for Men and Women (Jet Black)',
            'image': 'https://m.media-amazon.com/images/I/61ZuL8CUigL._SX679_.jpg',
            'brand': 'Noise',
            'category': electronics,
            'description': '1.85” TFT LCD: The smart watch features a massive 1.85” display. 550 Nits brightness: Enjoy easy viewing even in bright sunlight. BT calling: Talk directly to your loved ones from your wrist; manage calls, access your favourite contacts and dial from the dial pad.',
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
