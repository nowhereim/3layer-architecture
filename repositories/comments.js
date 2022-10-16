const { Comments } = require('../models');

class Commentsrepository{
    createComment =  async(postId,comment,userId) => {
        await Comments.create({ postId, userId, comment });
        return "댓글 작성 성공"
    }
}

module.exports = Commentsrepository