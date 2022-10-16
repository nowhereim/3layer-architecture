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

    Commentlist = async (postId) => {
        const comments = await this.commentrepository.Commentlist(postId)
        return comments
    }

    Commentedit = async (commentId, comment, userId) => {
        const resultSchema = commentSchema.validate({comment:comment});
      if (resultSchema.error) {
        return '데이터 형식이 올바르지 않습니다.'
      }
        const Commentedit = await this.commentrepository.Commentedit(commentId,comment,userId)

        if (Commentedit < 1) {
            return '댓글 수정이 정상적으로 처리되지 않았습니다.'
           
          }
        return "댓글 수정이 정상적으로 처리되었습니다링구링"
    }

    Commentdelete = async (commentId, userId) => {
        const isExist = await this.commentrepository.CommentisExist(commentId)
        if (!isExist) {
            return "댓글이 없당구링"
          }
        
        const Commentdelete = await this.commentrepository.Commentdelete(commentId, userId)
        if (Commentdelete < 1) {
            return "댓글 삭제가 정상적으로 처리되지 않았당구링"
          }

        return "댓글 삭제가 정상적으로 처리되었습니다링구링"


    }

}

module.exports = Commentsservice