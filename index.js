const Parser = require('./Parser');

Parser.parse('stud.json').then(res => {
    console.log(res);
});