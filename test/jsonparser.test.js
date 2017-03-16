"use strict";

const   chai = require('chai'),
        should = chai.should(),
        jsonParser = require('../Jsonparser');

describe('JSONparser', () => {
    it('should have the property "firstName"', (done) => {
        jsonParser.parse('stud.json').then((res) => {
            res.should.have.deep.property('[0].firstName');
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