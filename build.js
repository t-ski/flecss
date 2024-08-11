const fs = require("fs");
const path = require("path");

const API = require("./lib/api");


async function buildCSS(sourcePath, targetPath) {
    await API.buildCSS(sourcePath, targetPath, {
        isDevelopment: false,
        isStandalone: true
    });
}

function buildSCSS(sourcePath, targetPath) {
    const concatenatedSCSS = API.transpile(sourcePath, {
        isStandalone: true
    }).loadedUrls
    .map((loadedUrl) => {
        return fs.readFileSync(loadedUrl)
        .toString()
        .replace(/@import +[^);\n]+\)? *;? *\n?/g, "")
        .trim();
    })
    .filter(scss => scss)
    .join("\n");
    fs.writeFileSync(targetPath, concatenatedSCSS);
}

function updateSizeInREADME(readmePath) {
    fs.writeFileSync(
        readmePath,
        fs.readFileSync(readmePath).toString()
        .replace(/&#8232;`[0-9]*kB`/, `&#8232;\`${
            Math.round(fs.statSync(path.join(__dirname, "./dist/flecss.css")).size / 1024)
        }kB\``)
    );
}

function logStep(description) {
    console.log(`\x1b[2m• \x1b[22m\x1b[35m${description}\x1b[0m`);
}


console.log("\x1b[2m⚙ \x1b[1mflecss BUILD\x1b[0m");

logStep("Write core CSS (flecss.css)");
buildCSS(
    path.join(__dirname, "./src/core/core.scss"),
    path.join(__dirname, "./dist/flecss.css")
)
.then(async () => {
    logStep("Write utils SCSS (flecss.scss)");
    buildSCSS(
        path.join(__dirname, "./src/utils/utils.scss"),
        path.join(__dirname, "./dist/flecss.utils.scss")
    );

    logStep("Update core filesize in README");
    updateSizeInREADME(path.join(__dirname, "./README.md"));
});