const { Transpiler } = require("./Transpiler");


module.exports.Transpiler = Transpiler;

module.exports.createTranspiler = function() {
    return new Transpiler();
}