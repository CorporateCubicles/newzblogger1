const User = require('../model/userModel');
const bcrypt = require('bcrypt');

const loginLoader = async(req, res)=>{
    try {    
        res.render('login');
    } catch (error) {
        console.log(error.message); 
    }
}

const profile = async(req, res)=>{
    try {    
        res.send('I am in profile');
    } catch (error) {
        console.log(error.message); 
    }
}

const logout = async(req, res)=>{
    try {    
        req.session.destroy();
        res.redirect('/login');
    } catch (error) {
        console.log(error.message); 
    }
}

const verifyLogin = async(req, res)=>{
    try {
        console.log(req.body.email);
        const email = req.body.email;
        const password = req.body.password;

         const userData = await User.findOne({email: email});

         if(userData){
            console.log(userData);
            const passwordMatch = bcrypt.compare(password, userData.password);
            req.session.user_id = userData._id;
            req.session.is_admin = userData.is_admin;
            if(passwordMatch){
                if(userData.is_admin == 1){
                    res.redirect('/dashboard');
                }else{
                    res.redirect('/profile');
                }

            }
            else{
                res.render('login', {message: "Incorrect password!!"});

            }

         }
         else{
            res.render('login', {message: "Email-id doesnot exist"});
         }
        
    } catch (error) {
        console.log(error.message);        
    }
}

module.exports = {
    loginLoader,
    verifyLogin,
    profile,
    logout
}