const   moment = require('moment'),
        assert = require('assert');

/**
 * Creates Date Object for date as input string
 * @param {string} date
 * @returns {Date} recognized date
 */
const getBdayDateFormat = (date) => {
    assert(typeof date === 'string', 'date is not a string');

    moment.parseTwoDigitYear = (input) => {
        return parseInt(input) + (parseInt(input) > 54 ? 1900 : 2000);
    };

    const formatDate = moment(date, ["DD/MM/YYYY", "DD/MM/YY", "DD/M/YY", "DD.MM.YYYY", "DD.MM.YY", "DD.M.YY", "YYYY-MM-DD", "DD MMM YYYY"]);

    return formatDate.isValid() ? formatDate.toDate() : undefined;
};

module.exports = getBdayDateFormat;