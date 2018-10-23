const express = require('express');
const path= require('path');
const app= express();
const passport= require('passport')
const session= require('express-session');
const flash= require('connect-flash');
const methodOverride= require('method-override');
const exphbs=require('express-handlebars');
const mongoose= require('mongoose');
const db= require('./config/database');
const ideas= require('./routes/ideas');
const users=require('./routes/users');
const bodyParser = require('body-parser');
mongoose.connect(db.mongoURI,{useNewUrlParser:true})
  .then(()=>console.log('connect to the db'))
  .catch((err)=>console.log('error in connection'));
  require('./config/passport')(passport)
app.engine('handlebars',exphbs({
  defaultLayout:'main'
}));
app.set('view engine','handlebars');

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(methodOverride('_method'));

//Express session middleware

app.use(session({
  secret:'secret',
  resave:true,
  saveUninitialized:true,
  
}));

// ****its important to keep thi here before exprss session

app.use(passport.initialize());
  app.use(passport.session());
app.use(flash());

//Set Global variables
app.use((req,res,next)=>{
  res.locals.success_msg=req.flash('success_msg');
  res.locals.error_msg=req.flash('error_msg');
  res.locals.error=req.flash('error');
  res.locals.user=req.user || null;
  next();
});

app.use('/ideas',ideas);
app.use('/users',users);


app.use(express.static(path.join(__dirname,'public')));
app.get('/',(req,res)=>{
  res.render('index',{
    title:'Welcome'
  });
})
app.get('/about',(req,res)=>{
  res.render('about');
});

const port =process.env.PORT || 8000;
app.listen(port,()=>{
  console.log(`Server Listening to port ${port}`);
});