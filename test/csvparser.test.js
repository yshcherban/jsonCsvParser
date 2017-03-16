"use strict";

const   chai = require('chai'),
        should = chai.should(),
        csvParser = require('../Csvparser');

describe('CSVparser', () => {
    it('should consist the same pair-values"', (done) => {
        csvParser.parse('students.csv').then( (res) => {
            res.should.deep.equal([{
                "firstname": "Yaroslav",
                "lastname": "Shcherban",
                "gender": "male"
            },
            {
                "firstname": "Ivan",
                "lastname": "Onoprienko",
                "gender": "male"
            },
            {
                "firstname": "Bob",
                "lastname": "Smith",
                "gender": "male"
            }]
            );
            done();
        });
    });

    it('should return error for wrong file type', (done) => {
        csvParser.parse('students.xml').catch( e => {
            done();
        });
    });

    it('should return error of broken file', (done) => {
        csvParser.parse('students-broken.csv').catch( e => {
            done();
        });
    });

});