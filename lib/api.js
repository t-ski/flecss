const fs = require("fs");
const path = require("path");

const sass = require("sass");
const CleanCSS = require("clean-css");


function transpile(sourcePath, options = {}) {
    const optionsWithDefaults = {
        isDevelopment: false,
        isStandalone: false,

        ...options
    };
    
    const scss = [
        !optionsWithDefaults.isStandalone ? [
            `@import "${path.join(__dirname, "../dist/flecss")}";`,         // core
            `@import "${path.join(__dirname, "../dist/flecss.util")}";`    // utils
        ] : [],
        fs.readFileSync(sourcePath).toString()
    ]
    .flat()
    .join("\n");
    
    const sassResult = sass.compileString(scss, {
        loadPaths: [ path.dirname(sourcePath) ],
        style: optionsWithDefaults.isDevelopment ? "expanded" : "compressed",
        quietDeps: true
    });
    
    return {
        css: !optionsWithDefaults.isDevelopment
        ? new CleanCSS({
            inline: [ "remote "],
            level: 2
        }).minify(sassResult.css).styles
        : sassResult.css,
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
    
    const targetFilePath = (targetPath ?? `${path.dirname(sourceFilePath)}/`)
    .replace(/\/$/, `/${path.basename(sourceFilePath)}`)
    .replace(/(\.s?css)?$/i, ".css");
    fs.mkdirSync(path.dirname(targetFilePath), { recursive: true });
    
    return new Promise((resolve, reject) => {
        const hrStart = process.hrtime();

        const render = () => {
            const transpiled = transpile(sourceFilePath, optionsWithDefaults);
            fs.writeFile(targetFilePath, transpiled.css, null, (err) => {
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
        
        for(const dirent of dirents) {  // TODO: Watch issue on error (warn)
            if(dirent.isDirectory()
            || ((Date.now() - fs.statSync(path.join(dirent.path, dirent.name)).mtimeMs) > optionsWithDefaults.modTimeTolerance)) continue;
            
            render();
            
            return;
        }

        resolve(null);
    });
}

module.exports.transpile = transpile;