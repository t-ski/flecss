const fs = require("fs");
const path = require("path");

const puppeteer = require("puppeteer");

const flecss = require("../../lib/api");


const TEST_SCSS_PATH = path.join(__dirname, "./test.scss");
const TEST_CSS_PATH = path.join(__dirname, "./test.css");
const TEST_HTML_PATH = path.join(__dirname, "./end-to-end.test.html");


fs.writeFileSync(
    TEST_CSS_PATH,
    flecss
        .createTranspiler()
        .fromFile(TEST_SCSS_PATH, {
            isDevelopment: true
        }).css
);


setTimeout(() => {
    console.error(new RangeError("Virtual browser test timed out."));

    process.exit(2);
}, 10000);


puppeteer.launch({ headless: "shell" })
.then(async (browser) => {
    const page = await browser.newPage();

    const testPagePath = `${"file://"}${TEST_HTML_PATH}`;

    await page.setViewport({ width: 1440, height: 800, deviceScaleFactor: 1.0 });
    await page.goto(testPagePath);
    
    page.on("console", async (message) => {
        await browser.close();
        
        const wasSuccessful = message.text() == 0;
        
        wasSuccessful
        && console.log("\x1b[32mEnd-to-end (virtual browser) tests succeeded.\x1b[0m");
        !wasSuccessful
        && console.log("\x1b[31mEnd-to-end (virtual browser) tests failed.\x1b[0m");
        !wasSuccessful && console.log(`\x1b[2mCheck failures in browser:\n\x1b[34m${testPagePath}\x1b[0m`)

        process.exit(+!wasSuccessful);
    });    
});