import requests
import os
from dotenv import load_dotenv

# Load environment variables from backend/.env
# Assuming we are in the root directory relative to c:\Users\Praveen\Desktop\amazonclone
# Let's adjust the path if needed, but easier to just use the values we already read.

API_KEY = "b9c0ccb859msh61d334771dda989p12c291jsnea42ee825d6f"
API_HOST = "amazon-product-data6.p.rapidapi.com"

endpoints = [
    ("/products/search", {"query": "laptop"}),
    ("/product/search", {"query": "laptop"}),
    ("/api/v1/search", {"query": "laptop"}),
    ("/search-products", {"query": "laptop"}),
    ("/search", {"q": "laptop"}),
]

headers = {
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": API_HOST
}

for endpoint, params in endpoints:
    url = f"https://{API_HOST}{endpoint}"
    print(f"Testing {url} with params {params}...")
    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        print(f"Status Code: {response.status_code}")
        # print(f"Response: {response.text[:200]}...")
        if response.status_code == 200:
            print("SUCCESS!")
            # print(response.json())
            break
    except Exception as e:
        print(f"Error: {e}")
    print("-" * 20)
