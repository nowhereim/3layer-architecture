const Joi = require('joi');
const commentsrepository = require('../repositories/comments')
const RE_COMMENT = /^[\s\S]{1,100}$/; // 댓글 정규 표현식

const commentSchema = Joi.object({
  comment: Joi.string().pattern(RE_COMMENT).required(),
});

class Commentsservice {
    
    commentrepository = new commentsrepository()

    createComment = async (postId, comment, userId) => {
const resultSchema = commentSchema.validate({comment:comment});
if (resultSchema.error) {
        return '데이터 형식이 올바르지 않습니다.'
    }

        const createcomment = await this.commentrepository.createComment(postId, comment, userId)
        return createcomment
    }

}

module.exports = Commentsservice