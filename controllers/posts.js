const PostService = require('../services/posts');
const Joi = require('joi');
// 다루는게 class 하나뿐이기 때문에 필요한건 require과 joi뿐임
// module.exports 하는것도 PostsController 클래스 뿐임. 

const RE_TITLE = /^[a-zA-Z0-9\s\S]{1,40}$/; //게시글 제목 정규 표현식
const RE_CONTENT = /^[\s\S]{1,3000}$/; // 게시글 내용 정규 표현식

const postSchema = Joi.object({
  title: Joi.string().pattern(RE_TITLE).required(),
  content: Joi.string().pattern(RE_CONTENT).required(),
});



// 이곳에서 하는 일
// joi 벨리데이션 합니다.
// req 로 오는 데이터들을 받아 파라미터로 넘겨줍니다.
// res.local.uesr 에서 오는 userId 도 여기서 받아 파라미터로 넘겨줍니다.
class PostsController {
  postService = new PostService();


  getPosts = async (req, res, next) => {
    const posts = await this.postService.findAllPost();

    res.status(200).json({ "전체조회 결과": posts });
  };

  getPostById = async (req, res, next) => {
    const { postId } = req.params;
    const post = await this.postService.findPostById(postId);

    res.status(200).json({ "상세조회 결과": post });
  };

  createPost = async (req, res, next) => {
    const { userId } = res.locals.user;
    const { title, content } = await postSchema.validateAsync(req.body); // 게시글 생성할 때 joi 검사 한번.
    console.log("req.body 값" + title, content)
    const createPostData = await this.postService.createPost(
      userId,
      title,
      content
    );
    res.status(201).json({ '생성 결과': createPostData });
  };

  updatePost = async (req, res, next) => {
    const { userId } = res.locals.user;
    const { postId } = req.params;
    const { title, content } = await postSchema.validateAsync(req.body);

    const updatePost = await this.postService.updatePost(
      userId,
      postId,
      title,
      content
    );

    res.status(200).json({ '수정된 내용': updatePost });
  };

  deletePost = async (req, res, next) => {
    const { userId } = res.locals.user;
    const { postId } = req.params;

    // 비밀번호는 authMiddleware를 통해 전할 수 있기 때문에 뺐음.
    const deletePost = await this.postService.deletePost(userId, postId);

    res.status(200).json({ '삭제된 내용': deletePost });
  };
}

module.exports = PostsController;