let mongoose = require('mongoose');

// create a model class
let inforModel = mongoose.Schema({
    name: String,
    number: String, 
    email: String
},
{
    collection: "infor"
});

module.exports = mongoose.model('Infor', inforModel);