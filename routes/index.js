const express = require('express');
const Likes = require('./likes');
const Posts = require('./posts');
const Comments = require('./comments');
const Login = require('./login');
const SignUp = require('./signup');
const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 유저 추가 수정 삭제 조회
 */


router.use('/posts/', Likes);
router.use('/posts/', Posts);
router.use('/comments/', Comments);
router.use('/login/', Login);
router.use('/signup/', SignUp);

module.exports = router;
