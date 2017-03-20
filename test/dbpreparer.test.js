"use strict";

const   chai = require('chai'),
        should = chai.should(),
        expect = chai.expect,
        dbPreparer = require('../Dbpreparer');

describe('dbPreparer', () => {
    it('should return a prepared json"', (done) => {
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
            }]).should.deep.equal([
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

    it('should return array of object as result"', (done) => {
        dbPreparer.getPreparedData([{
            "name": "Yaroslav",
            "lastname": "Shcherban",
            "gender": "male"
        }]).should.to.be.an('array');
        done();
    });

});