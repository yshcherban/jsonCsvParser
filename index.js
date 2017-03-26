const jsonParser = require('./JsonParser');
const csvParser = require('./CsvParser');
const xlsxParser = require('./XlsxParser');
const dbpreparer = require('./DbPreparer');

/** database */
const mongoose = require('mongoose');
const Student = require('./models/student');

mongoose.connect('mongodb://127.0.0.1:27017/squad', function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to the database");

        const marker = mongoose.Types.ObjectId();

        const student = new Student();
        student.firstName = 'Ivan';
        student.rollbackMarker = marker;

        student.save(function(err, student, affected) {
            if (err) {
                Student.deleteMany( { rollbackMarker: marker }, function(err) {
                    if (err) console.log('Cant delete records');
                    console.log('Rollback done')
                })
            }
            console.log('saved');
        });

    }
});



// jsonParser.parse('./test/data/stud.json').then(res => {
//     console.log(dbpreparer.getPreparedData(res));
// }).catch(e => {
//     console.log(e);
// });

//console.log(dbpreparer.getPreparedData(12))

// csvParser.parse('./test/data/students-broken.csv').then(res => {
//     console.log(res);
// });

// xlsxParser.parse('./test/data/spread.xlsx').then(res => {
//     console.log(dbpreparer.getPreparedData((res)));
// });
