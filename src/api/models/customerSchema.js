const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    phoneno:Number,
    password:String,
    cart:[],
    myOrders:[{
        catalogueId:String,
        quantity:Number,
        deliveryPoint:String,
        mobile:Number,
        name:String,
        pickup:[]
    }, {timestamps:true}]
}, {timestamps: true})

module.exports = mongoose.model('customers', customerSchema);