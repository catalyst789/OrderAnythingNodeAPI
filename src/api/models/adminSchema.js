const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    phoneno:Number,
    password:String
}, {timestamps: true})

module.exports = mongoose.model('admin', adminSchema);