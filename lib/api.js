const { Transpiler } = require("./Transpiler");


module.exports.Transpiler = Transpiler;

module.exports.createTranspiler = function(...args) {
    return new Transpiler(...args);
}