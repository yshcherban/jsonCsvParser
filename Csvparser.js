const   baby    = require('babyparse'),
        path    = require('path'),
        mime    = require('mime'),
        Promise	= require('bluebird'),
        dbPreparer = require('./Dbpreparer'),
        parserErrorHandler = require('./ParserError');


function canParseFile(file) {
    return (path.extname(file) === '.csv') || (mime.lookup(file) === 'text/csv');
}

function parse(file) {
    return getPromiseFromCSVFile(file).then(result => {
        return result.data || [];
    }).then( res => {
        return dbPreparer.getPreparedData(res);
    }).catch((err) => {
        return parserErrorHandler(err);
    });
}

function getPromiseFromCSVFile(file) {
    return new Promise((resolve, reject) => {
        baby.parseFiles(file, {
            header:     true,
            complete:	(results, file) => { resolve(results) },
            error: 		(error, file) => { reject(error) }
        });
        // no return
    });
}

module.exports.canParseFile = canParseFile;
module.exports.parse = parse;