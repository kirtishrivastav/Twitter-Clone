const express=require('express');
const router= express.Router();
const userController=require('../Controllers/User.controller.js');
const {jwtAuthMiddleWare} =require('../Middlewares/AuthMiddleware.js');
// const upload = require('../Middlewares/uploadMiddlewar.js');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });



router.post('/:id/uploadProfilePic',jwtAuthMiddleWare,upload.single('profilePicture'),userController.uploadPicture);

router.get('/:id', jwtAuthMiddleWare, userController.GetUser);
router.post('/:id/follow', jwtAuthMiddleWare,userController.follow);
router.post('/:id/unfollow', jwtAuthMiddleWare,userController.unfollow);
router.put('/:id/', jwtAuthMiddleWare,userController.editUser);
router.post('/:id/tweets', jwtAuthMiddleWare,userController.Usertweet);




module.exports= router;


