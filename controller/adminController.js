
const BlogSetting = require('../model/blogModel');  // Renamed to avoid conflict
const User = require('../model/userModel');  // Renamed to avoid conflict
const Post = require("../model/postModel");
const bcrypt = require('bcrypt');

const securePassword = async(password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error.message);
        throw new Error('Password hashing failed');  // Throw error to handle it properly
    }
}

const blogSetUp = async(req, res) => {
    try {
        const blogs = await BlogSetting.find({});

        if (blogs.length > 0) {
            res.redirect('/login');
        } else {
            res.render('blogSetup');
        }
    } catch (error) {
        console.error('Error fetching blogs:', error.message);
        res.status(500).send('Internal Server Error');
    }
}

const dashboard = async(req, res)=>{
    try {    
        res.render('admin/dashboard')
    } catch (error) {
        console.log(error.message); 
    }
}



const loadPostdashboard = async(req, res)=>{
    try {    
       res.render('admin/postDashboard');
    } catch (error) {
        console.log(error.message); 
    }
}

const addPost = async(req, res)=>{
    try {    

        const newPost = new Post({
            title: req.body.title,
            content : req.body.content
        });

        const postData = await newPost.save();

        res.render('admin/postDashboard', {message: 'Post added Successfully'});

    } catch (error) {
        console.log(error.message); 
    }
}



const blogSetUpSave = async(req, res)=>{
    try{
        console.log('File Info:', req.file); 

        const blog_title = req.body.blog_title;
        const blog_image =  req.file.filename;
        const description = req.body.description;
        const name = req.body.name;
        const email = req.body.email;
        const password = await securePassword(req.body.password);

        const newBlog = new BlogSetting({
            blog_title:blog_title,
            blog_image:blog_image,
            blog_description: description

        });
        // Save the blog to the database
        const savedBlog = await newBlog.save();
        console.log('Blog saved:', savedBlog);

        const newUser = new User({
            name: name,
            email: email,
            password: password,
            is_admin: 1
        });
        // Save the user to the database
        const savedUser = await newUser.save();
        console.log('User saved:', savedUser);

        if(savedUser){
            res.redirect('/login');
        }
        else{
            res.render('blogSetup',{message:'Blog setup has some problem'});
        }

    }catch(error){
        console.log(error.message);
    }
}

 // const blogSetUpSave = async (req, res) => {
//     try {
//         //    Check if file is available
//         // console.log('File Info:', req.file); 

//         // Destructure fields from request body
//         const { blog_title, description, name, email, password } = req.body;
//         const blog_image = req.file ? req.file.filename : null;

//         // Ensure the blog image is provided
//         if (!blog_image) {
//             return res.render('blogSetup', { message: 'Blog image is required' });
//         }

//         // Hash the password
//         const hashedPassword = await securePassword(password);

//         // Create a new blog instance with the correct field names
//         const newBlog = new BlogSetting({
//             blog_title,
//             blog_description: description,  // Map 'description' to 'blog_description'
//             blog_image
//         });

//         // Save the blog to the database
//         const savedBlog = await newBlog.save();
//         // console.log('Blog saved:', savedBlog);

//         // Create a new user instance
//         const newUser = new User({
//             name,
//             email,
//             password: hashedPassword,
//             is_admin: 1
//         });

//         // Save the user to the database
//         const savedUser = await newUser.save();
//         // console.log('User saved:', savedUser);

//         // Redirect or render based on success
//         if (savedUser) {
//             res.redirect('/login');
//         } else {
//             res.render('blogSetup', { message: 'Blog setup has some problem' });
//         }
//     } catch (error) {
//         console.error('Error in blog setup save:', error.message);
//         res.status(500).render('blogSetup', { message: 'An error occurred during setup' });
//     }
// }


module.exports = {
    blogSetUpSave,
    blogSetUp,
    dashboard,
    loadPostdashboard,
    addPost

}
