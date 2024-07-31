const express = require('express');
const router= express.Router();
const AuthController= require('../Auth/Auth.js');

router.post('/register',AuthController.SignUp);
router.post('/login',AuthController.login);

module.exports= router 