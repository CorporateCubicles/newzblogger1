const express = require('express');
const blog_routs = express();

blog_routs.set('view engine', 'ejs');
blog_routs.set('views', './views');

blog_routs.use(express.static('public'));

const blogController = require('../controller/blogController');

blog_routs.get('/',  blogController.loadBlogs);

blog_routs.get('/post/:id',blogController.loadPost);

module.exports = blog_routs;