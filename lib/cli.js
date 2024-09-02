#!/usr/bin/env node


const fs = require("fs");
const path = require("path");

const { build } = require("./api");


class Args {
	static #retrieveKeyIndex(name, shorthand) {
    	return Math.max(
            process.argv.slice(2).indexOf(`--${name.toLowerCase()}`),
            shorthand ? process.argv.slice(2).indexOf(`-${shorthand.toUpperCase()}`) : -1
        );
	}

	static parsePositional(index = 0) {
		const positional = process.argv.slice(2)[index];

    	return !/^\-/.test(positional) ? positional : null;
	}
    
	static parseFlag(key, shorthand) {
    	return (Args.#retrieveKeyIndex(key, shorthand) >= 0);
	}

    static parseOption(key, shorthand) {
    	const index = Args.#retrieveKeyIndex(key, shorthand) + 1;
    	const value = (index && index < process.argv.slice(2).length)
        ? process.argv.slice(2)[index]
        : null;
        return {
    		string: value,
    		number: +value
    	};
	}
}


if(Args.parsePositional(0) === "help") {
    console.log(fs.readFileSync(path.join(__dirname, "help.txt")).toString());
    
    process.exit(0);
}


const WATCH_INTERVAL = 1000;
const IS_DEVELOPMENT = Args.parseFlag("watch", "W");

let lastError;
let iterations = 0;


async function watch(watchInterval = WATCH_INTERVAL) {
    const library = Args.parseOption("library", "L").string;

    let result;
    try {
        result = await build(Args.parsePositional(0) ?? "", Args.parsePositional(1), {
            isDevelopment: IS_DEVELOPMENT,
            isStandalone: Args.parseFlag("standalone", "S"),
            modTimeTolerance: (!iterations || lastError) ? Infinity : watchInterval,
            watchDirSuperDepth: Args.parseOption("super-depth").number,
            library: library
        });
    } catch(err) {
        (err.toString() !== lastError)
        && console.error(`\x1b[31m${err}\x1b[0m`);

        !IS_DEVELOPMENT && process.exit(1);

        lastError = err.toString();
    }

    if(!result && !iterations) return;
    
    if(IS_DEVELOPMENT) {
        const timeout = Math.min(result ? WATCH_INTERVAL : watchInterval**1.25, 2.5 * WATCH_INTERVAL);
        setTimeout(() => watch(timeout), timeout);
    }

    if(!(result ?? {}).transpilerOutput) return;

    const date = new Date();
    const dateSequence = [ date.getHours(), date.getMinutes(), date.getSeconds() ]
    .map((segment) => segment.toString().padStart(2, "0"))
    .join(":");
    const transpilerOutput = [ result.transpilerOutput ].flat();
    console.log(`${
        (!lastError && iterations) ? "\x1b[3A\x1b[0J" : ""
    }\x1b[2m${dateSequence}\x1b[22m \x1b[38;2;${[ 21, 21, 209 ].join(";")}m\x1b[1mflecss\x1b[22m build successful \x1b[23m\x1b[2m\x1b[39m(${
        library ? `${library}, ` : ""
    }${
        result.executionTimeMs
    }ms${
        iterations++ ? `, ${iterations}×` : ""
    })\x1b[0m\n\x1b[38;2;${[ 21, 21, 209 ].join(";")}m${
        " ".repeat(dateSequence.length + 1)
    }→ ${
        (transpilerOutput.length === 1)
        ? `\x1b[3m${
            path.basename(transpilerOutput[0].targetPath)
        }\x1b[23m\x1b[2m\x1b[39m (${
            (transpilerOutput[0].targetSizeByte / 1024).toFixed(2).toLocaleString()
        }kB)`
        : `${transpilerOutput.length} files to ${path.dirname(transpilerOutput[0].targetPath)}`
    }\x1b[0m`);

    lastError = null;
}


process.stdout.write("\n");

watch();