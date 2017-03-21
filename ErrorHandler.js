function customErrorHandler (msg) {
    let err = new Error;

    /** format stack trace */
    Error.prepareStackTrace = ((err, stack) => {
        return stack;
    });

    /** Creates a stack property */
    Error.captureStackTrace(err, customErrorHandler);
    const stack = err.stack[0];

    err.stack.forEach(function (frame) {
        console.error(' at: %s:%d - %s'
            , frame.getFileName()
            , frame.getLineNumber()
            , frame.getFunctionName());
    });

    return {
        "error" : msg,
        "file" : stack.getFileName(),
        "line": stack.getLineNumber(),
        "called": stack.getFunctionName()
    };

}

module.exports = customErrorHandler;
