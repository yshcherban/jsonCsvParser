const   path    = require('path'),
        mime    = require('mime'),
        XLSX    = require('xlsx'),
        Promise	= require('bluebird');

/**
 * Represents a simple XLSX parser with actions:
 * @function canParseFile( <string> ) - checks if file is supported
 * @function parse( <string> | <Buffer> | <integer> ) - reads the file and returns the array of objects (JSON).
 */

const readXlsxFile = Promise.method(XLSX.readFile);

const canParseFile = (file) => {
    return (path.extname(file) === '.xlsx') || (mime.lookup(file) === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}

const parse = (file) => {
    return readXlsxFile(file).then(readFile => {
        return XLSX.utils.sheet_to_json(readFile.Sheets[readFile.SheetNames[0]]) || [];
    }).catch(e => {
        throw new Error(e.message);
    });
}

module.exports.canParseFile = canParseFile;
module.exports.parse = parse;