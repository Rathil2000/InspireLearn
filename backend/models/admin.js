const mongoose = require('mongoose');

const RegisterSchema = new mongoose.Schema({
    name:String,
    role:String,
    profession:String,
    email:String,
    password:String,
    profileImage:String
})

const Admin = mongoose.model('Admin', RegisterSchema);
module.exports = Admin;