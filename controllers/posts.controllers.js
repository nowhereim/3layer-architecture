// controllers/posts.controller.js

const PostService = require('../services/posts.services');

class PostsController {
  postService = new PostService();

detailPage = async (req, res, next) => {
  res.render("detail")
  };

  detailPost = async (req,res,next) => {
    const { postId } = req.params;
    const detailPost = await this.postService.detailPost(postId)

    res.status(200).json(detailPost)
  }

  likepostPage = async (req,res,next) => {
    res.render("likelist")
  }

  likePost = async (req,res,next) => {
    const { postId,key } = req.body;
    const likePost = await this.postService.likePost(postId,key)
    
    res.status(200).send(likePost)
  }

  createPost = async (req,res,next) => {
    const { title , description , key} = req.body;
    const createPost = await this.postService.createPost(title , description , key)
    res.status(200).json({post: createPost})
  }



  editPost = async (req,res,next) => {
    let { postId,key } = req.body
    const editPost = await this.postService.editPost(postId,key)

    res.status(201).json(editPost)
  }

  postingPage = async (req, res, next) => {
    res.render("posting")
  };

  editpostPage = async (req,res) => {
    res.render("postedit")
  }

  updatePost = async (req, res, next) => {
    let {postId,description,title} = req.body;

    const updatePost = await this.postService.updatePost(postId,description,title);
    res.send(updatePost);
};

  deletePost = async (req, res, next) => {
    const { postId,key } = req.body;

    const deletePost = await this.postService.deletePost(postId,key);

    res.status(200).send(deletePost);
  };
}

module.exports = PostsController;