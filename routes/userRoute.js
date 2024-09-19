const express = require('express');
const user_router = express();
require('dotenv').config();

const bodyParser = require('body-parser');
user_router.use(bodyParser.json());
user_router.use(bodyParser.urlencoded({extended: true}));

user_router.set('view engine', 'ejs');
user_router.set('views','./views');

// const multer = require('multer');
// const path = require("path");

user_router.use(express.static('public'));
const session = require('express-session');

const sessionSecretKey = process.env.SESSION_SECRET_KEY;

user_router.use(session({
    secret: sessionSecretKey,
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
  }));

const userController = require('../controller/userController');
const adminLoginAuth = require('../middleware/adminLoginAuth');


user_router.get('/login', adminLoginAuth.isLogout , userController.loginLoader );
user_router.post('/login', userController.verifyLogin );

user_router.get('/logout', adminLoginAuth.isLogin , userController.logout );

user_router.get('/profile', userController.profile);

user_router.get('/forget-password', adminLoginAuth.isLogout, userController.forgetLoad);

user_router.post('/forget-password', userController.forgetPasswordVerify);

user_router.get('/reset-password', adminLoginAuth.isLogout, userController.resetPasswordLoad);

user_router.post('/reset-password', userController.resetPassword);

module.exports = user_router;