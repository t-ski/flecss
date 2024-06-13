const fs = require("fs");
const path = require("path");

const _config = require("./_config.json");

const { transpile } = require("./lib/api");


function buildSCSS() {
    const targetFilePath = path.resolve("./dist/", `${_config.appName}.scss`);
    fs.mkdirSync(path.dirname(targetFilePath), { recursive: true });
    
    const scssModules = [];
    transpile(path.resolve("./src/", `${_config.appName}.scss`), {
        isStandalone: true
    }).loadedUrls
    .forEach((loadedUrl) => {
        const scss = fs.readFileSync(loadedUrl)
        .toString()
        .replace(/@import +[^);\n]+\)? *;? *\n?/g, "")
        .trim();
        scss.length && scssModules.push(scss);
    });

    fs.writeFileSync(targetFilePath, scssModules.join("\n"));
}


process.on("exit", (code) => {
    if(code) return;
    
    buildSCSS();
    
    const readmePath = path.join(__dirname, "./README.md");
    fs.writeFileSync(
        readmePath,
        fs.readFileSync(readmePath).toString()
        .replace(/&#8232;`[0-9]*kB`/, `&#8232;\`${
            Math.round(fs.statSync(path.join(__dirname, "./dist/flecss.css")).size / 1024)
        }kB\``)
    );
});
process.on("SIGINT", () => process.exit(0));

console.log(`${
    " ".repeat(3 * (2 + (2/3)) + 1)
}\x1b[1m\x1b[2m${"development build".toUpperCase()}\x1b[0m`);

require("./lib/cli");