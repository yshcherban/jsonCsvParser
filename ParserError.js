class ParserError extends Error {
    constructor(settings) {
        super();
        this.settings = settings || {};
        //this.implementationContext = implementationContext;

        // Override the default name property (Error)
        this.name = "ParserError";

        // custom error structure
        this.type = settings.type || "Application";
        this.message = ( settings.message || "An error occurred." );
        this.detail = ( settings.detail || "" );
        this.extendedInfo = ( settings.extendedInfo || "" );
        this.errorCode = ( settings.errorCode || "" );

        this.isAppError = true;
        Error.captureStackTrace( this, this.constructor);
    }
}

module.exports = ParserError;