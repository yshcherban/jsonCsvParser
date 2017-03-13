const   fs      = require('fs'),
        path    = require('path'),
        mime    = require('mime'),
        XLSX    = require('xlsx'),
        baby    = require('babyparse'),
        Promise	= require('bluebird');


// Returns json file and origHeaders (headers from parsed file)
class Parser {
    constructor(file) {
        this.file = file;
        this.parsedFile;
        this.origHeaders;
    }
    
    getTypeOfFile() {
        switch(true) {
            case (path.extname(this.file) === '.json') || (mime.lookup(this.file) === 'application/json'):
                return 'json';
                break;
            case (path.extname(this.file) === '.csv') || (mime.lookup(this.file) === 'text/csv'):
                return 'csv';
                break;
            case (path.extname(this.file) === '.xlsx') || (mime.lookup(this.file) === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'):
                return 'xlsx';
                break;
        }
    }
    
    parse() {
        switch(this.getTypeOfFile(this.file)) {
            case 'json':
                return this.readJsonFile(this.file, "utf8").then( contents => {
                    // надо подумать
                    /*this.parsedFile = JSON.parse(contents);
                    let origHeaders = [];
                    
                    for (let i = 0; i < getJsonFromfileContent.length; i++) {
                        for (let cap in getJsonFromfileContent[i]) {
                            origHeaders.push(cap);
                        }
                        const guessedHeaders	= guessHeaders(origHeaders);
                        getStudentsBeforeInsertIntoDb([getJsonFromfileContent[i]], guessedHeaders);
                        origHeaders = [];
                    }*/
                });
                
                break;
            case 'csv':
                return this.parseCSVFile(this.file, { header: true }).then( result => {
                    this.parsedFile = result.data || [];
                    this.origHeaders = result.meta.fields || [];
                });
                break;
            case 'xlsx':
                Parser.readXlsxFile(this.file).then(readFile => {
                    this.parsedFile = XLSX.utils.sheet_to_json(readFile.Sheets[readFile.SheetNames[0]]) || [];
                    this.origHeaders = XLSX.utils.sheet_to_json(readFile.Sheets[readFile.SheetNames[0]], {header: 1})[0] || [];
                });
            break;
        }
    }
    
    /* getters */
    get parsedFromOriginalFile() {
        this.parsedFile;
    }
    
    get parsedOriginalHeadersFromFile() {
        return this.origHeaders;
    }
    
    /* constants */
    static get readJsonFile() {
      return Promise.promisify(fs.readFile);
    }
    
    static get readXlsxFile() {
      return Promise.method(XLSX.readFile);
    }
    
    static get effectiveConfig() {
        return Object.assign({}, config, {
                complete:	(results, file) => { resolve(results) },
                error: 		(error, file) => { reject(error) }
            });
    }
    
    parseCSVFile(file, config) {
        return new Promise((resolve, reject) => {
            baby.parseFiles(file, Parser.effectiveConfig);
            // no return
        });
    }
    
}


// Returns data/file according to defined structure
class DbPreparer {
    constructor(fileContent, origHeaders) {
        this.parsedFile = fileContent;
        this.originalHeaders = origHeaders;
    }
    
    
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
    static set guessHeaders(fieldNamesArray) {
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
    
    static get preparedData() {
        return this.parsedFile.filter( item => Object.keys(item).length > 1 )	// removing empty objects
			.map( item => objectToStudent(this.getGuessedHeaders(), item));
    }
}



let parser = new Parser('students.xlsx');
parser.parse();
//console.log(parser.parsedFromOriginalFile);

//let preparer = new DbPreparer(parser.parsedFromOriginalFile, parser.parsedOriginalHeadersFromFile);
//preparer.getPreparedData();




/**
 * Processes passed command line arguments
 */
/*process.argv.forEach(function (val, index, array) {
    
});*/











