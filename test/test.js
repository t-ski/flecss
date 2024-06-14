const path = require("path");

const puppeteer = require("puppeteer");


setTimeout(() => {
    console.error(new RangeError("Virtual browser test timed out."));
    
    process.exit(2);
}, 10000);


puppeteer.launch()
.then(async (browser) => {
    const page = await browser.newPage();
    
    const testPagePath = `${"file://"}${path.join(__dirname, "./test.html")}`;

    await page.setViewport({ width: 1440, height: 800, deviceScaleFactor: 1.0 });
    await page.goto(testPagePath);

    page.on("console", async (message) => {
        await browser.close();

        const wasSuccessful = message.text() == 0;
        
        wasSuccessful
        && console.log("\x1b[32mVirtual browser test succeeded.\x1b[0m");
        !wasSuccessful
        && console.log("\x1b[31mVirtual browser test failed.\x1b[0m");
        !wasSuccessful && console.log(`\x1b[2mCheck failures in browser:\n\x1b[34m${testPagePath}\x1b[0m`)
        
        process.exit(+wasSuccessful);
    });    
});