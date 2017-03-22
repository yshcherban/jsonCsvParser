const jsonParser = require('./Jsonparser');
const csvParser = require('./Csvparser');
const xlsxParser = require('./Xlsxparser');
const dbpreparer = require('./Dbpreparer');


jsonParser.parse('./test/data/stud.json').then(res => {
    console.log(dbpreparer.getPreparedData(res));
}).catch(e => {
    console.log(e);
});

//console.log(dbpreparer.getPreparedData(12))

// csvParser.parse('./test/data/students-broken.csv').then(res => {
//     console.log(res);
// });

// xlsxParser.parse('./test/data/stud.json').then(res => {
//     console.log(res);
// });
