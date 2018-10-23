const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  user:{
    type:String,
    required:true
  },
  date:{
    type:Date,
    default:Date.now()
  
  }
});

const Idea = mongoose.model('idea',ideaSchema);

module.exports.Idea=Idea;