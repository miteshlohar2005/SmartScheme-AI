const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.goto('http://localhost:5173/');
        // Wait specifically for something in the hero
        await page.waitForSelector('.hero-container');
        // Give the Canvas a moment
        await new Promise(r => setTimeout(r, 2000));

        const html = await page.evaluate(() => {
            const el = document.querySelector('.hero-container');
            return el ? el.innerHTML : 'Not found';
        });

        fs.writeFileSync('hero.html', html);
        console.log('Done');
        await browser.close();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
