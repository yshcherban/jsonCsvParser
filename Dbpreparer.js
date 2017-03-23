const   assert = require('assert');

function isJson(jsonObj) {
    try {
        JSON.parse(jsonObj);
    } catch (e) {
        return false;
    }
    return true;
}

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

/** Set birthday date format as 12/03/68 */
const getBdayDateFormat = function (date) {
    assert(!(/^[a-zA-Z]+$/.test(date)), 'date is an incorrect');

    const expectedDigitDate = date.match(/[0-9]+/g); /** digits from string */
    const month = date.match(/[a-zA-Z]+/g); /** character from string */

    /** day as integer */
    const getDay = expectedDigitDate[0] = parseInt(expectedDigitDate[0]);
    /** set year to 2 digits */
    const getYear = expectedDigitDate[expectedDigitDate.length - 1];
    expectedDigitDate[expectedDigitDate.length - 1] = new Date(Date.parse("09 22, " + getYear)).getFullYear().toString().substr(2,2);

    let outputDateFormat;

    if (month) {
        /** if month is a string */
        let getMonth = month.join();
        /** num of month */
        const getNumMonth = new Date(Date.parse(getMonth+" 22, 2017")).getMonth() + 1;
        /** insert month into array before year */
        expectedDigitDate.splice(expectedDigitDate.length -1, 0, getNumMonth);
        outputDateFormat = expectedDigitDate.join('/'); /** defined format */
        return outputDateFormat;
    } else {
        outputDateFormat = expectedDigitDate.join('/'); /** defined format */
        return outputDateFormat;
    }
}

/** Try to guess gender value */
const guessGender = function (genderValue) {
    assert(typeof genderValue === 'string', 'genderValue is not a string');

    const lowGender = genderValue.toLowerCase();

    if(lowGender === 'boy' || lowGender === 'male' || lowGender.toUpperCase() === 'M' || lowGender === 'm' || lowGender === '1' ) return 'MALE';
    if(lowGender === 'girl' || lowGender === 'female' || lowGender.toUpperCase() === 'F' || lowGender === 'f' || lowGender === '0') return 'FEMALE';

    return genderValue;
};

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

    const studentArray = data.filter( item => Object.keys(item).length > 1 )	// removing empty objects
        .map( item => objectToStudent(headers, item));

    return studentArray;
}

/** checks for any required fields exist in JSON */
function checkIfRequiredFieldsExist(arrJsonObj) {

    if (requiredFields.length > 0) {

        arrJsonObj.forEach( jsonObj => {

            const foundReqHeaders = [];

            requiredFields.forEach( (field) => {
                if ((Object.keys(jsonObj).indexOf(field)) !== -1) {
                    if(jsonObj[field] !== undefined) {
                        foundReqHeaders.push(1);
                    }
                }
            });

            if (requiredFields.length === foundReqHeaders.length) {
                prepData.push(jsonObj);
            } else {
                unpreparedData.push(jsonObj);
            }

        });
    } else {
        arrJsonObj.forEach(jsonObj => {
            prepData.push(jsonObj);
        })
    }
}

/**
 * Gets data before save it to db
 * @param arrJsonObj
 * @returns {{success: Array, failed: Array}}
 */
function getPreparedData(arrJsonObj) {
    assert(Array.isArray(arrJsonObj), 'arrJsonObj is not an array');

    let preparedData = [];

    arrJsonObj.forEach( arrJSONobj => {
        preparedData.push(generalizeData([arrJSONobj], guessHeaders(Object.keys(arrJSONobj)))[0]);
    });

    checkIfRequiredFieldsExist(preparedData);

    return {
        "success": prepData,
        "failed": unpreparedData
    };

}

module.exports.isJson = isJson;
module.exports.guessColumn = guessColumn;
module.exports.getPreparedData = getPreparedData;
module.exports.guessHeaders = guessHeaders;
module.exports.getBdayDateFormat = getBdayDateFormat;
module.exports.guessGender = guessGender;
module.exports.objectToStudent = objectToStudent;