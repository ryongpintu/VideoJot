const express= require('express');
const {User}=require('../models/users');
const bcrypt=require('bcryptjs');
const passport=require('passport')
const router=express.Router();




router.get('/login',(req,res)=>{
  res.render('users/login')
});


router.get('/register',(req,res)=>{
  res.render('users/register')
});

router.post('/login',(req,res,next)=>{
  passport.authenticate('local',{
    successRedirect:'/ideas',
    failureRedirect:'/users/login',
    failureFlash:true
  })(req,res,next);
})

router.post('/register',(req,res)=>{
  let errors=[];
  if(req.body.password != req.body.confpassword ){
    errors.push({texts:'Password do not match'})
  }
  if(req.body.password.length<4){
    errors.push({texts:'Password length must be atleast 5'})
  }

  if(errors.length>0){
    res.render('users/register',{
      errors:errors,
      name:req.body.name,
      email:req.body.email,
      password:req.body.password,
      confpassword:req.body.confpassword
    });
  }else{
    User.findOne({email:req.body.email})
        .then(user=>{
        if(user){
          req.flash('error_msg','User already registerd');
          
          res.redirect('/users/register');
        }else{
          const newUser={
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
          }
          console.log(newUser)
          bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(newUser.password,salt,(err,hash)=>{
              if(err) throw err;
              newUser.password=hash;
              new User(newUser)
              .save()
              .then((user)=>{
                req.flash('success_msg','Uor are now registerd');
                console.log(newUser)
                res.redirect('/users/login');
                console.log(newUser)
              })
              .catch((err)=>{
                console.log(err);
                return;
              })
             
            });
          })
      

        }
      })
    
   
    
  }

  
});

router.get('/logout',(req,res)=>{
  req.logout()
  req.flash('success_msg','you are logout');
  res.redirect('/users/login');
})
module.exports=router