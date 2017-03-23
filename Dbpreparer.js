const   assert = require('assert'),
        moment = require('moment');

/** required fields "firstName", "lastName", "gender", "birthday" */
const requiredFields = ["firstName", "lastName", "gender", "birthday"];
/** successfully saved data */
const prepData = [];
/** failed saved data */
const unpreparedData = [];

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
    assert(typeof fieldToGuess === 'string', 'fieldToGuess is not a string');
    assert(typeof fieldNames === 'object', 'fieldNames is not an object');

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

    assert(Array.isArray(fieldNamesArray), 'fieldNames is not an array');

    return {
        firstName:	guessColumn(fieldNamesArray, 'firstName'),
        lastName:	guessColumn(fieldNamesArray, 'lastName'),
        gender:		guessColumn(fieldNamesArray, 'gender'),
        birthday:	guessColumn(fieldNamesArray, 'birthday'),
        form:		guessColumn(fieldNamesArray, 'form'),
        house:		guessColumn(fieldNamesArray, 'house')
    }
};

/** Set date format as 12/03/68 */
const getBdayDateFormat = function (date) {
    const formatDate = moment(date, ["DD.MM.YYYY", "DD.MM.YY", "DD.M.YY", "YYYY-MM-DD", "DD MMM YYYY"]).format("D/MM/YY");
    assert(formatDate, 'date is an incorrect');

    return formatDate !== 'Invalid date' ? formatDate: undefined;
};

/** Try to guess gender value */
const guessGender = function (genderValue) {
    assert(typeof genderValue === 'string', 'genderValue is not a string');

    const lowGender = genderValue.toLowerCase();

    if(lowGender === 'boy' || lowGender === 'male' || lowGender === 'm' || lowGender === '1' ) return 'MALE';
    if(lowGender === 'girl' || lowGender === 'female' || lowGender === 'f' || lowGender === '0') return 'FEMALE';

    return genderValue;
};

/** Set output structure */
const objectToStudent = function(headers, obj) {
    assert(typeof headers === 'object', 'headers is not an object');
    assert(typeof obj === 'object', 'obj is not an object');

    const 	firstName	= obj[headers.firstName],
            lastName	= obj[headers.lastName],
            gender		= obj[headers.gender],
            birthday    = obj[headers.birthday];

    return {
        firstName:	firstName ? firstName.trim() : undefined,
        lastName:	lastName ? lastName.trim() : undefined,
        gender: 	gender ? guessGender(gender) : undefined,

        birthday:	birthday ? getBdayDateFormat(birthday) : undefined,
        form:		obj[headers.form],
        house: 		obj[headers.house]
    };
};

/**
 * Casts the data to common structure before save it to DB
 */
function generalizeData (data, headers) {
    assert(typeof data === 'object', 'data is not an object');
    assert(typeof headers === 'object', 'headers is not an object');

    const studentArray = data.filter( item => Object.keys(item).length > 0 )	// removing empty objects
        .map( item => objectToStudent(headers, item));

    return studentArray;
}

/** checks for any required fields exist in JSON */
function checkIfRequiredFieldsExist(JSONobj) {
    const foundReqHeaders = [];

    requiredFields.forEach( (field) => {
        if ((Object.keys(JSONobj).indexOf(field)) !== -1) {
            if(JSONobj[field] !== undefined) {
                foundReqHeaders.push(1);
            }
        }
    });

    return requiredFields.length === foundReqHeaders.length;
}

/** prepares data for output */
function prepareData (arrJsonObj) {
    const guessedData = getGuessedData(arrJsonObj);

    guessedData.forEach( jsonObj => {
        if(checkIfRequiredFieldsExist(jsonObj)) {
            prepData.push(jsonObj);
        } else {
            unpreparedData.push(jsonObj);
        }
    });

    return {
        "success": prepData,
        "failed": unpreparedData
    };

}

/** Forms guessed structure */
function getGuessedData(arrJsonObj) {

    let preparedData = [];

    arrJsonObj.forEach( arrJSONobj => {
        preparedData.push(generalizeData([arrJSONobj], guessHeaders(Object.keys(arrJSONobj)))[0]);
    });

    return preparedData;

}

/** Gets data before save it to db */
function getPreparedData(arrJsonObj) {
    assert(Array.isArray(arrJsonObj), 'arrJsonObj is not an array');

    return prepareData(arrJsonObj);
}


module.exports.getPreparedData = getPreparedData;