const path = require("path");


module.exports.logCaption = function(caption) {
    console.log(`\x1b[2m⚙ \x1b[1mflecss ${caption.toUpperCase()}\x1b[0m`);
}

module.exports.logStepDescription = function(stepDescription) {
    console.log(`\x1b[2m• \x1b[22m\x1b[35m${stepDescription}\x1b[0m`);
}

module.exports.resolvePath = function(rootRelativePath) {
    return path.join(__dirname, "..", rootRelativePath);
}