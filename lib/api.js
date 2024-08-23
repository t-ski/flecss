const fs = require("fs");
const path = require("path");

const sass = require("sass");
const CleanCSS = require("clean-css");


function transpileSCSS(sourceSCSS, options = {}) {
    const optionsWithDefaults = {
        isDevelopment: false,
        isStandalone: false,
        library: "flecss",
        loadPaths: [],

        ...options
    };
    
    const scss = [ sourceSCSS ];
    if(!optionsWithDefaults.isStandalone) {
        const libraryPath = path.join(__dirname, "../dist/", optionsWithDefaults.library);
        if(!fs.existsSync(libraryPath.replace(/(\.css)?$/i, ".css"))) {
            throw new ReferenceError(`Unknown library ${optionsWithDefaults.library}`);
        }
        scss.unshift(`@import "${path.join(__dirname, "../dist/flecss.util")}";`)  // utils
        scss.unshift(`@import "${libraryPath}";`)                                  // lib
    }

    const sassResult = sass.compileString(scss.join("\n"), {
        loadPaths: optionsWithDefaults.loadPaths,
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

function transpileFile(sourcePath, options = {}) {
    const optionsWithDefaults = {
        loadPaths: [ path.dirname(sourcePath) ],

        ...options
    };

    if(!fs.existsSync(sourcePath)) {
        throw new ReferenceError(`File does not exist at ${sourcePath}`);
    }

    return transpileSCSS(fs.readFileSync(sourcePath).toString(), optionsWithDefaults);
}


module.exports.build = function(sourcePath, targetPath, options = {}) {
    const optionsWithDefaults = {
        modToleranceMs: Infinity,
        watchDirSuperDepth: 0,

        ...Object.fromEntries(Object.entries(options).filter(([_, value]) => value != null))
    };

    let absoluteSourcePath = path.resolve(sourcePath);
    if(!fs.existsSync(absoluteSourcePath)) {
        throw new ReferenceError(`Source path does not exist at ${absoluteSourcePath}`);
    }

    const sourceIsDir = fs.statSync(sourcePath).isDirectory();
    if(!sourceIsDir
    && !/\.scss$/i.test(sourcePath)) {
        throw new SyntaxError(`Invalid source file (expects *.scss, got ${path.basename(sourcePath)})`);
    }

    const gatherRelativePaths = (relativePath = ".") => {
        return fs.readdirSync(path.join(absoluteSourcePath, relativePath), {
            withFileTypes: true
        })
        .map((dirent) => {
            const subRelativePath = path.join(relativePath, dirent.name);
            if(!dirent.isFile() && !dirent.isDirectory()) return [];
            if(dirent.isDirectory()) return gatherRelativePaths(subRelativePath);
            if(!/^[^_].*\.scss$/.test(dirent.name)) return [];
            return subRelativePath;
        })
        .flat();
    };
    const relativeSourcePaths = sourceIsDir
    ? gatherRelativePaths()
    : [ path.basename(absoluteSourcePath) ];
    absoluteSourcePath = !sourceIsDir
    ? path.dirname(absoluteSourcePath)
    : absoluteSourcePath;
    
    const absoluteTargetPath = path.resolve(
        targetPath
        ?? (!sourceIsDir ? path.dirname(absoluteSourcePath) : absoluteSourcePath)
    );
    const targetIsDir = !/\.css$/i.test(absoluteTargetPath);
    
    return new Promise((resolve, reject) => {
        const resolveEmpty = () => resolve({
            executionTimeMs: 0,
            transpilerOutput: null
        });

        if(!relativeSourcePaths.length) {
            resolveEmpty();
            
            return;
        }

        const hrStart = process.hrtime();

        const render = () => {
            let builtFiles = 0;
            const results = [];
            relativeSourcePaths
            .forEach((relativePath, i) => {
                const transpiled = transpileFile(path.join(absoluteSourcePath, relativePath), optionsWithDefaults);
                const targetPath = targetIsDir
                ? path.join(
                    absoluteTargetPath,
                    relativePath
                    .replace(/(\.scss)?$/i, ".css")
                )
                : absoluteTargetPath;
                
                fs.mkdirSync(path.dirname(targetPath), {
                    recursive: true
                });
                ((!i || targetIsDir || !fs.existsSync(targetPath))
                ? fs.writeFile
                : fs.appendFile)(
                    targetPath,
                    transpiled.css,
                    null,
                    (err) => {
                    if(err) {
                        reject(err);
                        
                        return;
                    }

                    results.push({
                        sourcePath: absoluteSourcePath,
                        targetPath: targetPath,
                        targetSizeByte: fs.statSync(targetPath).size
                    });

                    (++builtFiles === relativeSourcePaths.length)
                    && resolve({
                        executionTimeMs: Math.round(process.hrtime(hrStart)[1] / 1e6),
                        transpilerOutput: sourceIsDir ? results : results[0]
                    });
                });
            });
        };

        if(!optionsWithDefaults.isDevelopment) {
            render();

            return;
        }

        let watchDirPath = absoluteSourcePath;
        for(let i = 0; i < (optionsWithDefaults.watchDirSuperDepth + +sourceIsDir); i++) {
            watchDirPath = path.dirname(watchDirPath);
        }
        const dirents = fs.readdirSync(
            watchDirPath,
            {
                recursive: true,
                withFileTypes: true
            }
        )
        .filter((dirent) => dirent.isFile())
        .filter((dirent) => /\.scss/i.test(dirent.name));
        
        for(const dirent of dirents) {  // TODO: Watch issue on error (warn)
            if(dirent.isDirectory()
            || ((Date.now() - fs.statSync(path.join(dirent.path, dirent.name)).mtimeMs) > optionsWithDefaults.modTimeTolerance)) continue;
            
            render();
            
            return;
        }

        resolveEmpty();
    });
}

module.exports.transpileSCSS = transpileSCSS;
module.exports.transpileFile = transpileFile;