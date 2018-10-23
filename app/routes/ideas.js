const express= require('express');
const {Idea}=require('../models/Ideas');
const router=express.Router();
const {ensureAuthenticated} = require('../helpers/auth');


router.get('/',ensureAuthenticated,(req,res)=>{
  Idea.find({user:req.user.id})
    .sort({date:'desc'})
    .then(ideas=>{
      res.render('ideas/index',{
        ideas:ideas
      })
    })
 
})


router.get('/add',ensureAuthenticated,(req,res)=>{
  res.render('ideas/add');
});

router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
  Idea.findOne({
    _id:req.params.id
  })
  .then(idea=>{
    if(idea.user!=req.user.id){
        req.flash('error_msg','Not Authorized');
        res.redirect('/ideas')
    }else{
      res.render('ideas/edit',{idea:idea});

    }
   
  });
 
});

router.post('/',ensureAuthenticated,(req,res)=>{
  let errors=[];

  if(!req.body.title){
    errors.push({texts:'Please enter title'})
  }
  if(!req.body.description){
    errors.push({texts:'Please enter details'})
  }


  if(errors.length>0){
    res.render('ideas/add',{
      errors:errors,
      title:req.body.title,
      description:req.body.description
    })
  }else{
    const newUser={
      title:req.body.title,
      description:req.body.description,
      user:req.user.id
      
    }
    new Idea(newUser)
      .save()
      .then((idea)=>{
        req.flash('success_msg','Video idea added');
        res.redirect('/ideas');
      });
  }
});

router.put('/:id',ensureAuthenticated,(req,res)=>{
  Idea.findOne({
    _id:req.params.id
  })
  .then((idea)=>{
      idea.title=req.body.title;
      idea.description=req.body.description;

      idea.save()
        .then(()=>{
          req.flash('success_msg','Video idea updated');
          res.redirect('/ideas');
        })
     
  });
});

router.delete('/:id',ensureAuthenticated,(req,res)=>{
  Idea.deleteOne({
    _id:req.params.id
  }).then((idea)=>{

    req.flash('success_msg','Video idea removed');
    res.redirect('/ideas');

  }).catch((err)=>{console.log(err)})
      
});

module.exports =router;