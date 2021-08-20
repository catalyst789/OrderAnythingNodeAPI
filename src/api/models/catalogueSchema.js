const mongoose = require('mongoose');

const catalogueSchema = mongoose.Schema({
    category:String,
    name:String,
    address:[],
    quantity:Number
});

module.exports = mongoose.model('catalogue', catalogueSchema);