const { deepEqual } = require("assert");
const { join } = require("path");

const flecss = require("../../lib/api");


const TRANSPILED = flecss.transpile(join(__dirname, "./_test.scss"));

deepEqual(TRANSPILED.loadedUrls.length, 1);
deepEqual(TRANSPILED.css.length > 100, true);
deepEqual(TRANSPILED.css.includes("a{color:green}a{color:red}"), true);

console.log("\x1b[32mLibrary test succeeded.\x1b[0m");