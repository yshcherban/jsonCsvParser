const   fs      = require('fs'),
        path    = require('path'),
        mime    = require('mime'),
        XLSX    = require('xlsx'),
        baby    = require('babyparse'),
        Promise	= require('bluebird');


const readFile = Promise.promisify(fs.readFile);
const readXlsxFile = Promise.promisify(XLSX.readFile);

const parseCSVFile = function(file, config) {
	return new Promise((resolve, reject) => {
		const effectiveConfig = Object.assign({}, config, {
			complete:	(results, file) => { resolve(results) },
			error: 		(error, file) => { reject(error) }
		});
		baby.parseFiles(file, effectiveConfig);
		// no return
	});
};

/** possible values for well-known params */
const guessTable = {
	firstName:	['name', 'firstname'],
	lastName:	['surname', 'lastname'],
	gender: 	['gender'],
	birthday: 	['birthday', 'bday', 'dob'],
	form: 		['form'],
	house: 		['house']
};

/**
 * Guess actual column name based on guessTable.
 * @param {Array.<String>} fieldNames array of actual name of columns
 * @param {String} fieldToGuess name of column to search. This is key in guess table. Like `firstName`
 * @return {String|undefined} actual name for `fieldToGuess`
 */
const guessColumn = function(fieldNames, fieldToGuess) {
	const possibleValues = guessTable[fieldToGuess];
	if(!Array.isArray(possibleValues)) return undefined;	// there is no such value in table
    
	return fieldNames.find( fieldName => {
		const lowFieldName = fieldName.toLowerCase();
		return possibleValues.findIndex( possibleValue => possibleValue === lowFieldName ) !== -1;
	});
};

/**
 * Return mapping object. Each key have real column name or undefined if no suitable column found
 * @param {Array.<String>} fieldNamesArray fieldNames array of actual name of columns
 * @return {{firstName: (String|undefined), lastName: (String|undefined), gender: (String|undefined), birthday: (String|undefined), form: (String|undefined), house: (String|undefined)}}
 */
const guessHeaders = function(fieldNamesArray) {
	return {
		firstName:	guessColumn(fieldNamesArray, 'firstName'),
		lastName:	guessColumn(fieldNamesArray, 'lastName'),
		gender:		guessColumn(fieldNamesArray, 'gender'),
		birthday:	guessColumn(fieldNamesArray, 'birthday'),
		form:		guessColumn(fieldNamesArray, 'form'),
		house:		guessColumn(fieldNamesArray, 'house')
	}
};

/** Try to guess gender value */
const guessGender = function (genderValue) {
	const lowGender = genderValue.toLowerCase();
    
	if(lowGender === 'boy' || lowGender === 'male' || lowGender === '1') 	return 'MALE';
	if(lowGender === 'girl' || lowGender === 'female' || lowGender === '0') return 'FEMALE';
	
    return genderValue;
};

const objectToStudent = function(headers, obj) {
	const 	firstName	= obj[headers.firstName],
			lastName	= obj[headers.lastName],
			gender		= obj[headers.gender];
            
	return {
		firstName:	firstName ? firstName.trim() : undefined,
		lastName:	lastName ? lastName.trim() : undefined,
		gender: 	gender ? guessGender(gender) : undefined,
		
        birthday:	obj[headers.birthday],
		form:		obj[headers.form],
		house: 		obj[headers.house]
	};
};

/**
 * Reads students from CSV file
 */
function readStudentsFromCSVFile(file) {
    
	return parseCSVFile(file, { header: true }).then( result => {
		const 	data			= result.data || [],
				origHeaders		= result.meta.fields || [],
				guessedHeaders	= guessHeaders(origHeaders);

		const studentArray = data.filter( item => Object.keys(item).length > 1 )	// removing empty objects
			.map( item => objectToStudent(guessedHeaders, item));
        
        console.log(studentArray);
		
	}).catch(function(e) {
        console.log("Error reading file", e);
    });
}

/**
 * Reads students from JSON file
 */
function readStudentsFromJSONFile(file) {
    
    return readFile(file, "utf8").then( contents => {
        const   getJsonFromfileContent = JSON.parse(contents),
                origHeaders		= ['firstName', 'lastName', 'gender'] || [],
                guessedHeaders	= guessHeaders(origHeaders);
        
        const studentArray = getJsonFromfileContent.filter( item => Object.keys(item).length > 1 )	// removing empty objects
                    .map( item => objectToStudent(guessedHeaders, item));
        
        console.log(studentArray);
                    
    }).catch(function(e) {
        console.log("Error reading file", e);
    });
    
}

/**
 * Reads students from XLSX file
 */
function readStudentsFromXlsxFile(file) {
    const   workbook = XLSX.readFile(file)
            sheetNameList = workbook.SheetNames,
            getJsonFromSheetNameList = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]),
            origHeaders		= ['firstname', 'lastname', 'gender'] || [],
            guessedHeaders	= guessHeaders(origHeaders);
        
    const studentArray = getJsonFromSheetNameList.filter( item => Object.keys(item).length > 1 )	// removing empty objects
                .map( item => objectToStudent(guessedHeaders, item));
        
    console.log(studentArray);
}

/**
 * Gets passed file type
 */
function getTypeOfFile(file) {
    switch(true) {
        case (path.extname(file) === '.json') || (mime.lookup(file) === 'application/json'):
            return 'json';
            break;
        case (path.extname(file) === '.csv') || (mime.lookup(file) === 'text/csv'):
            return 'csv';
            break;
        case (path.extname(file) === '.xlsx') || (mime.lookup(file) === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'):
            return 'xlsx';
            break;
    }
}

/**
 * Processes passed command line arguments
 */
process.argv.forEach(function (val, index, array) {
  switch (getTypeOfFile(val)) {
    case 'json':
        readStudentsFromJSONFile(val); 
        break;
    case 'csv':
        readStudentsFromCSVFile(val);
        break;
    case 'xlsx':
        readStudentsFromXlsxFile(val);
        break;
  }
});



















