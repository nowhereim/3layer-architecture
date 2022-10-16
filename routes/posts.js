const express = require('express');
const {
  Posts,
  Comments,
  Likes,
  sequelize,
  Sequelize,
  Users,
} = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');
const Joi = require('joi');
const { Op } = require('sequelize');

const router = express.Router();
const postSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});

const RE_TITLE = /^[a-zA-Z0-9\s\S]{1,40}$/; //게시글 제목 정규 표현식
const RE_HTML_ERROR = /<[\s\S]*?>/; // 게시글 HTML 에러 정규 표현식
const RE_CONTENT = /^[\s\S]{1,3000}$/; // 게시글 내용 정규 표현식

router
  .route('/')
  // 모든 게시글 데이터를 반환하는 함수
  .get(async (req, res) => {
    try {
      const likes = await Likes.findAll();

      const postsQuery = `
                SELECT p.postId, u.userId, u.nickname, p.title, p.createdAt, p.updatedAt
                FROM Posts AS p
                JOIN Users AS u
                ON p.userId = u.userId
                ORDER BY p.postId DESC`;

      let posts = await sequelize.query(postsQuery, {
        type: Sequelize.QueryTypes.SELECT,
      });
      posts = posts.map((post) => {
        return {
          ...post,
          likes: likes.filter((like) => like.postId === post.postId).length,
        };
      });
      posts.sort((a, b) => b.createdAt - a.createdAt);

      return res.status(200).json({ data: posts });
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      return res.status(400).json({
        errorMessage: '게시글 조회에 실패하였습니다.',
      });
    }
  })

  //개시글 생성
  .post(authMiddleware, async (req, res) => {
    try {
      const resultSchema = postSchema.validate(req.body);
      if (resultSchema.error) {
        return res.status(412).json({
          errorMessage: '데이터 형식이 올바르지 않습니다.',
        });
      }

      const { title, content } = resultSchema.value;
      const { userId } = res.locals.user;

      if (
        !isRegexValidation(title, RE_TITLE) ||
        isRegexValidation(title, RE_HTML_ERROR)
      ) {
        return res.status(412).json({
          errorMessage: '게시글 제목의 형식이 일치하지 않습니다.',
        });
      }
      if (!isRegexValidation(content, RE_CONTENT)) {
        return res.status(412).json({
          errorMessage: '게시글 내용의 형식이 일치하지 않습니다.',
        });
      }

      await Posts.create({ userId, title, content });
      return res.status(201).json({ message: '게시글 작성에 성공하였습니다.' });
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      return res.status(400).json({
        errorMessage: '게시글 작성에 실패하였습니다.',
      });
    }
  });

router
  .route('/:postId')
  // 게시글 상세 조회
  .get(async (req, res) => {
    try {
      const { postId } = req.params;

      const likes = await Likes.findAll({
        where: {
          [Op.and]: [{ postId }],
        },
      });

      const postQuery = `
                SELECT p.postId, u.userId, u.nickname, p.title, p.content, p.createdAt, p.updatedAt
                FROM Posts AS p
                JOIN Users AS u
                ON p.userId = u.userId
                WHERE p.postId = ${postId}
                ORDER BY p.postId DESC
                LIMIT 1`;

      const post = await sequelize
        .query(postQuery, {
          type: Sequelize.QueryTypes.SELECT,
        })
        .then((posts) => {
          const post = posts[0];

          return {
            ...post,
            likes: likes.filter((like) => like.postId === post.postId).length,
          };
        });

      const comments = await Comments.findAll({
        where: {
          [Op.and]: [{ postId }],
        },
      });
      return res.status(200).json({
        data: {
          ...post,
          comments,
        },
      });
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      return res.status(400).json({
        errorMessage: '게시글 조회에 실패하였습니다.',
      });
    }
  })

  //게시글 수정
  .put(authMiddleware, async (req, res) => {
    try {
      const resultSchema = postSchema.validate(req.body);
      if (resultSchema.error) {
        return res.status(412).json({
          errorMessage: '데이터 형식이 올바르지 않습니다.',
        });
      }

      const { postId } = req.params;
      const { title, content } = resultSchema.value;
      const { userId } = res.locals.user;

      if (
        !isRegexValidation(title, RE_TITLE) ||
        isRegexValidation(title, RE_HTML_ERROR)
      ) {
        return res.status(412).json({
          errorMessage: '게시글 제목의 형식이 일치하지 않습니다.',
        });
      }
      if (!isRegexValidation(content, RE_CONTENT)) {
        return res.status(412).json({
          errorMessage: '게시글 내용의 형식이 일치하지 않습니다.',
        });
      }

      const updateCount = await Posts.update(
        { title, content },
        { where: { postId, userId } }
      );

      if (updateCount < 1) {
        return res.status(401).json({
          errorMessage: '게시글이 정상적으로 수정되지 않았습니다.',
        });
      }
      return res.status(200).json({ message: '게시글을 수정하였습니다.' });
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      return res.status(400).json({
        errorMessage: '게시글 수정에 실패하였습니다.',
      });
    }
  })

  // 게시글 삭제
  .delete(authMiddleware, async (req, res) => {
    try {
      const { postId } = req.params;
      const { userId } = res.locals.user;

      const post = await Posts.findByPk(postId);
      if (!post) {
        return res.status(404).json({
          errorMessage: '게시글이 존재하지 않습니다.',
        });
      }

      const deleteCount = await Posts.destroy({ where: { postId, userId } });

      if (deleteCount < 1) {
        return res.status(401).json({
          errorMessage: '게시글이 정상적으로 삭제되지 않았습니다.',
        });
      }

      return res.status(201).json({ message: '게시글을 삭제하였습니다.' });
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      return res.status(400).json({
        errorMessage: '게시글 삭제에 실패하였습니다.',
      });
    }
  });

function isRegexValidation(target, regex) {
  return target.search(regex) !== -1;
}

module.exports = router;
