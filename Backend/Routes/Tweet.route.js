const express=require('express');

const router= express.Router();
const {jwtAuthMiddleWare}=require('../Middlewares/AuthMiddleware.js')

const  tweetController  = require('../Controllers/Tweet.controller.js');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


  router.post('/:id', jwtAuthMiddleWare, upload.single('image'),tweetController. createTweet);

  router.post('/:id/like',jwtAuthMiddleWare,tweetController.likeTweet)

  router.post('/:id/dislike',jwtAuthMiddleWare,tweetController.dislikeTweet)

  router.post('/:id/reply',jwtAuthMiddleWare,tweetController.replyOnTweet)

  router.get('/:id',jwtAuthMiddleWare,tweetController.singleTweet)

  router.delete('/delete/:id',jwtAuthMiddleWare,tweetController.deleteTweet)
  
  router.post('/:id/retweet',jwtAuthMiddleWare,tweetController.ReTweet)

  router.get('/',jwtAuthMiddleWare,tweetController.getAllTweets)

  router.get('/allTweets/:userId',jwtAuthMiddleWare,tweetController.getTweetsByUser)


  module.exports= router;