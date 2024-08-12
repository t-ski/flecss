#!/usr/bin/env node


const fs = require("fs");
const path = require("path");

const _config = require("../_config.json");

const { buildCSS } = require("./api");


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
    	return (index && index < process.argv.slice(2).length)
        ? {
    		string: process.argv.slice(2)[index],
    		number: +process.argv.slice(2)[index]
    	}
        : {};
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


async function build(watchInterval = WATCH_INTERVAL) {
    let result;
    try {
        result = await buildCSS(Args.parsePositional(0) ?? "", Args.parsePositional(1), {
            isDevelopment: IS_DEVELOPMENT,
            isStandalone: Args.parseFlag("standalone", "S"),
            modTimeTolerance: (!iterations || lastError) ? Infinity : watchInterval
        });
    } catch(err) {
        (err.toString() !== lastError)
        && console.error(`\x1b[31m${err}\x1b[0m`);

        !IS_DEVELOPMENT && process.exit(1);

        lastError = err.toString();
    }
    
    if(IS_DEVELOPMENT) {
        const timeout = Math.min(result ? WATCH_INTERVAL : watchInterval**1.25, 2.5 * WATCH_INTERVAL);
        setTimeout(() => build(timeout), timeout);
    }

    if(!result) return;
    
    const date = new Date();
    console.log(`${
        !lastError ? "\x1b[2K\r\x1b[1A\x1b[2K\r" : ""
    }\x1b[2m${
        [ date.getHours(), date.getMinutes(), date.getSeconds() ]
        .map((segment) => segment.toString().padStart(2, "0"))
        .join(":")
    }\x1b[22m \x1b[38;2;${[ 21, 21, 209 ].join(";")}m${
        `\x1b[1m${_config.appName}\x1b[22m successfully ${IS_DEVELOPMENT ? "watch" : "\x1b[1D"} built \x1b[3m${path.basename(result.targetPath)}\x1b[23m`
    }\x1b[2m\x1b[39m (${
        `${(result.targetSizeByte / 1024).toFixed(2).toLocaleString()}kB`
    }, ${
        `${result.executionTimeMs}ms`
    })${
        iterations++ ? ` (${iterations}×)` : ""
    }\x1b[0m`);

    lastError = null;
}


process.stdout.write("\n");
build();