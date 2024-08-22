const fs = require("fs");
const path = require("path");

const _util = require("./_util");

const API = require("../lib/api");


async function buildCSS(source, targetPath) {
    const result = await API.transpileFile(source, {
        isDevelopment: process.argv.slice(2).includes("-D"),
        isStandalone: true
    });
    fs.writeFileSync(targetPath, result.css);
    return Math.round(result.css.length / 1024);
}

function buildSCSS(sourcePath, targetPath) {
    const concatenatedSCSS = API.transpileFile(sourcePath, {
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
    fs.mkdirSync(_util.resolvePath(path.join("./dist/")), {
        recursive: true
    });

    const buildLib = async (sourceName, targetName, description) => {
        _util.logStepDescription(`Write lib CSS${description ? ` (${description})` : ""}`);
        _util.logStepDescription(`→ ${targetName}.scss (${await buildCSS(
            _util.resolvePath(path.join("./src/lib/", `${sourceName}.scss`)),
            _util.resolvePath(path.join("./dist/", `${targetName}.css`)),
        )}kB)`);
    };

    await buildLib("lib", "flecss");
    await buildLib("lib.min", "flecss.min", "fullnames only");
    await buildLib("lib.min.shorthand", "flecss.min.shorthand", "shorthands only");

    _util.logStepDescription("Write utilities SCSS (flecss.scss)");
    buildSCSS(
        _util.resolvePath("./src/util/util.scss"),
        _util.resolvePath("./dist/flecss.util.scss")
    );
})();