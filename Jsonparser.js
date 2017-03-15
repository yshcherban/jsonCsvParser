const   fs      = require('fs'),
        path    = require('path'),
        mime    = require('mime'),
        Promise	= require('bluebird'),
        dbPreparer = require('./Dbpreparer'),
        parserErrorHandler = require('./ParserError');


const readJsonFile = Promise.promisify(fs.readFile);

function canParseFile(file) {
    return (path.extname(file) === '.json') || (mime.lookup(file) === 'application/json');
}

function parse (file) {
    return readJsonFile(file, "utf8").then( contents => {
        return JSON.parse(contents);
    }).then( res => {
        return dbPreparer.getPreparedData(res);
    }).catch((err) => {
        return parserErrorHandler(err);
    });
}

module.exports.canParseFile = canParseFile;
module.exports.parse = parse;

