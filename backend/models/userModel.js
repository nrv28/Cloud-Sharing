const mongoose = require('mongoose');

const User_Model = new mongoose.Schema({
    name : {type : String,required:true},
    email : {type : String,required:true},
    password : {type : String,required:true}
});

const User = mongoose.model('User',User_Model);

module.exports = User;