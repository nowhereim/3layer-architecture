const PostRepository = require('../repositories/posts');
// 결국 sequelize 관련 require 는 repository에서 해야함..


class PostService {

  postRepository = new PostRepository();

  findAllPost = async () => {
    // 찾기 
    const allPost = await this.postRepository.findAllPost();
    // 정렬하기
    allPost.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    //올려보내기
    return allPost;
  };

  createPost = async (userId, title, content) => {
    // 만들기
    console.log("서비스에 뜨는값" + userId, title, content)
    const createPostData = await this.postRepository.createPost(
      // 누가 썼는지 넣어야 해서 userId 넣음. 닉네임은 넣지 말아봐.
      userId,
      title,
      content
    );

    // 올려보내기
    return createPostData;
  };

  findPostById = async (postId) => {
    // 상세정보 찾기
    const findPost = await this.postRepository.findPostById(postId);

    // 찾은 정보 올리기
    return findPost;
  };

  updatePost = async (userId, postId, title, content) => {
    // 업데이트할 게시글 찾기
    const findPost = await this.postRepository.findPostById(postId);
    if (!findPost) throw new Error("게시글이 없서용");

    // 수정하기 
    await this.postRepository.updatePost(userId, postId, title, content);

    // 수정한 게시글 찾아보기(다른사람이 시도했거나 안됐으면 못찾았을것.)
    const updatePost = await this.postRepository.findPostById(postId);
    // 찾은 게시글 올려보내기
    return updatePost;
  };

  deletePost = async (userId, postId) => {
    // 삭제한 게시글 찾기
    const findPost = await this.postRepository.findPostById(postId);
    if (!findPost) throw new Error("Post doesn't exist");

    // 삭제한 게시글 삭제하기
    await this.postRepository.deletePost(postId, userId);

    // 삭제했던 게시글 올려보내기
    return findPost;
  };
}


module.exports = PostService;