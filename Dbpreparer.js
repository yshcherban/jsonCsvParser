const   Promise	= require('bluebird');

function isJson(jsonObj) {
    try {
        JSON.parse(JSON.stringify(jsonObj));
    } catch (e) {
        return false;
    }
    return true;
}

function getPreparedData ( arrJsonObj ) {
    let preparedData = [];
    let unpreparedData = [];
    const required = ["firstName", "lastName", "gender"];

    for (let i = 0; i < arrJsonObj.length; i++) {

        const promiseResponse = new Promise((resolve, reject) => {
            let origHeaders = [];


            for (let cap in arrJsonObj[i]) {
                origHeaders.push(cap);
            }

            if (origHeaders.length > 0) {
                resolve(origHeaders);
            } else {
                reject(new Error('not found'));
            }

        }).then(origHeader => {
            const guessColumn = function (origHeader, fieldToGuess) {

                /** possible values for well-known params */
                const guessTable = {
                    firstName: ['name', 'firstname'],
                    lastName: ['surname', 'lastname'],
                    gender: ['gender'],
                    birthday: ['birthday', 'bday', 'dob'],
                    form: ['form'],
                    house: ['house']
                };

                const possibleValues = guessTable[fieldToGuess];
                if (!Array.isArray(possibleValues)) throw new Error("no such value in table"); //return undefined;	// there is no such value in table

                return origHeader.find(fieldName => {
                    const lowFieldName = fieldName.toLowerCase();
                    return possibleValues.findIndex(possibleValue => possibleValue === lowFieldName) !== -1;
                });
            }

            return {
                firstName: guessColumn(origHeader, 'firstName'),
                lastName: guessColumn(origHeader, 'lastName'),
                gender: guessColumn(origHeader, 'gender'),
                birthday: guessColumn(origHeader, 'birthday'),
                form: guessColumn(origHeader, 'form'),
                house: guessColumn(origHeader, 'house')
            }

        }).then(guessedHeaders => {
            /** Try to guess gender value */
            const guessGender = function (genderValue) {
                const lowGender = genderValue.toLowerCase();

                if (lowGender === 'boy' || lowGender === 'male' || lowGender === '1')    return 'MALE';
                if (lowGender === 'girl' || lowGender === 'female' || lowGender === '0') return 'FEMALE';

                return genderValue;
            };

            const objectToStudent = function (headers, obj) {
                const   firstName = obj[headers.firstName],
                        lastName = obj[headers.lastName],
                        gender = obj[headers.gender];

                return {
                    firstName: firstName ? firstName.trim() : undefined,
                    lastName: lastName ? lastName.trim() : undefined,
                    gender: gender ? guessGender(gender) : undefined,

                    birthday: obj[headers.birthday],
                    form: obj[headers.form],
                    house: obj[headers.house]
                };
            };

            const jSonObj = [arrJsonObj[i]].filter(item => Object.keys(item).length > 1)	// removing empty objects
                .map(item => objectToStudent(guessedHeaders, item));

            return jSonObj[0];

        }).then( prepObj => {
            if (required.length > 0) {
                let foundReqHeaders = 0;
                required.forEach( (val, i, arr) => {
                    if ((Object.keys(prepObj).indexOf(val)) !== -1) {
                        if ( prepObj[val] !== undefined ) {
                            foundReqHeaders += 1;
                        }
                    }
                });

                if (required.length === foundReqHeaders) {
                   return prepObj;
                }

            } else {
                return prepObj;
            }

        });


        preparedData.push(promiseResponse);
    }

    return Promise.all(preparedData);
}


module.exports.isJson = isJson;
module.exports.getPreparedData = getPreparedData;