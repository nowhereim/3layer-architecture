const express = require("express")
const router = express.Router() 
const { User,CommenT,PosT } = require("../models");
const { Op}  = require("sequelize");
authmiddleware = require("../middlewares/auth-middleware")
//댓글 전체조회

const CommentsController = require('../controllers/comments.controllets');
const commentsController = new CommentsController();

router.delete("/", commentsController.deleteComments)
router.post("/", commentsController.createComments);
router.get('/get', commentsController.getCommentsById);
router.put('/', commentsController.updateComments);
router.get('/edit', commentsController.getEditpage);



module.exports = router;