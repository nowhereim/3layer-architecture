// repositories/posts.repository.js

const { CommenT } = require('../models');
const { Op}  = require("sequelize");
class CommentsRepository {

  //댓글 전체 조회
  findAllPost = async () => {
    const comments = await CommenT.findAll();

    return comments;
  };
  //댓글 수정 지정 조회
  findPostById = async (postId,CommentsId) => {
    const comment = await CommenT.findAll({
      where: {
        [Op.or]: [{postId,commentId:CommentsId}],
      },
    });
    return comment;
  };


  //댓글작성
  createComments = async (댓글,postId,key) => {
    const createCommentData = await CommenT.create({
      comment :댓글,
      postId :postId,
      key: key})

    return createCommentData;
  };


  //댓글수정
  updateComment = async (comment,commentId) => {
    const updateCommentData = await CommenT.update({comment:comment}, {where: {commentId}});
    

    return updateCommentData;
  };


  //댓글삭제
  deleteComments = async (commentId) => {
    await CommenT.destroy({ where: { commentId } });

    return;
  };
}

module.exports = CommentsRepository;