const fs = require("fs");
const path = require("path");

const _config = require("./_config.json");

const { transpile } = require("./lib/api");


function buildSCSS() {
    const targetFilePath = path.resolve("./dist/", `${_config.appName}.scss`);
    fs.mkdirSync(path.dirname(targetFilePath), { recursive: true });

    const scssModules = [];
    transpile(path.resolve("./src/", `${_config.appName}.scss`)).loadedUrls
    .forEach((loadedUrl) => {
        const scss = fs.readFileSync(loadedUrl)
        .toString()
        .replace(/@import +[^);\n]+\)? *;? *\n?/g, "")
        .trim();
        scss.length && scssModules.push(scss);
    });
    
    fs.writeFileSync(targetFilePath, scssModules.join("\n"));
}


process.on("exit", (code) => !code && buildSCSS());
process.on("SIGINT", () => process.exit(0));

console.log(`${
    " ".repeat(3 * (2 + (2/3)) + 1)
}\x1b[1m\x1b[39m\x1b[48;2;${[ 224, 0, 106 ].join(";")}m ${"development build".toUpperCase()} \x1b[0m`);

require("./lib/cli");