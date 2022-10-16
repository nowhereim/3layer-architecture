const express = require('express');
const { Likes, Posts, sequelize, Sequelize } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router
  .route('/like')
  // 좋아요 게시글 조회
  .get(authMiddleware, async (req, res) => {
    try {
      const { userId } = res.locals.user;

      let userLikes = await Likes.findAll({
        where: { userId },
      });

      let likePostIdArray = getLikePostIdByLikes(userLikes);

      const postsQuery = `
                SELECT p.postId, u.userId, u.nickname, p.title, p.createdAt, p.updatedAt
                FROM Posts AS p
                JOIN Users AS u
                ON p.userId = u.userId
                ORDER BY p.postId DESC`;

      let posts = await sequelize
        .query(postsQuery, {
          type: Sequelize.QueryTypes.SELECT,
        })
        .then((posts) => getPostsByPostIdArray(likePostIdArray, posts));

      const likes = await Likes.findAll();

      posts = posts.map((post) => {
        return {
          ...post,
          likes: likes.filter((like) => like.postId === post.postId).length,
        };
      });

      posts.sort((a, b) => b.createdAt - a.createdAt);
      posts.sort((a, b) => b.likes - a.likes);

      return res.status(200).json({
        data: posts,
      });
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      return res.status(400).json({
        errorMessage: '좋아요 게시글 조회에 실패하였습니다.',
      });
    }
  });

router
  .route('/:postId/like')
  // 좋아요 업데이트
  .put(authMiddleware, async (req, res) => {
    try {
      const { postId } = req.params;
      const { userId } = res.locals.user;

      const isExist = await Posts.findByPk(postId);

      if (!isExist) {
        return res.status(404).json({
          errorMessage: '게시글이 존재하지 않습니다.',
        });
      }

      let isLike = await Likes.findOne({
        where: { postId, userId },
      });

      if (!isLike) {
        await Likes.create({ postId, userId });

        return res
          .status(200)
          .json({ message: '게시글의 좋아요를 등록하였습니다.' });
      } else {
        await Likes.destroy({
          where: { postId, userId },
        });

        return res
          .status(200)
          .json({ message: '게시글의 좋아요를 취소하였습니다.' });
      }
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      return res.status(400).json({
        errorMessage: '게시글 좋아요에 실패하였습니다.',
      });
    }
  });

function getLikePostIdByLikes(likes) {
  let likePostIdArray = [];
  for (const like of likes) {
    likePostIdArray.push(like.postId);
  }

  return likePostIdArray;
}

function getPostsByPostIdArray(postIdArray, posts) {
  return posts.filter((post) => {
    return postIdArray.includes(post.postId);
  });
}

module.exports = router;
