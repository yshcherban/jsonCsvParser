const   baby    = require('babyparse'),
        path    = require('path'),
        mime    = require('mime'),
        Promise	= require('bluebird');


function canParseFile(file) {
    return (path.extname(file) === '.csv') || (mime.lookup(file) === 'text/csv');
}

function parse(file) {
    return getPromiseFromCSVFile(file).then(result => {
        return result.data || [];
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