"use strict";

const   chai = require('chai'),
        should = chai.should(),
        xlsxParser = require('../../Xlsxparser');

describe('XLSXparser', () => {
    it('should consist the same pair-values"', (done) => {
        xlsxParser.parse('students.xlsx').then( (res) => {
            res.should.deep.equal([{
                    "firstname": "Yaroslav",
                    "lastname": "Shcherban",
                    "gender": "boy"
                },
                {
                    "firstname": "Ivan",
                    "lastname": "Onoprienko",
                    "gender": "male"
                },
                {
                    "firstname": "Luiza",
                    "lastname": "Smith",
                    "gender": "girl"
                },
                {
                    "firstname": "Igor",
                    "lastname": "Kolomoyskij",
                    "gender": "1"
                },
                {
                    "firstname": "Natalia",
                    "lastname": "Stashevskaja",
                    "gender": "0"
                }]
            );
            done();
        });
    });

    it('should return error as "Error: Unsupported file 102" for wrong file type', (done) => {
        xlsxParser.parse('students.csv').catch( e => {
            done();
        });
    });

    it('should return error as "Error: Unsupported file 40" for broken file', (done) => {
        xlsxParser.parse('students2.xlsx').catch( e => {
            done();
        });
    });

});