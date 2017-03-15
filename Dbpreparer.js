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

    getPreparedData(objJson) {
        const preparedJson = [];
        let origHeaders = [];

        for (let i = 0; i < objJson.length; i++) {
            for (let cap in objJson[i]) {
                origHeaders.push(cap);
            }

            const guessedHeaders = this.guessHeaders(origHeaders);
            preparedJson.push(this.preparedData([objJson[i]], guessedHeaders));
            origHeaders = [];
        }

        return preparedJson;
    }

    preparedData(data, headers) {
        return data.filter( item => Object.keys(item).length > 1 )	// removing empty objects
            .map( item => this.objectToStudent(headers, item));
    }
}

module.exports = new DbPreparer();