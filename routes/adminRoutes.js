const express = require('express');
const admin_router = express();

const bodyParser = require('body-parser');
admin_router.use(bodyParser.json());
admin_router.use(bodyParser.urlencoded({extended: true}));

admin_router.set('view engine', 'ejs');
admin_router.set('views','./views');

const multer = require('multer');
const path = require("path");
admin_router.use(express.static('public'));

admin_router.use(express.static('public'));

const session = require('express-session');
const sessionSecretKey = process.env.SESSION_SECRET_KEY;
admin_router.use(session({
    secret: sessionSecretKey,
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
  }));


const storage = multer.diskStorage({
  
    destination: function (req, file, cb) {

      const uploadPath = path.join(__dirname, '../public/images');
      console.log('Resolved upload path',uploadPath);
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const name = Date.now() + '-' + file.originalname;
      cb(null, name);
    }
  });
  
  const upload = multer({ storage: storage });

const adminController = require("../controller/adminController");

const adminLoginAuth = require('../middleware/adminLoginAuth');


admin_router.get('/blog-setup', adminController.blogSetUp);

admin_router.post('/blog-setup', upload.single('blog_image'),adminController.blogSetUpSave);

admin_router.get('/dashboard', adminLoginAuth.isLogin ,adminController.dashboard);

admin_router.get('/create-post', adminLoginAuth.isLogin ,adminController.loadPostdashboard);

admin_router.post('/create-post', adminLoginAuth.isLogin ,adminController.addPost);


module.exports = admin_router;