const mongoose = require('mongoose');

const deliveryPartnerSchema = mongoose.Schema({
    phoneno:Number,
    password:String
}, {timestamps: true})

module.exports = mongoose.model('deliveryPartners', deliveryPartnerSchema);