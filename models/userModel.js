const mongoose = require('mongoose');
const users = new mongoose.Schema({
    username: { type: String},
    password: { type: String},
    firstName: { type: String},
    lastName: { type: String},
    email: { type: String},
    approved: { type: Boolean, default: false },
    role: { type: String}
    
});

module.exports = mongoose.model("users", users);