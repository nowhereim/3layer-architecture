const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const PostsController = require("../controllers/posts")
const postsController = new PostsController();

router.get('/', authMiddleware, postsController.getPosts);
router.get('/:postId', authMiddleware, postsController.getPostById);
router.post('/', authMiddleware, postsController.createPost);
router.put('/:postId', authMiddleware, postsController.updatePost);
router.delete('/:postId', authMiddleware, postsController.deletePost);

module.exports = router;
