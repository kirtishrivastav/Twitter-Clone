const User= require('../Models/User.model.js');
const Tweet= require('../Models/Tweet.model.js');
const path = require('path');

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'djeuwv94y', 
    api_key: '933733736115161',       
    api_secret: 'cKWDvHYL4LWadpEWR6xbYVrSDQc'   
});

exports.createTweet = async (req, res) => {
  try {
      const { content } = req.body;
      const tweetedBy = req.params.id;
      if (!content) {
          return res.status(400).json("content is required");
      }

      const tweetData = { 
          content,
          tweetedBy
      };

      if (req.file) {
          const result = await cloudinary.uploader.upload(req.file.path, {
              folder: 'tweets'
          });
          tweetData.image = result.secure_url;
      }

      const tweet = new Tweet(tweetData);
      await tweet.save();

      res.status(201).json(tweet);
  } catch (err) {
      console.log(err);
      res.status(500).json("internal server error");
  }
};

// like a tweet
exports.likeTweet = async (req, res) => {
    try {
      const tweet = await Tweet.findById(req.params.id);
      if (!tweet) {
        return res.status(404).json("Tweet not found" );
      }
  
      if (tweet.likes.includes(req.user.id)) {
        return res.status(400).json( "You have already liked this tweet");
      }
  
      tweet.likes.push(req.user.id);
      await tweet.save();
  
     return res.status(200).json(tweet);
    } catch (err) {
      res.status(500).json( "internal Server error");
    }
  };


//   dislike tweet 
exports.dislikeTweet = async (req, res) => {
    try {
      const tweet = await Tweet.findById(req.params.id);
      if (!tweet) {
        return res.status(404).json("Tweet not found" );
      }
  
      if (!tweet.likes.includes(req.user.id)) {
        return res.status(400).json( "You have not liked the tweet");
      }
  
      tweet.likes.pull(req.user.id);
      await tweet.save();
  
      res.status(200).json(tweet);
    } catch (err) {
      res.status(500).json( "internal Server error");
    }
  };

// delete tweet 
exports.deleteTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id).populate('tweetedBy');
   const userId=req.user.id;
    
    console.log("tweetedBy id",tweet.tweetedBy.id)
    console.log("user id", userId)

    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    
    if (tweet.tweetedBy._id.toString() !==  userId.toString()) {
      return res.status(403).json({ error: "You can only delete your own tweets" });
    }

    // If everything is fine, proceed with tweet deletion
    // await tweet.findByIdAndRemove(tweet.id);
    const deletedTweet=await tweet.deleteOne(tweet)
    return res.status(200).json({ message: "Tweet has been deleted",deletedTweet });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};


// reply on a tweeet
exports.replyOnTweet = async (req, res) => {
  try {
    const tweetId = req.params.id;
    const {content} = req.body;
    const tweetedBy = req.user.id;

    // Create a new reply tweet
    const newTweet = new Tweet({
      content,
      tweetedBy
    });

    // Save reply tweet in database
    await newTweet.save();

    // Find the parent tweet
    const parentTweet = await Tweet.findById(tweetId);

    // Check if parent tweet exists
    if (!parentTweet) {
      return res.status(404).json({ msg: "Parent tweet not found" });
    }

    // Add new tweet to parent tweet's replies
    parentTweet.replies.push(newTweet._id);
    await parentTweet.save();

    // Respond with the new reply tweet
    res.status(201).json(newTweet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

  // single tweet 
  exports.singleTweet= async(req,res)=>{
    try{

      const tweet= await Tweet.findById(req.params.id).
      populate('tweetedBy', '-password').
      populate('likes').
      populate('retweetBy').
      populate('replies');

      if(!tweet){
        
        return res.status(400).json("tweet not found");
      }
      res.json(tweet);


    }catch(err){
      console.log(err)
      res.status(500).json( {msg:"internal server error"})
    }
  };

  // retweet 
  exports.ReTweet= async(req,res)=>{
    try{
      const tweetId=req.params.id;
      const userId=req.user.id;

      // check if user already retweeted the tweet
            const tweet=await Tweet.findById(tweetId);
      if(tweet.retweetBy.includes(userId)){
        return res.status(400).json("user already retweeted");

      }
      // add user id to the retweetby array of the tweet 
      tweet.retweetBy.push(userId);
      await tweet.save();
      res.json(tweet);
    }catch(err){
      console.log(err);
      res.status(500).json("internal server error")
    }
  }

  exports.getAllTweets = async (req, res) => {
    try {
      // Fetch all tweets and populate the referenced fields
      const tweets = await Tweet.find()
        .populate({
          path: 'tweetedBy',
          select: '-password' // Exclude the password field
        })
        .populate({
          path: 'likes',
          select: '-password' // Exclude the password field
        })
        .populate({
          path: 'retweetBy',
          select: '-password' // Exclude the password field
        })
        .populate({
          path: 'replies',
          populate: {
            path: 'tweetedBy',
            select: '-password' // Exclude the password field in replies
          }
        })
        .sort({ createdAt: -1 }); // Sort by createdAt in descending order
  
      res.status(200).json(tweets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Controller to get all tweets by a single user

exports.getTweetsByUser = async (req, res) => {
  const userId = req.params.userId;

  console.log(`Fetching tweets for userId: ${userId}`);

  try {
    // Find all tweets where tweetedBy matches userId
    const tweets = await Tweet.find({ tweetedBy: userId })
      .populate('tweetedBy', '_id email')
      .populate('likes', '_id username')
      .populate('retweetBy', '_id username')
      .populate('replies', '_id content');

    if (!tweets || tweets.length === 0) {
      console.log(`No tweets found for userId: ${userId}`);
      return res.status(404).json({ error: 'Tweets not found for this user' });
    }

    console.log(`Found ${tweets.length} tweets for userId: ${userId}`);
    res.json(tweets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

  
