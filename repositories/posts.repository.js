// repositories/posts.repository.js

const { PosT,likekey,CommenT } = require('../models');
const { Op}  = require("sequelize");

class PostRepository {
  findAllPost = async () => {
    const posts = await Posts.findAll();

    return posts;
  };

  findPostById = async (postId) => {
    const post = await Posts.findByPk(postId);

    return post;
  };

  editPost = async (postId,key) => {
    const editPost = await PosT.findAll({
      where: {
        [Op.or]: [{postId,key}],
      },
    });
    return editPost
  }

  likePost = async (postId,key) => {
    let likePostlist = await PosT.findAll({ 
      where: {
        [Op.or]: [{postId}],
      },
     })
     return likePostlist
}
  likePostcheck = async (postId,key) => {
    let likecheck = await likekey.findAll({ 
    where: {
      [Op.or]: [{postId,likekey:key}],
    },
   })
    return likecheck
  }
  likePostcreate = async (postId,key,upcount) => {await likekey.create({postId,likekey:key})
  let likecreate = await PosT.update({like:upcount}, {where: {postId}});
  return "success"
}
  likePostdelete = async (postId,key,downcount) => {await likekey.destroy({where:{postId,likekey:key}})
  let deletelike = await PosT.update({like:downcount}, {where: {postId}});
  return "좋아요 성공"
}

createPost = async (title,description,key,현재시간) => {
    const post = await PosT.create({title,description,key,timeset:현재시간})
  return
}

  detailPost = async (postId) => {
    const detailPost = await PosT.findAll({
        where: {
          [Op.or]: [{postId}],
        },
      });
      return detailPost;
  }

  detailComment = async (postId) => {
      const commentlists = await CommenT.findAll({
    where: {
      [Op.or]: [{postId}],
    },
  });
      return commentlists;
  }

  updatePost = async (postId,description,title) => {
    let updatePostdata = await PosT.update({title:title,description:description}, {where: {postId}});
    
    

    return updatePostdata;
  };
  
  deletePost = async (postId,key) => {
    await PosT.destroy({where:{postId,key}})
      await likekey.destroy({where:{postId}})
      return;
    
}
  
  deletecheck = async (postId, key) => {
    const existspost = await PosT.findAll({ 
      where:{
        [Op.or]: [{postId,key}],
      }
       });
    return existspost;
  };
  }

module.exports = PostRepository;