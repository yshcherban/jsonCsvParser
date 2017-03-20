const   Promise	= require('bluebird');

function isJson(jsonObj) {
    try {
        JSON.parse(JSON.stringify(jsonObj));
    } catch (e) {
        return false;
    }
    return true;
}


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
 * Casts the data to common structure before save it to DB
 */
function generalizeData (data, headers) {
    const studentArray = data.filter( item => Object.keys(item).length > 1 )	// removing empty objects
        .map( item => objectToStudent(headers, item));

    return studentArray;
}

function getPreparedData(arrJsonObj) {
    const res = [];

    for (let i = 0; i < arrJsonObj.length; i++) {
        const guessedHeaders = guessHeaders(Object.keys(arrJsonObj[i]));
        res.push(generalizeData([arrJsonObj[i]], guessedHeaders)[0]);
    }
    
    return res;
}




module.exports.isJson = isJson;
module.exports.getPreparedData = getPreparedData;