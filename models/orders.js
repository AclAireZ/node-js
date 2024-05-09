const mongoose   = require('mongoose');
const orders = new mongoose.Schema({
    name: { type: String},
    amount: { type: Number},
    productId : { type: mongoose.Schema.Types.ObjectId, ref: 'products' }
});


module.exports = mongoose.model("orders", orders);