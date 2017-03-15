const   fs      = require('fs'),
        path    = require('path'),
        mime    = require('mime'),
        Promise	= require('bluebird');

class jsonParser {

    constructor() {
        this.readJsonFile = Promise.promisify(fs.readFile);
    }

    canParseFile(file) {
        return (path.extname(file) === '.json') || (mime.lookup(file) === 'application/json');
    }

    parse (file) {
        if (this.canParseFile(file)) {
            return this.readJsonFile(file, "utf8").then( contents => {
                return JSON.parse(contents);
            });
        }
    }
}

module.exports = new jsonParser();

