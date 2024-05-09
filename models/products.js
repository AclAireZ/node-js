const mongoose   = require('mongoose');
const orders = require('./orders');
const products = new mongoose.Schema({
    product_name: { type: String},
    price: { type: Number},
    amount: { type: Number},
    order: [{ type: mongoose.Schema.Types.ObjectId, ref: 'orders' }]
    
});


module.exports = mongoose.model("products", products);