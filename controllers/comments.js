const Comments = require('../services/comments')
const Joi = require('joi');
const RE_COMMENT = /^[\s\S]{1,100}$/; // 댓글 정규 표현식

const commentSchema = Joi.object({
  comment: Joi.string().pattern(RE_COMMENT).required(),
});

class Commentscontroller{
    commentsservice = new Comments();
    createComment =  async(req,res,next) => {
        const { postId } = req.params;
        const { comment } = req.body;
        const { userId } = res.locals.user;

        const createcomment = await this.commentsservice.createComment(postId,comment,userId);
        
        res.status(201).json({createcomment});
    }

    Commentlist = async(req,res,next) => {
            const { postId } = req.params;
            const comments = await this.commentsservice.Commentlist(postId)
            const comment = comments.sort((a, b) => b.createdAt - a.createdAt);
      
            return res.status(200).json({ data: comment });
          
          
    }

    Commentedit = async(req,res,next) => {
        const resultSchema = commentSchema.validate(req.body);
        const { commentId } = req.params;
        const { comment } = resultSchema.value;
        const { userId } = res.locals.user;
        const Commentedit = await this.commentsservice.Commentedit(commentId,comment,userId)
        res.status(200).json({메세지당구링:Commentedit});
    }

    Commentdelete = async(req,res,next) => {
        const { commentId } = req.params;
        const { userId } = res.locals.user;
        const Commentdelete = await this.commentsservice.Commentdelete(commentId,userId)

        console.log(Commentdelete)
        res.status(201).json({메세지입니당구링:Commentdelete})
    
    }
    


    

    
}

module.exports = Commentscontroller;