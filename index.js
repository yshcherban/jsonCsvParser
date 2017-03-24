const jsonParser = require('./JsonParser');
const csvParser = require('./CsvParser');
const xlsxParser = require('./XlsxParser');
const dbpreparer = require('./DbPreparer');


jsonParser.parse('./test/data/stud.json').then(res => {
    console.log(dbpreparer.getPreparedData(
        [
            {
                "name": "Yaroslav",
                "lastname": "Shcherban",
                "gender": '0',
                "bday": "10/12/1955"
            }
        ]
    ));
}).catch(e => {
    console.log(e);
});

//console.log(dbpreparer.getPreparedData(12))

// csvParser.parse('./test/data/students-broken.csv').then(res => {
//     console.log(res);
// });

// xlsxParser.parse('./test/data/spread.xlsx').then(res => {
//     console.log(dbpreparer.getPreparedData((res)));
// });
