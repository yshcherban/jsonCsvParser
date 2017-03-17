const jsonParser = require('./Jsonparser');
const csvParser = require('./Csvparser');
const xlsxParser = require('./Xlsxparser');
const dbpreparer = require('./Dbpreparer');


jsonParser.parse('stud.json').then(res => {
    dbpreparer.getPreparedData(res).then(res => {
        console.log(res);
    });
});

// csvParser.parse('students-broken.csv').then(res => {
//     console.log(res);
// });

// xlsxParser.parse('students2.xlsx').then(res => {
//     console.log(res);
// });
