const express = require('express');
const { Comments, sequelize, Sequelize } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');
const authUserMiddleware = require('../middlewares/authUserMiddleware');
const Joi = require('joi');

const router = express.Router();

const RE_COMMENT = /^[\s\S]{1,100}$/; // 댓글 정규 표현식

const commentSchema = Joi.object({
  comment: Joi.string().pattern(RE_COMMENT).required(),
});

router
  .route('/:postId')
  //댓글 목록 조회
  .get(authUserMiddleware, async (req, res) => {
    try {
      const { postId } = req.params;

      const commentsQuery = `
                SELECT c.commentId, c.userId, u.nickname, c.comment, c.createdAt, c.updatedAt
                FROM Comments AS c
                JOIN Users AS u
                ON c.userId = u.userId 
                WHERE c.postId = ${postId}`;

      const comments = await sequelize.query(commentsQuery, {
        type: Sequelize.QueryTypes.SELECT,
      });

      comments.sort((a, b) => b.createdAt - a.createdAt);

      return res.status(200).json({ data: comments });
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      return res.status(400).json({
        errorMessage: '댓글 조회에 실패하였습니다.',
      });
    }
  })
  //댓글 생성
  .post(authMiddleware, async (req, res) => {
    try {
      const resultSchema = commentSchema.validate(req.body);
      if (resultSchema.error) {
        return res.status(412).json({
          errorMessage: '데이터 형식이 올바르지 않습니다.',
        });
      }

      const { postId } = req.params;
      const { comment } = resultSchema.value;
      const { userId } = res.locals.user;

      await Comments.create({ postId, userId, comment });
      return res.status(201).json({ message: '댓글을 작성하였습니다.' });
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      return res.status(400).json({
        errorMessage: '댓글 작성에 실패하였습니다.',
      });
    }
  });

router
  .route('/:commentId')
  // 댓글 수정
  .put(authMiddleware, async (req, res) => {
    try {
      const resultSchema = commentSchema.validate(req.body);
      if (resultSchema.error) {
        return res.status(412).json({
          errorMessage: '데이터 형식이 올바르지 않습니다.',
        });
      }

      const { commentId } = req.params;
      const { comment } = resultSchema.value;
      const { userId } = res.locals.user;

      const isExist = await Comments.findByPk(commentId);
      if (!isExist) {
        return res.status(404).json({
          errorMessage: '댓글이 존재하지 않습니다.',
        });
      }

      const updateCount = await Comments.update(
        { comment },
        { where: { commentId, userId } }
      );

      if (updateCount < 1) {
        return res.status(400).json({
          errorMessage: '댓글 수정이 정상적으로 처리되지 않았습니다.',
        });
      }

      return res.status(200).json({ message: '댓글을 수정하였습니다.' });
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      return res.status(400).json({
        errorMessage: '댓글 수정에 실패하였습니다.',
      });
    }
  })
  // 댓글 삭제
  .delete(authMiddleware, async (req, res) => {
    try {
      const { commentId } = req.params;
      const { userId } = res.locals.user;

      const isExist = await Comments.findByPk(commentId);
      if (!isExist) {
        return res.status(404).json({
          errorMessage: '댓글이 존재하지 않습니다.',
        });
      }

      const deleteCount = await Comments.destroy({
        where: { commentId, userId },
      });

      if (deleteCount < 1) {
        return res.status(400).json({
          errorMessage: '댓글 삭제가 정상적으로 처리되지 않았습니다.',
        });
      }

      return res.status(200).json({ message: '댓글을 삭제하였습니다.' });
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      return res.status(400).json({
        errorMessage: '댓글 삭제에 실패하였습니다.',
      });
    }
  });

module.exports = router;
