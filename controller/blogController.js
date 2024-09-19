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

const addComment = async(req, res)=>{
    try{

       const post_id=  req.body.post_id;
       const  username= req.body.username;
        const comment =  req.body.comment;
       
        await Post.findByIdAndUpdate({_id:post_id }, { $push:{ "comment": {username:username,  comment: comment}}});


        res.status(200).send({success:true, msg:'Comment Added!!!'});
    }
    catch(error){
        res.status(200).send({success:false, msg:error.message})
    }
}
module.exports = {
    loadBlogs,
    loadPost,
    addComment
}