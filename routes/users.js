const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');


router.get('/register',(req,res)=>{
    res.render('user/register');
});

router.get('/login',(req,res)=>{
    res.render('user/login');
});

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success','Logged Out');
    res.redirect('/forums');
});

router.post('/register', catchAsync(async(req,res)=>{
    try{
        const { email, username, password }= req.body;
        const user = new User({email,username});
        const registeredUser=await User.register(user,password);
        req.login(registeredUser,err=>{
            if(err)return next(err);
            req.flash('success','Account Successfully Created');
            res.redirect('/forums');
        });
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
}));

router.post('/login',passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','Welcome Back!');
    const redirectUrl= req.session.returnTo || '/forums';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

module.exports = router;