const User= require('../Models/User.model.js');
const Tweet= require('../Models/Tweet.model.js');
const cloudinary = require('cloudinary').v2;
// cloud config
cloudinary.config({
  cloud_name: 'djeuwv94y', 
  api_key: '933733736115161',        
  api_secret: 'cKWDvHYL4LWadpEWR6xbYVrSDQc'   
});

// getting single user details 
exports.GetUser= async(req,res)=>{
    const {id:userId}= req.params;
    try{
       const user=  await User.findById(userId).select('-password') // Excluding password from the response
       .populate('followers', '-password') // Excluding password of followers
       .populate('following', '-password'); // Excluding password of following

       if(!user){
         return res.status(404).json("user not found")
       }
       res.status(200).json(user);
       
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// follow user api 
exports.follow = async(req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);

        const currentUser = await User.findById(req.body.userId);

        if (!user.followers.includes(req.body.userId)) {
          await user.updateOne({ $push: { followers: req.body.userId } });
          await currentUser.updateOne({ $push: { following: req.params.id } });

          res.status(200).json("user has been followed");
        } else {
          res.status(403).json("you allready follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant follow yourself");
    }
  };

// unfollow api
  exports.unfollow= async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentUser.updateOne({ $pull: { followings: req.params.id } });
          res.status(200).json("user has been unfollowed");
        } else {
          res.status(403).json("you dont follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant unfollow yourself");
    }
  };

  // edit user details 
  exports.editUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const { name, dateOfBirth, location } = req.body;
  
      // Require all the fields
      // if (!name || !dateOfBirth || !location) {
      //   return res.status(400).json({ message: "All fields are required" });
      // }
  
      // Find the user with the given ID in params
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Update fields if provided
      if (name) {
        user.name = name;
      }
      if (dateOfBirth) {
        user.dateOfBirth = dateOfBirth;
      }
      if (location) {
        user.location = location;
      }
  
      // Save the updated user
      await user.save();
  
      // Return success response
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // get user tweets 
  exports.Usertweet = async (req, res) => {
    try {
      const userId = req.params.id;
      const tweets = await Tweet.find({ tweetedBy: userId });
  
      if (!tweets || tweets.length === 0) {
        return res.status(400).json("no tweets by this user");
      }
  
      res.status(200).json(tweets);
    } catch (error) {
      console.log(error);
      res.status(500).json("internal server error");
    }
  };
  

// upload profile picture 
exports.uploadPicture = async (req, res) => {
  const userId = req.params.id;
  try {
    // Get the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    // Upload profile picture to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'profile_pictures' //a folder in Cloudinary
    });

    
    user.profilePicture = result.secure_url;
    await user.save();

    res.status(200).json({ message: 'Profile picture uploaded!', profilePicture: user.profilePicture });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


