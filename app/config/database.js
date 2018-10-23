if(process.env.NODE_ENV === 'production'){
  module.exports={mongoURI:'mongodb://ryong:pintu123@ds139193.mlab.com:39193/videojot'}
}else{
  module.exports={mongoURI:'mongodb://localhost/video_jot'}
}