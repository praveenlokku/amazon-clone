import requests
from bs4 import BeautifulSoup
import time
import random

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Cache-Control': 'max-age=0',
}

def test_scrape(search_term="laptops"):
    url = f"https://www.amazon.in/s?k={search_term.replace(' ', '+')}"
    print(f"Scraping {url}...")
    try:
        response = requests.get(url, headers=HEADERS, timeout=15)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            if '<form action="/errors/validateCaptcha"' in response.text:
                print("BLOCKED: CAPTCHA detected.")
            else:
                print("SUCCESS: Page loaded without CAPTCHA.")
                soup = BeautifulSoup(response.content, 'lxml')
                items = soup.find_all('div', {'data-component-type': 's-search-result'})
                print(f"Found {len(items)} items.")
        elif response.status_code == 503:
            print("BLOCKED: 503 Error.")
        else:
            print(f"Unexpected Status: {response.status_code}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    test_scrape()
    time.sleep(2)
    test_scrape("mobiles")
