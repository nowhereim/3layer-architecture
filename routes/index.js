const express = require('express');
const Likes = require('./likes');
const Posts = require('./posts');
const Comments = require('./comments');
const Login = require('./login');
const SignUp = require('./signup');

const router = express.Router();

router.use('/posts/', Likes);
router.use('/posts/', Posts);
router.use('/comments/', Comments);
router.use('/login/', Login);
router.use('/signup/', SignUp);

module.exports = router;
