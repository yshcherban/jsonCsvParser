const jsonParser = require('./Jsonparser');
const csvParser = require('./Csvparser');
const xlsxParser = require('./Xlsxparser');


// jsonParser.parse('stud.json').then(res => {
//     console.log(res);
// });

// csvParser.parse('students.csv').then(res => {
//     console.log(res);
// });

xlsxParser.parse('students.xlsx').then(res => {
    console.log(res);
});
