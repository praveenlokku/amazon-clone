import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Product, Category
from api.serializers import ProductSerializer

def test_api():
    print("--- Products in DB ---")
    for p in Product.objects.all():
        print(f"ID: {p._id}, Name: {p.name}")
        serializer = ProductSerializer(p)
        data = serializer.data
        print(f"Additional Images: {json.dumps(data.get('additional_images'))}")
        print("-" * 20)

if __name__ == '__main__':
    test_api()
