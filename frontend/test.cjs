const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('pageerror', err => {
        console.log('PAGE ERROR:', err.toString());
    });

    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('CONSOLE ERROR:', msg.text());
        }
    });

    await page.goto('http://localhost:5174/');
    await page.waitForSelector('.group', { timeout: 5000 });

    // Click the first product link
    await page.click('a[href^="/product/"]');

    // Wait a bit to see if we navigate and crash
    await new Promise(r => setTimeout(r, 2000));

    // Or check if homepage crashes when going back
    await page.goBack();
    await new Promise(r => setTimeout(r, 2000));

    await browser.close();
})();
