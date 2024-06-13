const fs = require("fs");
const path = require("path");

const sass = require("sass");
const CleanCSS = require("clean-css");


const CORE_SCSS = fs.readFileSync(path.join(__dirname, "../dist/flecss.scss")).toString();


function transpile(sourcePath, options = {}) {
    const optionsWithDefaults = {
        isDevelopment: false,
        isStandalone: false,

        ...options
    };

    const sourceSCSS = fs.readFileSync(sourcePath).toString();
    const sassResult = sass.compileString([
        !optionsWithDefaults.isStandalone ? CORE_SCSS : "",
        sourceSCSS
    ].join("\n"), {
        loadPaths: [ path.dirname(sourcePath) ],
        style: optionsWithDefaults.isDevelopment ? "expanded" : "compressed"
    });

    return {
        css: !optionsWithDefaults.isDevelopment ? new CleanCSS({}).minify(sassResult.css).styles : sassResult.css,
        loadedUrls: sassResult.loadedUrls
    }
}


module.exports.buildCSS = function(sourcePath, targetPath, options = {}) {
    const optionsWithDefaults = {
        isDevelopment: false,
        isStandalone: false,
        modTimeTolerance: Infinity,

        ...options
    };

    const sourceFilePath = path.resolve(sourcePath).replace(/(\.scss)?$/i, ".scss");
    if(!/\.scss/i.test(sourceFilePath)) throw new SyntaxError(`Source file does not have .scss extension '${path.basename(sourceFilePath)}'`);
    if(!fs.existsSync(sourceFilePath)) throw new ReferenceError(`Source file does not exist '${sourceFilePath}'`);
    
    const targetFilePath = (targetPath ?? `${path.dirname(sourcePath)}/`)
    .replace(/\/$/, `/${path.basename(sourceFilePath)}`)
    .replace(/(\.s?css)?$/i, ".css");
    fs.mkdirSync(path.dirname(targetFilePath), { recursive: true });
    
    return new Promise((resolve, reject) => {
        const hrStart = process.hrtime();

        const render = () => {
            const css = transpile(sourceFilePath, optionsWithDefaults).css;
            
            fs.writeFile(targetFilePath, css, null, (err) => {
                err ? reject(err) : resolve({
                    executionTimeMs: Math.round(process.hrtime(hrStart)[1] / 1e6),
                    sourcePath: sourceFilePath,
                    targetPath: targetFilePath,
                    targetSizeByte: fs.statSync(targetFilePath).size
                }); 
            });
        };

        if(!optionsWithDefaults.isDevelopment) {
            render();

            return;
        }

        const dirents = fs.readdirSync(path.dirname(sourceFilePath), {
            recursive: true,
            withFileTypes: true,
        })
        .filter((dirent) => /\.scss/i.test(dirent.name));

        if(!dirents) throw new RangeError(`No SCSS files found '${path.dirname(targetFilePath)}'`);
        
        for(const dirent of dirents) {
            if(dirent.isDirectory()
            || ((Date.now() - fs.statSync(path.join(dirent.path, dirent.name)).mtimeMs) > optionsWithDefaults.modTimeTolerance)) continue;
            
            render();

            return;
        }

        resolve(null);
    });
}

module.exports.transpile = transpile;