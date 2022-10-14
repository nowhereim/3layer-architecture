// repositories/posts.repository.js

const { Posts } = require('../models');

class PostRepository {
  findAllPost = async () => {
    const posts = await Posts.findAll();

    return posts;
  };

  findPostById = async (postId) => {
    const post = await Posts.findByPk(postId);

    return post;
  };

  createPost = async (nickname, password, title, content) => {
    const createPostData = await Posts.create({
      nickname,
      password,
      title,
      content,
    });

    return createPostData;
  };

  updatePost = async (postId, password, title, content) => {
    const updatePostData = await Posts.update(
      { title, content },
      { where: { postId, password } }
    );

    return updatePostData;
  };

  deletePost = async (postId, password) => {
    const updatePostData = await Posts.destroy({ where: { postId, password } });

    return updatePostData;
  };
}

module.exports = PostRepository;