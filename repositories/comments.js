const { Comments } = require('../models');
const { Sequelize } = require('../models');
const { Op } = Sequelize;

class Commentsrepository{
    createComment =  async(postId,comment,userId) => {
        await Comments.create({ postId, userId, comment });
        return "댓글 작성 성공 입니다링 구링~"
    }

    Commentlist = async(postId) =>{
        const comments = await Comments.findAll({
            [Op.or]: [{ postId: postId }],
          });
          return comments

    }

    Commentedit = async(commentId,comment,userId) => {
        const updateCount = await Comments.update(
            { comment },
            { where: { commentId, userId } }
          );

          return updateCount
    }

    CommentisExist = async(commentId) => {
        const isExist = await Comments.findByPk(commentId);
      
        return isExist;
    }
    Commentdelete = async(commentId,userId) => {

      const deleteCount = await Comments.destroy({
        where: { commentId, userId },
      });

      return deleteCount;
    }

}

module.exports = Commentsrepository