const Comments = require('../services/comments')

class Commentscontroller{
    commentsservice = new Comments();
    createComment =  async(req,res,next) => {
        const { postId } = req.params;
        const { comment } = req.body;
        const { userId } = res.locals.user;

        const createcomment = await this.commentsservice.createComment(postId,comment,userId);
        
        res.status(201).json({createcomment});
    }




    
}

module.exports = Commentscontroller;