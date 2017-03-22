module.exports = function ParserError(msg) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = msg;


    Error.prepareStackTrace = function (error, structuredStackTrace) {
        let res = [];
        res.push(error);
        structuredStackTrace.forEach( frame => {
            res.push('\n at ' + frame.getFileName() + ' called ' + frame.getFunctionName() + ' at line ' + frame.getLineNumber());
        });
        return res;
    }

};

require('util').inherits(module.exports, Error);
