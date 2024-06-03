const { readdirSync, statSync, writeFile } = require("fs");
const { resolve, join } = require("path");

const sass = require("sass");


const SOURCE_DIR_PATH = resolve("./src/");
const SOURCE_FILE_PATH = join(SOURCE_DIR_PATH, "./lib.scss");
const TARGET_FILE_PATH = resolve("./lib.css");
const WATCH_INTERVAL = 1000;
const FLAG = {
    watch: process.argv.includes("--watch")
}


let i = 0;
function scan(path = SOURCE_DIR_PATH) {
    const dirents = readdirSync(path, {
        recursive: true,
        withFileTypes: true,
    });

    for(const dirent of dirents) {
        if(dirent.isDirectory()
        || (Date.now() - statSync(join(dirent.path, dirent.name)).mtimeMs) > (i ? WATCH_INTERVAL : Infinity)) continue;
        
        writeFile(TARGET_FILE_PATH, sass.compile(SOURCE_FILE_PATH, {
            style: FLAG.watch ? "expanded" : "compressed"
        }).css, null, () => {
            const date = new Date();
            console.log(`\x1b[2K\r\x1b[1A\x1b[2K\r\x1b[2m${
                [ date.getHours(), date.getMinutes(), date.getSeconds() ]
                .map((segment) => segment.toString().padStart(2, "0"))
                .join(":")
            }\x1b[22m \x1b[34m${
                `CSS library built with success (${statSync(TARGET_FILE_PATH).size}B/${(statSync(TARGET_FILE_PATH).size / 1024).toFixed(2)}kB)`
            }${
                i++ ? ` \x1b[2m(${i}x)\x1b[22m` : ""
            }\x1b[0m`)
        });

        break;
    }

    if(!FLAG.watch) return;
    setTimeout(scan, WATCH_INTERVAL);
}


process.stdout.write("\n");
scan();