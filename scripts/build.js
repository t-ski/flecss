const fs = require("fs");

const _util = require("./_util");

const API = require("../lib/api");


async function buildCSS(sourcePath, targetPath) {
    await API.buildCSS(sourcePath, targetPath, {
        isDevelopment: process.argv.slice(2).includes("-D"),
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


_util.logCaption("Build");
(async () => {
    _util.logStepDescription("Write core CSS (flecss.css)");
    await buildCSS(
        _util.resolvePath("./src/core/core.scss"),
        _util.resolvePath("./dist/flecss.css")
    );
    
    _util.logStepDescription("Write utils SCSS (flecss.scss)");
    buildSCSS(
        _util.resolvePath("./src/util/util.scss"),
        _util.resolvePath("./dist/flecss.util.scss")
    );
})();