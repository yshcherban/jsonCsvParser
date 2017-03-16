"use strict";

const   chai = require('chai'),
        should = chai.should(),
        jsonParser = require('../Jsonparser');

describe('JSONparser', () => {
    it('should have the property "firstName"', (done) => {
        jsonParser.parse('stud.json').then((res) => {
            res.should.deep.equal([{
                    "lastname": "Shcherban",
                    "gender": "boy",
                    "firstName": "Yaroslav"
                },
                {
                    "firstname": "Slava",
                    "lastname": "Kondratuk",
                    "gender": "0"
                },
                {
                    "firstName": "Luiza",
                    "lastName": "Smith",
                    "gender": "girl"
                },
                {
                    "firstName": "Ivan",
                    "lastName": "Onoprienko",
                    "gender": "1"
                },
                {
                    "firstName": "Oksana",
                    "lastName": "Sen",
                    "gender": "0"
                },
                {
                    "firstName": "Alexey",
                    "lastName": "Ivanov",
                    "gender": "boy"
                }]);
            done();
        })
    });

    it('should return error for wrong file type', (done) => {
        jsonParser.parse('students.xml').catch( e => {
            done();
        });
    });

    it('should return error of broken file', (done) => {
        jsonParser.parse('stud.json').catch( e => {
            done();
        });
    });

});