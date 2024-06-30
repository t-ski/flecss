const { deepEqual } = require("assert");
const { join } = require("path");

const flecss = require("../../lib/api");


const TRANSPILED = flecss.transpile(join(__dirname, "./_test.scss"));

deepEqual(TRANSPILED.loadedUrls.length, 1);
deepEqual(TRANSPILED.coreCSS.length > 100, true);
deepEqual(TRANSPILED.sourceCSS, "a{color:green}a{color:red}");

console.log("\x1b[32mLibrary test succeeded.\x1b[0m");