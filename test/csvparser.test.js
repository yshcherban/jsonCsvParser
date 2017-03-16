"use strict";

const   chai = require('chai'),
        should = chai.should(),
        csvParser = require('../Csvparser');

describe('CSVparser', () => {
    it('should return error for wrong file type', (done) => {
        csvParser.parse('students.xml').catch( e => {
            done();
        });
    });

    it('should return error of broken file', (done) => {
        csvParser.parse('stud.json').catch( e => {
            done();
        });
    });

});