const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');
require('dotenv').config();
emailUser = process.env.EMAILUSER;
emailPassword = process.env.EMAILPASSWORD;

const adminController = require('../controller/adminController');


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

const forgetLoad = (req, res)=>{
    try{

        res.render('forget-password');

    }catch(error){
        console.log(error);
    }
}

const forgetPasswordVerify = async(req, res)=>{
    try{
        const email = req.body.email;
        const userData =  await User.findOne({email: email });

        if(userData){

           const generatedToken  = randomstring.generate();

           await User.updateOne({email:email}, {$set:{token: generatedToken }});

           sendResetPasswordMail(userData.name, userData.email, generatedToken );

           res.render('forget-password',{message: "Please check your mail to Reset Your Password!!"});

        }
        else{
            res.render('forget-password',{message:"User email doesnot exists or entered email is incorrect"});
        }
        
    }catch(error){
        console.log(error.message);
    }
}

const sendResetPasswordMail = async(name, email, token)=>{
    try{
        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for port 465, false for other ports,
            requireTLS: true,
            auth: {
              user: emailUser,
              pass: emailPassword,
            },
          });

          const mailOptions = {
            from: emailUser,
            to: email,
            subject: 'Reset Password',
            html:'<p> Hii '+name+', Please click here to <a href="http://127.0.0.1:3050/reset-password?token='+token+'">Reset</a> your Password'
          }

          transport.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
            }
            else{
                console.log("Email has been sent", info.response);
            }
          });
    }catch(error){
        console.log(error.message);
    }
}

const resetPasswordLoad = async(req, res)=>{
    try{
        const token = req.query.token;
        const tokenBasedData =  await User.findOne({token: token});

        if(tokenBasedData){
            res.render('reset-password', {user_id: tokenBasedData._id });

        }
        else{
            res.render('404');
        }

    }catch(error){

        console.log(error.message);
    }
}

const resetPassword = async(req, res)=>{
    try{
        const password = req.body.password;
        const user_id = req.body.user_id;
        const securePassword = await adminController.securePassword(password);
        User.findByIdAndUpdate({_id: user_id }, {$set: {password: securePassword, token: ''}});

        res.redirect('/login');

    }catch(error)
    {

        res.render('404');

    }
}

module.exports = {
    loginLoader,
    verifyLogin,
    profile,
    logout,
    forgetLoad,
    forgetPasswordVerify,
    resetPasswordLoad,
    resetPassword

}