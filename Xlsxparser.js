const   path    = require('path'),
        mime    = require('mime'),
        XLSX    = require('xlsx'),
        Promise	= require('bluebird'),
        dbPreparer = require('./Dbpreparer');

class xlsxParser {

    constructor() {
        this.readXlsxFile = Promise.method(XLSX.readFile);
    }

    canParseFile(file) {
        return (path.extname(file) === '.xlsx') || (mime.lookup(file) === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    parse(file) {
        if (this.canParseFile(file)) {
            return this.readXlsxFile(file).then(readFile => {
                return XLSX.utils.sheet_to_json(readFile.Sheets[readFile.SheetNames[0]]) || [];
            }).then( res => {
                return dbPreparer.getPreparedData(res);
            });
        }
    }
}

module.exports = new xlsxParser();