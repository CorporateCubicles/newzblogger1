const blogSetting = require('../model/blogModel');


const isBlogExistorNot = async(req, res, next)=>{
    try{
        const blogs = await blogSetting.find({});
        if(blogs.length == 0 && req.originalUrl != "/blog-setup"){

            res.redirect('/blog-setup');
        }
        else{
            next();
        }

    }catch(error){
        console.log(error.message);
    }
}

module.exports = { isBlogExistorNot };