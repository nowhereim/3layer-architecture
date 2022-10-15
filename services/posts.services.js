// services/posts.service.js

const PostRepository = require('../repositories/posts.repository');

class PostService {
  postRepository = new PostRepository();

  findAllPost = async () => {
    // 저장소(Repository)에게 데이터를 요청합니다.
    const allPost = await this.postRepository.findAllPost();
    console.log(`여긴 서비스 입니다. ${allPost}`)
    // 호출한 Post들을 가장 최신 게시글 부터 정렬합니다.
    allPost.sort((a, b) => {
      return b.createdAt - a.createdAt;
    })

    // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
    return allPost.map(post => {
      return {
        postId: post.postId,
        nickname: post.nickname,
        title: post.title,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      }
    });
  }

  likePost = async (postId,key) => {
    const likePostlist = await this.postRepository.likePost(postId,key);
     let upcount = likePostlist[0].dataValues.like + 1
     let downcount = likePostlist[0].dataValues.like - 1
      let likecheck = await this.postRepository.likePostcheck(postId,key) 
    if(likecheck.length === 0){
      let likePostcreate = await this.postRepository.likePostcreate(postId,key,upcount)
   return likePostcreate
    
    }else{
      let likePostdelete = await this.postRepository.likePostdelete(postId,key,downcount)
      return likePostdelete
  }
  }

  
  createPost = async (title , description , key) => {
    const 현재시간 = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    await this.postRepository.createPost(title , description , key , 현재시간)
      return;
    }
  

  detailPost = async (postId) => {
    const detailPost = await this.postRepository.detailPost(postId)
    const detailComment = await this.postRepository.detailComment(postId)
    const results = detailPost.map((detailPost) => {
      return {
              제목: detailPost.title,
              이름: detailPost.name,
              내용: detailPost.description,
              작성일: detailPost.timeset
      };
    })
    
    let comment = detailComment.map((detailComment) => {
      return {
        _id: detailComment._id,
      댓글: detailComment.comment,
      작성일: detailComment.date,
      commentId : detailComment.commentId,
      키 : detailComment.key
      };
    });
    return {게시글목록 : results, 댓글목록 : comment.sort((a,b) =>{
      return b.createdAt - a.createdAt
    })};
  }

  editPost = async (postId,key) => {
    const editPost = await this.postRepository.editPost(postId,key)
    if (editPost.length === 0){
      return "본인만 수정 가능합니다."
    }else{
      return { data : editPost }
    }
  }


    
  updatePost = async (postId,description,title) => {
    // 저장소(Repository)에게 데이터를 요청합니다.
    const updatePostData = await this.postRepository.updatePost(postId,description,title);


    // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
    return "게시글 수정이 완료 되었습니다."
  }
  deletePost = async (postId,key) => {
  const existspost = await this.postRepository.deletecheck(postId,key);
    if(existspost.length === 0){
      return "본인만 삭제 가능합니다."
    }else{
      await this.postRepository.deletePost(postId,key);
      
      return "삭제완료"
    }
    
  }



}

module.exports = PostService;