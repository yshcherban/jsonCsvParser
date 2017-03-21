const   fs      = require('fs'),
        path    = require('path'),
        mime    = require('mime'),
        Promise	= require('bluebird'),
        handleError = require('./ErrorHandler');

/**
 * Represents a simple JSON parser with actions:
 * @function canParseFile( <string> ) - checks if file is supported
 * @function parse( <string> | <Buffer> | <integer> ) - reads the entire contents of a file and returns the array of objects (JSON)
 */

const readJsonFile = Promise.promisify(fs.readFile);

function canParseFile(file) {
    return (path.extname(file) === '.json') || (mime.lookup(file) === 'application/json');
}

function parse (file) {
    return readJsonFile(file, "utf8").then( contents => {
        return JSON.parse(contents);
    });
}

module.exports.canParseFile = canParseFile;
module.exports.parse = parse;

