const mongoose = require('mongoose');

const blogModel = mongoose.Schema({
    blog_title:{
        type: String,
        required: true
    },
    blog_description:{
        type: String,
        required: true
    },
    blog_image:{
        type: String,
        required: true
    }

});

const blog = mongoose.model('blog',blogModel );

module.exports = blog;