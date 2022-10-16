const express = require('express');
const router = express.Router();

const SignupController = require('../controllers/signup')
const signupController = new SignupController()

// 회원가입 API
router.post("/",signupController.postSignup)    

module.exports = router;