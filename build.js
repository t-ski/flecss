const fs = require("fs");
const { resolve, join } = require("path");

const sass = require("sass");


const APP_NAME = "flecss";
const SOURCE_DIR_PATH = resolve("./src/");
const TARGET_DIR_PATH = resolve("./dist/");
const LIB_FILE_NAME = "lib";
const WATCH_INTERVAL = 1000;
const FLAG = {
    watch: process.argv.includes("--watch")
}


process.on("exit", buildSCSS);
process.on("SIGINT", () => { buildSCSS(); process.exit(0); });


const lastError = {
    index: null,
    message: null
};
let i = 0;
function buildCSS(path = SOURCE_DIR_PATH) {
    const dirents = fs.readdirSync(path, {
        recursive: true,
        withFileTypes: true,
    });

    for(const dirent of dirents) {
        if(dirent.isDirectory()
        || ((i !== lastError.index)
            && (Date.now() - fs.statSync(join(dirent.path, dirent.name)).mtimeMs) > (i ? WATCH_INTERVAL : Infinity))) continue;
        
        let transpilation;
        try{
            transpilation = sass.compile(join(SOURCE_DIR_PATH, `${LIB_FILE_NAME}.scss`), {
                style: FLAG.watch ? "expanded" : "compressed"
            });
        } catch(err) {
            !FLAG.watch && process.exit(1);

            ((i !== lastError.index) || err.toString() !== lastError.message)
            && console.error(`\x1b[31m${err}\x1b[0m`);
                        
            lastError.index = i;
            lastError.message = err.toString();

            break;
        }
        
        const printNumber = (value) => value.toLocaleString();
        const targetFilePath = join(TARGET_DIR_PATH, `${LIB_FILE_NAME}.css`);
        fs.writeFile(targetFilePath, transpilation.css, null, () => {
            const date = new Date();
            console.log(`${
                (i !== lastError.index) ? "\x1b[2K\r\x1b[1A\x1b[2K\r" : ""
            }\x1b[2m${
                [ date.getHours(), date.getMinutes(), date.getSeconds() ]
                .map((segment) => segment.toString().padStart(2, "0"))
                .join(":")
            }\x1b[22m \x1b[34m${
                `\x1b[1m${APP_NAME}\x1b[22m library built with success`
            }\x1b[2m${
                ` (${printNumber(fs.statSync(targetFilePath).size)} B / ${printNumber((fs.statSync(targetFilePath).size / 1024).toFixed(2))} kB)`
            }${
                i++ ? ` (${i}x)` : ""
            }\x1b[0m`)
        });

        break;
    }

    if(!FLAG.watch) return;
    setTimeout(buildCSS, WATCH_INTERVAL);
}

function buildSCSS() {
    const scssModules = [];
    transpile().loadedUrls
    .forEach((loadedUrl) => {
        const scss = fs.readFileSync(loadedUrl)
        .toString()
        .replace(/@import +[^);\n]+\)? *;? *\n?/g, "")
        .trim();
        scss.length && scssModules.push(scss);
    });
    fs.writeFileSync(join(TARGET_DIR_PATH, `${LIB_FILE_NAME}.scss`), scssModules.join("\n"));
}

function transpile() {
    return sass.compile(join(SOURCE_DIR_PATH, `${LIB_FILE_NAME}.scss`), {
        style: FLAG.watch ? "expanded" : "compressed"
    });
}


fs.mkdirSync(TARGET_DIR_PATH, { recursive: true });

process.stdout.write("\n");
buildCSS();