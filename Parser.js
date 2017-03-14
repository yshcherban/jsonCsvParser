const   fs      = require('fs'),
        path    = require('path'),
        mime    = require('mime'),
        XLSX    = require('xlsx'),
        baby    = require('babyparse'),
        Promise	= require('bluebird');


// Returns json file and origHeaders (headers from parsed file)
class Parser {
    constructor(){
        this.readJsonFile = Promise.promisify(fs.readFile);
        this.readXlsxFile = Promise.method(XLSX.readFile);
        this.readCsvFile = Promise.promisify(baby.parseFiles);
    }

    canParseFile(file) {
        switch(true) {
            case (path.extname(file) === '.json') || (mime.lookup(file) === 'application/json'):
                return 'json';
            case (path.extname(file) === '.csv') || (mime.lookup(file) === 'text/csv'):
                return 'csv';
            case (path.extname(file) === '.xlsx') || (mime.lookup(file) === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'):
                return 'xlsx';
            default:
                return new Error('File is not recognized');
        }
    }

    parse(file) {
        switch(this.canParseFile(file)) {
            case 'json':
                return this.jsonParse(file);
                break;
            case 'csv':
                return this.csvParse(file);
                break;
            case 'xlsx':
                return this.xlsxParse(file);
                break;
        }
    }

    jsonParse(file) {
        return this.readJsonFile(file, "utf8").then( contents => {
            return JSON.parse(contents);
        });
    }

    xlsxParse(file) {
        return this.readXlsxFile(file).then(readFile => {
            return {
                data: XLSX.utils.sheet_to_json(readFile.Sheets[readFile.SheetNames[0]]) || [],
                origHeaders: XLSX.utils.sheet_to_json(readFile.Sheets[readFile.SheetNames[0]], {header: 1})[0] || []
            };
        });
    }

    csvParse(file) {
        return this.readCsvFile(file).then( result => {
            return {
                data: result.data || [],
                origHeaders: result.meta.fields || []
            }
        });
    }

}

/**************************************************************************/
class DbPreparer {

    /** possible values for well-known params */
    static get guessTable() {
        return {
            firstName:	['name', 'firstname'],
            lastName:	['surname', 'lastname'],
            gender: 	['gender'],
            birthday: 	['birthday', 'bday', 'dob'],
            form: 		['form'],
            house: 		['house']
        };
    }

    /**
     * Guess actual column name based on guessTable.
     * @param {Array.<String>} fieldNames array of actual name of columns
     * @param {String} fieldToGuess name of column to search. This is key in guess table. Like `firstName`
     * @return {String|undefined} actual name for `fieldToGuess`
     */
    guessColumn(fieldNames, fieldToGuess) {
        if(!Array.isArray(DbPreparer.possibleValues(fieldToGuess))) return undefined;	// there is no such value in table

        return fieldNames.find( fieldName => {
            return DbPreparer.possibleValues.findIndex( possibleValue => possibleValue === DbPreparer.lowFieldName(fieldName) ) !== -1;
        });
    };

    static set possibleValues(value) {
        return DbPreparer.guessTable[value];
    }

    static set lowFieldName(value) {
        return value.toLowerCase();
    }

    /**
     * Return mapping object. Each key have real column name or undefined if no suitable column found
     * @param {Array.<String>} fieldNamesArray fieldNames array of actual name of columns
     * @return {{firstName: (String|undefined), lastName: (String|undefined), gender: (String|undefined), birthday: (String|undefined), form: (String|undefined), house: (String|undefined)}}
     */
    guessHeaders(fieldNamesArray) {
        return {
            firstName:	this.guessColumn(fieldNamesArray, 'firstName'),
            lastName:	this.guessColumn(fieldNamesArray, 'lastName'),
            gender:		this.guessColumn(fieldNamesArray, 'gender'),
            birthday:	this.guessColumn(fieldNamesArray, 'birthday'),
            form:		this.guessColumn(fieldNamesArray, 'form'),
            house:		this.guessColumn(fieldNamesArray, 'house')
        }
    }

    /** Try to guess gender value */
    static set guessGender(genderValue) {

        if(DbPreparer.lowGender(genderValue) === 'boy' || DbPreparer.lowGender(genderValue) === 'male' || DbPreparer.lowGender(genderValue) === '1') 	return 'MALE';
        if(DbPreparer.lowGender(genderValue) === 'girl' || DbPreparer.lowGender(genderValue) === 'female' || DbPreparer.lowGender(genderValue) === '0') return 'FEMALE';

        return genderValue;
    };

    static set lowGender(value) {
        return value.toLowerCase();
    }

    firstName(headers, obj) {
        return obj[headers.firstName];
    }

    lastName(headers, obj) {
        return obj[headers.lastName];
    }

    gender(headers, obj) {
        return obj[headers.gender];
    }

    objectToStudent (headers, obj) {
        return {
            firstName:	this.firstName(headers, obj) ? this.firstName(headers, obj).trim() : undefined,
            lastName:	this.lastName(headers, obj) ? this.lastName(headers, obj).trim() : undefined,
            gender: 	this.gender(headers, obj) ? DbPreparer.guessGender(this.gender(headers, obj)) : undefined,

            birthday:	obj[headers.birthday],
            form:		obj[headers.form],
            house: 		obj[headers.house]
        };
    };

    getGuessedHeaders() {
        return DbPreparer.guessHeaders(this.originalHeaders);
    }

    getPreparedData() {
        console.log(this.preparedData);
    }

    preparedData(data, origHeaders) {
        return this.parsedFile.filter( item => Object.keys(item).length > 1 )	// removing empty objects
            .map( item => objectToStudent(this.getGuessedHeaders(), item));
    }
}


module.exports = new Parser();