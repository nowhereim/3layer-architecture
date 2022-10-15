// controllers/posts.controller.js

const CommentsService = require('../services/comments.services');

class CommentsController {
    commentsService = new CommentsService();
getEditpage = async (req,res) => {
    res.render("editcomment")
}
//댓글수정 해당 댓글 조회
  getCommentsById = async (req, res, next) => {
    const  postId  = req.query.postId;
    const  commentId  = req.query.commentId;
    const comments = await this.commentsService.findPostById(postId,commentId);
    res.status(200).json(comments);
  };
//댓글작성
  createComments = async (req,res) => {
    const { 댓글,postId,key } = req.body;

  
    
    await this.commentsService.createComment(댓글,postId,key)
    
    res.status(200).send("작성 성공")
  }
//댓글 수정
  updateComments = async (req, res, next) => {
    const { comment,commentId } = req.body
    

    const updateComments = await this.commentsService.updateComment(comment,commentId);
    res.status(200).send(updateComments)
  };
//댓글 삭제기능
deleteComments = async (req, res, next) => {
    const {commentId} = req.body;
    await this.commentsService.deleteComments(commentId);

    res.status(200).send("삭제 성공")
  };
}

module.exports = CommentsController;