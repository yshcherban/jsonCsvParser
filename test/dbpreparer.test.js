"use strict";

const   chai = require('chai'),
        should = chai.should(),
        expect = chai.expect,
        dbPreparer = require('../Dbpreparer');

describe('dbPreparer', () => {
    it('should return a prepared json without required fields as value of "failed" key', (done) => {
        dbPreparer.getPreparedData([
            {
                "name": "Yaroslav",
                "lastname": "Shcherban",
                "gender": "male"
            },
            {
                "name": "Ivan",
                "surname": "Onoprienko",
                "gender": "1"
            },
            {
                "firstname": "Bob",
                "lastName": "Smith",
                "gender": "1"
            }])["failed"].should.deep.equal([
            {
                "firstName": "Yaroslav",
                "lastName": "Shcherban",
                "gender": "MALE",
                "house": undefined,
                "form": undefined,
                "birthday": undefined
            },
            {
                "firstName": "Ivan",
                "lastName": "Onoprienko",
                "gender": "MALE",
                "house": undefined,
                "form": undefined,
                "birthday": undefined
            },
            {
                "firstName": "Bob",
                "lastName": "Smith",
                "gender": "MALE",
                "house": undefined,
                "form": undefined,
                "birthday": undefined
            }]);
        done();
    });

    it('should return prepared json with required fields as value of "success" key', (done) => {
        dbPreparer.getPreparedData([
            {
                "firstName": "Yaroslav",
                "lastname": "Shcherban",
                "gender": "boy",
                "bday": "09.10.1991"

            },
            {
                "firstname": "Slava",
                "lastname": "Kondratuk",
                "gender": "1",
                "bday": "02.07.1995"
            },
            {
                "firstName": "Luiza",
                "lastName": "Smith",
                "gender": "girl",
                "bday": "12.03.1997"
            },
            {
                "firstName": "Ivan",
                "lastName": "Onoprienko",
                "gender": "1",
                "bday": "02.07.1995"
            },
            {
                "firstName": "Oksana",
                "lastName": "Sen",
                "gender": "F",
                "dob": "02.07.1995"
            },
            {
                "firstName": "Alexey",
                "lastName": "Ivanov",
                "gender": "M",
                "dob": "14.12.1998"
            }
        ])["success"].should.deep.equal([
            {
                "firstName": "Yaroslav",
                "lastName": "Shcherban",
                "gender": "MALE",
                "house": undefined,
                "form": undefined,
                "birthday": "9/10/91"

            },
            {
                "firstName": "Slava",
                "lastName": "Kondratuk",
                "gender": "MALE",
                "house": undefined,
                "form": undefined,
                "birthday": "2/07/95"
            },
            {
                "firstName": "Luiza",
                "lastName": "Smith",
                "gender": "FEMALE",
                "house": undefined,
                "form": undefined,
                "birthday": "12/03/97"
            },
            {
                "firstName": "Ivan",
                "lastName": "Onoprienko",
                "gender": "MALE",
                "house": undefined,
                "form": undefined,
                "birthday": "2/07/95"
            },
            {
                "firstName": "Oksana",
                "lastName": "Sen",
                "gender": "FEMALE",
                "house": undefined,
                "form": undefined,
                "birthday": "2/07/95"
            },
            {
                "firstName": "Alexey",
                "lastName": "Ivanov",
                "gender": "MALE",
                "house": undefined,
                "form": undefined,
                "birthday": "14/12/98"
            }
        ]);
        done();
    });

    it('should return error as "arrJsonObj is not an array" for wrong data type', (done) => {
        expect( () => {
            dbPreparer.getPreparedData(12);
        }).to.throw(Error);
        done()
    });

    it('should return error as "TypeError: Cannot convert undefined or null to object" if pass empty array of objects', (done) => {
        expect( () => {
            dbPreparer.getPreparedData([{}]);
        }).to.throw(Error);
        done();
    });

    it('should return error as "AssertionError: arrJsonObj is not an array" for empty signature', (done) => {
        expect( () => {
            dbPreparer.getPreparedData();
        }).to.throw(Error);
        done();
    });

    it('should return a prepared json with mismatched headers as value of "failed" key', (done) => {
        dbPreparer.getPreparedData([
            {
                "example": "value",
                "example2": "value"
            }
        ])["failed"].should.deep.include.members([
            {
                "birthday": undefined,
                "firstName": undefined,
                "form": undefined,
                "gender": undefined,
                "house": undefined,
                "lastName": undefined
            }
        ]);
        done();
    })
});