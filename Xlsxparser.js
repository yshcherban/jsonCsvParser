const   path    = require('path'),
        mime    = require('mime'),
        XLSX    = require('xlsx'),
        Promise	= require('bluebird'),
        dbPreparer = require('./Dbpreparer');

const readXlsxFile = Promise.method(XLSX.readFile);

function canParseFile(file) {
    return (path.extname(file) === '.xlsx') || (mime.lookup(file) === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}

function parse(file) {
    return readXlsxFile(file).then(readFile => {
        return XLSX.utils.sheet_to_json(readFile.Sheets[readFile.SheetNames[0]]) || [];
    }).then( res => {
        return dbPreparer.getPreparedData(res);
    });
}

module.exports.canParseFile = canParseFile;
module.exports.parse = parse;