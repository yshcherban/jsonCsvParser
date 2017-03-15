const Parser = require('./Parser');

Parser.parse('students.csv').then(res => {
    console.log(res);
});
