import requests
import os
from dotenv import load_dotenv

# Load environment variables from backend/.env
# Assuming we are in the root directory relative to c:\Users\Praveen\Desktop\amazonclone
# Let's adjust the path if needed, but easier to just use the values we already read.

API_KEY = "7f97003d44mshd3602cdbe70105ap13e67djsn468b74b82bb0"
API_HOST = "real-time-amazon-data.p.rapidapi.com"
import time

endpoints = [
    ("/top-product-reviews", {"asin": "B00939I7EK", "country": "US"}),
    ("/v1/products/search", {"query": "laptop", "page": "1", "country": "IN"}),
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
        if response.status_code == 200:
            print("SUCCESS!")
            break
        elif response.status_code == 429:
            print("Rate limit hit. Waiting 5 seconds...")
            time.sleep(5)
    except Exception as e:
        print(f"Error: {e}")
    
    print("Waiting 2 seconds before next trial...")
    time.sleep(2)
    print("-" * 20)
