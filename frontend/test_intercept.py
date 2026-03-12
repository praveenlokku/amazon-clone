import asyncio
from playwright.async_api import async_playwright
import traceback
import json

mock_products = [
    {
        "_id": 1,
        "asin": "B08L5WHFT9",
        "name": "Mock Amazon Product",
        "image": "https://m.media-amazon.com/images/I/41m9O-pEaDL._AC_SY170_.jpg",
        "price": 999.00,
        "rating": 4.5,
        "countInStock": 10,
        "brand": "Amazon",
        "category": {"name": "Laptops"},
        "description": "A very nice mock laptop."
    }
]

async def main():
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()

            # Record errors
            page.on("console", lambda msg: print(f"BROWSER CONSOLE [{msg.type}]: {msg.text}"))
            page.on("pageerror", lambda err: print(f"BROWSER PAGE ERROR: {err}"))
            
            await page.add_init_script("""
                window.addEventListener('error', e => console.error('U_EX:', e.message));
            """)

            # Route network requests to always return our mock product list so Playwright has something to click!
            async def intercept(route):
                if "api/amazon/search" in route.request.url or "api/products" in route.request.url:
                    await route.fulfill(
                        status=200,
                        content_type="application/json",
                        body=json.dumps(mock_products)
                    )
                else:
                    await route.continue_()

            await page.route("**/*", intercept)

            print("Navigating to homepage...")
            await page.goto("http://localhost:5174/")
            await page.wait_for_timeout(2000)

            print("Looking for product links...")
            # The ProductCarouselRow renders links to /product/1
            product_links = await page.query_selector_all('a[href^="/product/"]')
            if product_links:
                print(f"Found {len(product_links)} product links. Clicking the first one!")
                await product_links[0].click()
            else:
                print("No product links found to click.")

            await page.wait_for_timeout(3000)
            
            print("Clicking Go Back...")
            await page.go_back()
            await page.wait_for_timeout(2000)

            await browser.close()
    except Exception as e:
        print("Python Script Error:", e)
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
