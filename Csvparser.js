const   baby    = require('babyparse'),
        path    = require('path'),
        mime    = require('mime'),
        Promise	= require('bluebird'),
        handleError = require('./ErrorHandler');

/**
 * Represents a simple CSV parser with actions:
 * @function canParseFile( <string> ) - checks if file is supported
 * @function parse( <string> | <Buffer> | <integer>  ) - returns the array of objects (JSON)
 * @function getPromiseFromCSVFile( <string> | <Buffer> | <integer> ) - reads the file and returns a parse results object
 */

function canParseFile(file) {
    return (path.extname(file) === '.csv') || (mime.lookup(file) === 'text/csv');
}

function parse(file) {
    return getPromiseFromCSVFile(file).then(result => {
        return result.data || [];
    }).catch(e => {
        return handleError(e.message);
    });
}

function getPromiseFromCSVFile(file) {
    return new Promise((resolve, reject) => {
        const parsedResponse = baby.parseFiles(file, {
            header:     true,
            complete:	(results, file) => {
                if (results.errors.length > 0) {
                    reject(new Error(results.errors[0].message));
                } else {
                    resolve(results)
                }
            }
        });
        if (parsedResponse.errors.length > 0) {
            reject(new Error(parsedResponse.errors[0].message));
        };
        // no return
    });
}

module.exports.canParseFile = canParseFile;
module.exports.parse = parse;