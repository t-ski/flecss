const fs = require("fs");
const { resolve, join } = require("path");

const sass = require("sass");


const SOURCE_DIR_PATH = resolve("./src/");
const TARGET_DIR_PATH = resolve("./dist/");
const LIB_FILE_NAME = "lib";
const WATCH_INTERVAL = 1000;
const FLAG = {
    watch: process.argv.includes("--watch")
}


process.on("exit", (code) => {
    if(code) return;

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
});


let i = 0;
function scan(path = SOURCE_DIR_PATH) {
    const dirents = fs.readdirSync(path, {
        recursive: true,
        withFileTypes: true,
    });

    for(const dirent of dirents) {
        if(dirent.isDirectory()
        || (Date.now() - fs.statSync(join(dirent.path, dirent.name)).mtimeMs) > (i ? WATCH_INTERVAL : Infinity)) continue;
        
        const targetFilePath = join(TARGET_DIR_PATH, `${LIB_FILE_NAME}.css`);
        fs.writeFile(targetFilePath, transpile().css, null, () => {
            const date = new Date();
            console.log(`\x1b[2K\r\x1b[1A\x1b[2K\r\x1b[2m${
                [ date.getHours(), date.getMinutes(), date.getSeconds() ]
                .map((segment) => segment.toString().padStart(2, "0"))
                .join(":")
            }\x1b[22m \x1b[34m${
                "CSS library built with success"
            }${
                ` (${fs.statSync(targetFilePath).size}B/${(fs.statSync(targetFilePath).size / 1024).toFixed(2)}kB)`
            }${
                i++ ? ` \x1b[2m(${i}x)\x1b[22m` : ""
            }\x1b[0m`)
        });

        break;
    }

    if(!FLAG.watch) return;
    setTimeout(scan, WATCH_INTERVAL);
}

function transpile() {
    try{
        return sass.compile(join(SOURCE_DIR_PATH, `${LIB_FILE_NAME}.scss`), {
            style: FLAG.watch ? "expanded" : "compressed"
        });
    } catch(err) {
        console.error(`\x1b[31m${err}\x1b[0m`);

        !FLAG.watch && process.exit(1);
    }
}


fs.mkdirSync(TARGET_DIR_PATH, { recursive: true });

process.stdout.write("\n");
scan();