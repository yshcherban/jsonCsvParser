"use strict";

const   chai = require('chai'),
        should = chai.should(),
        expect = chai.expect,
        dateParser = require('../DateParser');

/**
 * input string format: DD/MM/YYYY, DD/MM/YY, DD/M/YY, DD.MM.YYYY, DD.MM.YY", DD.M.YY, YYYY-MM-DD, DD MMM YYYY
 * correct two digit year > 54, min 55 for 1955, 1954 converts to 2053
 */
describe('dateParser', () => {
    it('should return a Date object for date as input string DD/MM/YYYY', (done) => {
        dateParser('09/12/1986').should.be.instanceof(Date);
        done();
    });

    it('should return a Date object for date as input string DD/MM/YY', (done) => {
        dateParser('09/12/86').should.be.instanceof(Date);
        done();
    });

    it('should return a Date object for date as input string DD/M/YY', (done) => {
        dateParser('09.05.64').should.be.instanceof(Date);
        done();
    });

    it('should return a Date object for date as input string DD.MM.YYYY', (done) => {
        dateParser('09.05.1964').should.be.instanceof(Date);
        done();
    });

    it('should return a Date object for date as input string DD.MM.YY', (done) => {
        dateParser('09.05.64').should.be.instanceof(Date);
        done();
    });

    it('should return a Date object for date as input string DD.M.YY', (done) => {
        dateParser('09.5.64').should.be.instanceof(Date);
        done();
    });

    it('should return a Date object for date as input string YYYY-MM-DD', (done) => {
        dateParser('2012.05.15').should.be.instanceof(Date);
        done();
    });

    it('should return a Date object for date as input string DD MMM YYYY', (done) => {
        dateParser('8 March 1995').should.be.instanceof(Date);
        done();
    });

    it('should return "undefined" for wrong date', (done) => {
        expect(dateParser('test')).to.be.undefined;
        done();
    });

    it('should return correct Full Year of two digit year', (done) => {
        dateParser('05.10.55').getFullYear().should.equal(1955);
        done();
    });

    it('should return correct Full Year of two digit year', (done) => {
        dateParser('05.10.55').getFullYear().should.equal(1955);
        done();
    });

    it('should return Full Year as "2054" of two digit year 54', (done) => {
        dateParser('05.10.54').getFullYear().should.equal(2054);
        done();
    });

});