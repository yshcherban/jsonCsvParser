const   baby    = require('babyparse'),
        path    = require('path'),
        mime    = require('mime'),
        Promise	= require('bluebird');

class csvParser {

    canParseFile(file) {
        return (path.extname(file) === '.csv') || (mime.lookup(file) === 'text/csv');
    }

    parse(file) {
        if (this.canParseFile(file)) {
            return this.getPromiseFromCSVFile(file).then(result => {
                return result.data || [];
            });
        }
    }

    getPromiseFromCSVFile(file) {
        return new Promise((resolve, reject) => {
            baby.parseFiles(file, {
                header:     true,
                complete:	(results, file) => { resolve(results) },
                error: 		(error, file) => { reject(error) }
            });
            // no return
        });
    }
}

module.exports = new csvParser();