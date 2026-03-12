import asyncio
from playwright.async_api import async_playwright
import traceback

async def main():
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()

            page.on("console", lambda msg: print(f"BROWSER CONSOLE [{msg.type}]: {msg.text}"))
            page.on("pageerror", lambda err: print(f"BROWSER PAGE ERROR: {err}"))
            
            await page.add_init_script("""
                window.addEventListener('error', e => console.error('U_EX:', e.message));
                window.addEventListener('unhandledrejection', e => console.error('U_REJ:', e.reason));
            """)

            print("Navigating to homepage, waiting 15s for products to load...")
            await page.goto("http://localhost:5174/")
            
            # Wait for Amazon products to be fetched and rendered
            await page.wait_for_timeout(15000)

            product_links = await page.query_selector_all('a[href^="/product/"]')
            if product_links:
                print(f"Found {len(product_links)} product links. Clicking the first one!")
                await product_links[0].click()
            else:
                print("STILL No product links found to click after 15 seconds.")

            print("Waiting 5s on Product Details page...")
            await page.wait_for_timeout(5000)
            
            # Print page content to see if ErrorBoundary triggered
            content = await page.content()
            if "Something went wrong" in content:
                print("ERROR BOUNDARY RENDERED ON PAGE!")
                error_details = await page.eval_on_selector("details", "el => el.innerText")
                print("REACT STACK TRACE:\n", error_details)

            await browser.close()
    except Exception as e:
        print("Python Script Error:", e)
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
