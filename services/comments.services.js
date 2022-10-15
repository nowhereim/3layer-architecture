// services/posts.service.js
const CommentsRepository = require('../repositories/comments.repositories');

class CommentsService {
  commentsRepository = new CommentsRepository();

  //전체댓글조회
  findAllComment = async () => {
    // 저장소(Repository)에게 데이터를 요청합니다.
    const allcomments = await this.commentsRepository.findAllcomments();
   
    // 호출한 Post들을 가장 최신 게시글 부터 정렬합니다.
    allcomments.sort((a, b) => {
      return b.createdAt - a.createdAt;
    })

    // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
    return allcomments.map(post => {
      return {
        postId: post.postId,
        nickname: post.nickname,
        title: post.title,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      }
    });
  }

  //특정댓글조회
  findPostById = async (postId,CommentsId) => {
    const commentOne = await this.commentsRepository.findPostById(postId,CommentsId);
    const results = commentOne.map((commentOne) => {
      return {
      댓글: commentOne.comment,
      코멘트아이디: commentOne.commentId
      };
    });
    console.log(results)
    return {전체댓글목록 : results}
  }

  //댓글생성
  createComment = async (댓글,postId,key) => {
    // 저장소(Repository)에게 데이터를 요청합니다.
    const createcomment = await this.commentsRepository.createComments(댓글,postId,key)
    return {
        postId: createcomment.postId,
        nickname: createcomment.nickname,
        password: createcomment.password,
        title: createcomment.title,
        content: createcomment.content
    }
  }
  //댓글 수정
  updateComment = async (comment,commentId) => {
    // 저장소(Repository)에게 데이터를 요청합니다.
    const updateCommentData = await this.commentsRepository.updateComment(comment,commentId);


    // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
    return updateCommentData
  }

  deleteComments = async (commentId) => {
    await this.commentsRepository.deleteComments(commentId);
    
    return ;
  }


}

module.exports = CommentsService;