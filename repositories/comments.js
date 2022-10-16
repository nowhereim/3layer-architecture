const { Comments } = require('../models');
console.log(Comments)

class Commentsrepository{
    createComment =  async(postId,comment,userId) => {
        await Comments.create({ postId, userId, comment });
        return "댓글 작성 성공 입니다링 구링~"
    }
}

module.exports = Commentsrepository