const mongoose = require('mongoose');

const userModel = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    is_admin:{
        type: String,
        required: true
    },
    token:{
        type:String,
        required:false
    }
});

const user = mongoose.model('user',userModel );

module.exports = user;