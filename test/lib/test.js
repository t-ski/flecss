const { deepEqual } = require("assert");
const { join } = require("path");

const flecss = require("../../lib/api");


const TEST_SCSS_PATH = join(__dirname, "./_test.scss");
const TRANSPILED = flecss.transpileFile(TEST_SCSS_PATH);
const TRANSPILED_STANDALONE = flecss.transpileFile(TEST_SCSS_PATH, {
    isStandalone: true
});

deepEqual(TRANSPILED.loadedUrls.length, 3);
deepEqual(TRANSPILED.css.length > 100, true);
deepEqual(/a\{[^{}]*color:red[;}]/.test(TRANSPILED.css), true);
deepEqual(/a\{[^{}]*color:green[;}]/.test(TRANSPILED.css), false);

deepEqual(TRANSPILED_STANDALONE.loadedUrls.length, 1);
deepEqual(TRANSPILED_STANDALONE.css.length < 100, true);
deepEqual(/a\{[^{}]*color:red[;}]/.test(TRANSPILED_STANDALONE.css), true);
deepEqual(/.flex\{/.test(TRANSPILED_STANDALONE.css), false);


console.log("\x1b[32mLibrary test succeeded.\x1b[0m");