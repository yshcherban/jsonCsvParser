const   assert = require('assert');

/** Try to guess gender value */
const guessGender = (genderValue) => {
    assert(typeof genderValue === 'string', 'genderValue is not a string');

    const lowGender = genderValue.toLowerCase();

    if (lowGender === 'boy' || lowGender === 'male' || lowGender === 'm' || lowGender === 'man' || lowGender === '1' ) return 'MALE';
    if (lowGender === 'girl' || lowGender === 'female' || lowGender === 'f' || lowGender === 'woman' || lowGender === '0') return 'FEMALE';

    return genderValue;
};

module.exports = guessGender;