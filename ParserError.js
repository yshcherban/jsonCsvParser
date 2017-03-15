function ParserError(err) {
    this.message = err.message;
    this.name = 'Parser Error';
    this.type = err.type;
    Error.captureStackTrace(this, ParserError);
}
ParserError.prototype = Object.create(Error.prototype);
ParserError.prototype.constructor = ParserError;

function getTypeOfError(err) {
    switch(true) {
        case (err instanceof SyntaxError):
            return new ParserError({
                message: err.message,
                type: 'SyntaxError'
            });
        break;
    }
}

module.exports = getTypeOfError;
