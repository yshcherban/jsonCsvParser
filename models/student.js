const   mongoose = require('mongoose');
const   Schema = mongoose.Schema;

const StudentSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthday: { type: Date },
    gender: { type: String, enum:['MALE', 'FEMALE'] },
    rollbackMarker: { type: String }
});

module.exports = mongoose.model('Student', StudentSchema); // name of collection generates by Student - as students