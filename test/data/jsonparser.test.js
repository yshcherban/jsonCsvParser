"use strict";

const   chai = require('chai'),
        should = chai.should(),
        jsonParser = require('../../Jsonparser');

describe('JSONparser', () => {
    it('should consist the same pair-values', (done) => {
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

    it('should return error as "SyntaxError: Unexpected token (x) in JSON at position (n)" for wrong file type', (done) => {
        jsonParser.parse('students.xml').catch( e => {
            done();
        });
    });

    it('should return error as "SyntaxError: Unexpected token (x) in JSON at position (n)" for broken file', (done) => {
        jsonParser.parse('stud-broken.json').catch( e => {
            done();
        });
    });

});