const { deepEqual } = require("assert");
const { join } = require("path");

const flecss = require("../../lib/api");


const SCSS_FILE_PATH = join(__dirname, "./_test.scss");


const transpiled = flecss
    .createTranspiler({
        development: true
    })
    .fromFile(SCSS_FILE_PATH);

deepEqual(transpiled.loadedUrls.length, 26);
deepEqual(transpiled.css.length > 100, true);
deepEqual(/a\s*\{\s*color:\s*red\s*[;}]/.test(transpiled.css), true);
deepEqual(/a\s*\{\s*color:\s*green\s*[;}]/.test(transpiled.css), true);

const transpiledStandalone = flecss
    .createTranspiler({
        library: "standalone"
    })
    .fromFile(SCSS_FILE_PATH);

deepEqual(transpiledStandalone.loadedUrls.length, 1);
deepEqual(transpiledStandalone.css.length < 100, true);
deepEqual(/a\s*\{\s*color:\s*red\s*[;}]/.test(transpiledStandalone.css), true);
deepEqual(/a\s*\{\s*color:\s*green\s*[;}]/.test(transpiledStandalone.css), false);


console.log("\x1b[32mUnit tests succeeded.\x1b[0m");