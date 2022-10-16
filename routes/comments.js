const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
Commentscontroller = require("../controllers/comments")
commentscontroller = new Commentscontroller();

router.post("/:postId",authMiddleware,commentscontroller.createComment)
router.get("/:postId",authMiddleware,commentscontroller.Commentlist)
router.put("/:commentId",authMiddleware,commentscontroller.Commentedit)
router.delete("/:commentId",authMiddleware,commentscontroller.Commentdelete)

module.exports = router;
