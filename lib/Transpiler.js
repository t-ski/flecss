const { readFileSync, existsSync, readdirSync, cpSync, statSync } = require("fs");
const { join, dirname, basename, normalize } = require("path");
const { EventEmitter } = require("events");

const sass = require("sass");
const CleanCSS = require("clean-css");

const _config = {
    flecssNamespaceIdentifier: "flecss"
};


const ELibrary = {
    STANDALONE: "standalone",
    FULL: "flecss",
    MIN: "flecss.min",
    MIN_STANDALONE: "flecss.min.shorthand"
};

class Transpiler {
    static #sourceDirPath = join(__dirname, "../src");

    static #mergeOptions(targetOptions = {}, sourceOptions = {}) {
        if(Array.isArray(sourceOptions)) {
            return Array.isArray(targetOptions)
            ? Array.from(new Set([ ...targetOptions, ...sourceOptions ]))
            : sourceOptions;
        }

        const isKeyObject = (obj) => typeof(obj) === "object" && !!Object.entries(obj ?? {}).length;
		if(!isKeyObject(targetOptions)) return sourceOptions;

		targetOptions = !isKeyObject(targetOptions) ? {} : targetOptions;
		for(const key in sourceOptions) {
			if(sourceOptions[key] === undefined) continue;
            
			targetOptions[key] = isKeyObject(sourceOptions[key])
                ? Transpiler.#mergeOptions(targetOptions[key], sourceOptions[key])
                : sourceOptions[key];
		}
        
		return targetOptions;
    }

    #options;
    
    constructor(options = {}) {
        this.#options = Transpiler.#mergeOptions({
            development: false,
            library: ELibrary.FULL
        }, options);
    }

    fromString(scss, options = {}) {
        if(!Object.values(ELibrary).includes(this.#options.library))
            throw new ReferenceError(`Unknown library '${this.#options.library}'`);

        const scssSnippets = [
            scss
        ];
        const isStandalone = (this.#options.library === ELibrary.STANDALONE);
        if(!isStandalone) {
            scssSnippets.unshift(`@forward "${join(Transpiler.#sourceDirPath, "./flecss.scss")}";`);
            console.log(this.#options.library)
            cpSync(
                join(Transpiler.#sourceDirPath, `./core/__class${this.#options.library.replace(/^flecss/, "")}.scss`),
                join(Transpiler.#sourceDirPath, "./core/_class.scss")
            );  // DYNAMIC LIBRARY ENFORCEMENT; TODO: Improve (?)
        }
        
        const utilFilePath = join(Transpiler.#sourceDirPath, "./flecss.util.scss");
        const sassResult = sass.compileString(
            scssSnippets.join("\n"),
            {
                loadPaths: [ ...(options.loadPaths ?? []), !isStandalone ? Transpiler.#sourceDirPath : [] ].flat(),
                style: this.#options.development
                    ? "expanded"
                    : "compressed",
                quietDeps: true,
                importers: [
                    {
                        load: () => {
                            // Must be utils file
                            return {
                                contents: readFileSync(utilFilePath).toString(),
                                syntax: "scss"
                            };
                        },
                        canonicalize: (str) => {
                            return !isStandalone
                                ? (str === _config.flecssNamespaceIdentifier ? new URL(`file://${utilFilePath}`) : null)
                                : null;
                        }
                    }
                ]
            }
        );
        
        return {
            css: !this.#options.development
                ? new CleanCSS({
                    inline: [ "remote "],
                    level: 2
                }).minify(sassResult.css).styles
                : sassResult.css,
            loadedUrls: sassResult.loadedUrls
        }
    }

    fromFile(path, options) {
        if(!existsSync(path)) {
            throw new ReferenceError(`Source file does not exist ${path}`);
        }
        if(statSync(path).isDirectory()
        || !/\.scss$/i.test(path)) {
            throw new SyntaxError(`Invalid source file (expects ${basename(path)}, expects *.scss`);
        }

        const optionsWithDefaults = Transpiler.#mergeOptions({
            loadPaths: [ dirname(path) ]
        }, options);

        return this.fromString(readFileSync(path).toString(), optionsWithDefaults);
    }

    watchFile(path, options) {
        if(!existsSync(path)) {
            throw new ReferenceError(`Source file does not exist ${path}`);
        }
        
        const absoluteDirPath = !statSync(path).isDirectory()
            ? dirname(path)
            : path;
        
        const dirents = readdirSync(
            absoluteDirPath,
            {
                recursive: true,
                withFileTypes: true
            }
        )
        .filter((dirent) => dirent.isFile())
        .filter((dirent) => /\.scss/i.test(dirent.name));
            
        const optionsWithDefaults = Transpiler.#mergeOptions({
            watch: false,
            modToleranceMs: 1000
        }, options);
        
        const emitter = new EventEmitter();

        let i = 0;
        const tryTranspile = (force = false) => {
            const hrStart = process.hrtime();
            
            const entryDirents = [];
            let retranspile = false;
            for(const dirent of dirents) {
                // TODO: Track with dependency tree (optimised rebuilds)
                if(!force
                    && (Date.now() - statSync(join(dirent.path, dirent.name)).mtimeMs)
                        > optionsWithDefaults.modToleranceMs
                ) continue;
                
                retranspile = true;
                
                if(/^_/i.test(dirent.name)
                && normalize(path) !== normalize(join(dirent.path, dirent.name))) continue;
                
                entryDirents.push(dirent);
            }
            
            retranspile
            && emitter.emit("transpile", {
                iteration: i++,
                executionTimeMs: Math.round(process.hrtime(hrStart)[1] / 1e6),
                files: entryDirents
                    .map((dirent) => {
                        try {
                            return {
                                name: {
                                    parentPath: dirent.path.slice(dirent.parentPath.length),
                                    bare: dirent.name.replace(/\.scss$/i, ""),
                                    full: dirent.name,       
                                },            
                                result: this.fromFile(join(dirent.path, dirent.name), optionsWithDefaults)
                            };
                        } catch(err) {
                            emitter.emit("error", err);
                        }

                        return null;
                    })
                    .filter((fileData) => !!fileData)
            });
            
            setTimeout(tryTranspile, Math.min(1000 * 60 * 60, Math.max(1, optionsWithDefaults.modToleranceMs)));
        };
        
        setImmediate(() => tryTranspile(true));

        return emitter;
    }
}

module.exports = { Transpiler };