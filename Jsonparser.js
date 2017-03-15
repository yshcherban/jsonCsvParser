const   fs      = require('fs'),
        path    = require('path'),
        mime    = require('mime'),
        Promise	= require('bluebird');
        parseErr = require('./ParserError');


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

