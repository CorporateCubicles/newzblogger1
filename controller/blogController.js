const Post = require('../model/postModel')


const loadBlogs = async(req, res) =>{
    try{

        const posts = await Post.find({});
        res.render('blog', {posts: posts});

    } catch(error){
        console.log(error.message);

    }
}

const loadPost = async(req, res) =>{
    try{

      const post =  await Post.findOne({"_id":req.params.id});

      res.render('post',{post:post});

    }catch(error){
        console.log(error.message);
    }
}

module.exports = {
    loadBlogs,
    loadPost
}