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

  createPost = async (nickname, password, title, content) => {
    // 저장소(Repository)에게 데이터를 요청합니다.
    const createPost = await this.postRepository.createPost(nickname,password, title, content)
    return {
        postId: createPost.postId,
        nickname: createPost.nickname,
        password: createPost.password,
        title: createPost.title,
        content: createPost.content
    }
  }
    
  updatePost = async (title,content) => {
    // 저장소(Repository)에게 데이터를 요청합니다.
    const updatePostData = await this.postRepository.updatePost(title,content);


    // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
    return {
      postId: updatePostData.null,
      nickname: updatePostData.nickname,
      title: updatePostData.title,
      content: updatePostData.content,
      createdAt: updatePostData.createdAt,
      updatedAt: updatePostData.updatedAt,
    };
  }


}

module.exports = PostService;