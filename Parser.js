const   fs      = require('fs'),
        path    = require('path'),
        mime    = require('mime'),
        XLSX    = require('xlsx'),
        baby    = require('babyparse'),
        Promise	= require('bluebird');


class ProcessStatus {
    getTypeEvent(error) {
        //if (event instanceof SyntaxError) console.log("Oooop! Something wrong: ", event.message);
        console.log( error.stack );
        console.log( "Type: " + error.type );
        console.log( "Message: " + error.message );
        console.log( "Detail: " + error.detail );
        console.log( "Extended Info: " + error.extendedInfo );
        console.log( "Error Code: " + error.errorCode );
    }
}



/**************************************************************************/
class DbPreparer {
    constructor() {
        /** possible values for well-known params */
        this.guessTable = {
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
        if(!Array.isArray(this.possibleValues(fieldToGuess))) return undefined;	// there is no such value in table

        return fieldNames.find( fieldName => {
            return this.possibleValues(fieldToGuess).findIndex( possibleValue => possibleValue === this.lowFieldName(fieldName) ) !== -1;
        });
    };

    possibleValues(value) {
        return this.guessTable[value];
    }

    lowFieldName(value) {
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
    guessGender(genderValue) {

        if(this.lowGender(genderValue) === 'boy' || this.lowGender(genderValue) === 'male' || this.lowGender(genderValue) === '1') 	return 'MALE';
        if(this.lowGender(genderValue) === 'girl' || this.lowGender(genderValue) === 'female' || this.lowGender(genderValue) === '0') return 'FEMALE';

        return genderValue;
    };

    lowGender(value) {
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
            gender: 	this.gender(headers, obj) ? this.guessGender(this.gender(headers, obj)) : undefined,

            birthday:	obj[headers.birthday],
            form:		obj[headers.form],
            house: 		obj[headers.house]
        };
    };

    getPreparedData(obj) {
        const guessedHeaders = this.guessHeaders(obj.origHeaders);
        const data = obj.data;

        return this.preparedData(data, guessedHeaders);
    }

    preparedData(data, headers) {
        return data.filter( item => Object.keys(item).length > 1 )	// removing empty objects
            .map( item => this.objectToStudent(headers, item));
    }
}



// Returns json file and origHeaders (headers from parsed file)
class Parser extends DbPreparer {
    constructor(){
        super();
        this.readJsonFile = Promise.promisify(fs.readFile);
        this.readXlsxFile = Promise.method(XLSX.readFile);
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
        })
    }

    xlsxParse(file) {
        return this.readXlsxFile(file).then(readFile => {
            return {
                data: XLSX.utils.sheet_to_json(readFile.Sheets[readFile.SheetNames[0]]) || [],
                origHeaders: XLSX.utils.sheet_to_json(readFile.Sheets[readFile.SheetNames[0]], {header: 1})[0] || []
            };
        }).then( res => {
            return this.getPreparedData(res);
        });
    }

    csvParse(file) {
        return this.getPromiseFromCSVFile(file).then( result => {
            return {
                data: result.data || [],
                origHeaders: result.meta.fields || []
            };
        }).then( res => {
            return this.getPreparedData(res);
        });
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


module.exports = new Parser();