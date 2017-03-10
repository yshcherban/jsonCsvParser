const   fs      = require('fs'),
        baby    = require('babyparse'),
        Promise	= require('bluebird');

//const app = express();
const csvFile = 'students2.csv';
const jsonFile = 'stud.json';

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

function readStudentsFromCSVFile(file) {
	return parseCSVFile(file, { header: true }).then( result => {
		const 	data			= result.data || [],
				origHeaders		= result.meta.fields || [],
				guessedHeaders	= guessHeaders(origHeaders);

		const studentArray = data.filter( item => Object.keys(item).length > 1 )	// removing empty objects
			.map( item => objectToStudent(guessedHeaders, item));
        
		return {
			students: studentArray,
			errors: result.errors,
			meta: result.meta
		}
	}).then(result => {
        console.log(result.students);
    });
}

function readStudentsFromJSONFile(file) {
    fs.readFile(jsonFile, (err, data) => {
       if (err) throw err;
       
       try {
            const getJsonFromfileContent = JSON.parse(data);
            origHeaders		= ['firstName', 'lastName', 'gender'] || [],
            guessedHeaders	= guessHeaders(origHeaders);

            const studentArray = getJsonFromfileContent.filter( item => Object.keys(item).length > 1 )	// removing empty objects
                .map( item => objectToStudent(guessedHeaders, item));

            console.log(studentArray);        
       } catch (err) {
           console.log('Invalid jSon file');
       }
       
  });
}


function readStudentsFromXlsxFile(file) {
    
}

process.argv.forEach(function (val, index, array) {
  switch (val) {
      case 'fromJson':
        readStudentsFromJSONFile(jsonFile); 
        break;
      case 'fromCvs': 
        readStudentsFromCSVFile(csvFile);
        break;
  }  
});




















