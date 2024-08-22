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
        throw new ReferenceError(`File does not exist at ${source}`);
    }

    return transpileSCSS(fs.readFileSync(sourcePath).toString(), optionsWithDefaults);
}


module.exports.build = function(sourcePath, targetPath, options = {}) {
    const optionsWithDefaults = {
        modTimeTolerance: Infinity,

        ...options
    };

    const absoluteSourcePath = path.resolve(sourcePath);
    if(!fs.existsSync(absoluteSourcePath)) {
        throw new ReferenceError(`Source path does not exist at ${absoluteSourcePath}`);
    }

    const sourceIsDir = fs.statSync(sourcePath).isDirectory();
    if(!sourceIsDir
    && !/\.scss$/i.test(sourcePath)) {
        throw new SyntaxError(`Invalid source file (expects *.scss, got ${path.basename(sourcePath)})`);
    }

    const absoluteSourcePaths = sourceIsDir
    ? fs.readdirSync(absoluteSourcePath, {
        withFileTypes: true
    })
    .filter((dirent) => dirent.isFile())
    .filter((dirent) => /^[^_].*\.scss$/.test(dirent.name))
    .map((dirent) => path.join(dirent.parentPath, dirent.name))
    : [ absoluteSourcePath ];

    const absoluteTargetPath = path.resolve(
        targetPath
        ?? (!sourceIsDir ? path.dirname(absoluteSourcePath) : absoluteSourcePath)
    );
    const targetIsDir = !/\.css$/i.test(absoluteTargetPath);
    fs.mkdirSync(targetIsDir ? absoluteTargetPath : path.dirname(absoluteTargetPath), {
        recursive: true
    });
    
    return new Promise((resolve, reject) => {
        const resolveEmpty = () => resolve({
            executionTimeMs: 0,
            transpilerOutput: null
        });

        if(!absoluteSourcePaths.length) {
            resolveEmpty();
            
            return;
        }

        const hrStart = process.hrtime();

        const render = () => {
            let builtFiles = 0;
            const results = [];
            absoluteSourcePaths
            .forEach((absoluteSourcePath) => {
                const transpiled = transpileFile(absoluteSourcePath, optionsWithDefaults);
                const targetPath = targetIsDir
                ? path.join(
                    absoluteTargetPath,
                    absoluteSourcePath
                    .match(/[^\\/]+$/)[0]
                    .replace(/(\.scss)?$/i, ".css")
                )
                : absoluteTargetPath;
                
                targetIsDir
                && fs.rmSync(targetPath);
                fs.appendFile(
                    targetPath,
                    transpiled.css,
                    null,
                    (err) => {
                    err && reject(err);
                    results.push({
                        sourcePath: absoluteSourcePath,
                        targetPath: targetPath,
                        targetSizeByte: fs.statSync(targetPath).size
                    });
                    (++builtFiles === absoluteSourcePaths.length)
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

        const dirents = fs.readdirSync(
            sourceIsDir ? absoluteSourcePath : path.dirname(absoluteSourcePath),
            {
            recursive: true,
            withFileTypes: true,
        })
        .filter((dirent) => /\.scss/i.test(dirent.name));

        if(!dirents) throw new ReferenceError(`No files found at ${path.dirname(targetFilePath)}`);
        
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