const express = require("express")
const router = express.Router() 
const { User,CommenT,PosT,likekey } = require("../models");
const { Op}  = require("sequelize");
PosTscontroller = require("../controllers/posts.controllers")
postscontroller = new PosTscontroller();



 //게시물 작성 랜딩
router.get("/detail/?", postscontroller.detailPage)
router.get("/editpost", postscontroller.editpostPage)
router.get("/posting", postscontroller.postingPage)
router.put("/get", postscontroller.updatePost)
router.delete("/postlist", postscontroller.deletePost)
router.get("/postlist/:postId", postscontroller.detailPost)
router.post("/get", postscontroller.editPost)
router.get("/like", postscontroller.likepostPage)
router.post("/posting", postscontroller.createPost)
router.post("/like", postscontroller.likePost)

 //전체조회
 router.get("/postlist", async (req,res) => {
  const postlists = await Post.find();
  
  
const results = postlists.map((postlists) => {
  return {
    제목: postlists.title,
          이름: postlists.name,
          내용: postlists.description,
          작성일: postlists.date,
  };
});

res.json({
  게시물목록: results.sort((a,b) =>{
      return b.작성일 - a.작성일
  })
});
});
 

//라이크리스트
router.get("/list2",async function(req,res){
  let {key} = req.query
  let x = await likekey.findAll({
      where:{
          [Op.or]:[{likekey:key}]
      
      }});

      const results = x.map((postlists) => {
          return {
          postId: postlists.postId,
          };
    });
  
    let 전개연산 = {...results}
  let 좋아요한포스트들 = []
  
  for(let i = 0; i < results.length; i++){
      let 포스트아이디 = 전개연산[i].postId
       let y = await PosT.findAll({
      where:{
          [Op.or]:[{postId:포스트아이디}]
      }});
      좋아요한포스트들.push(...y)
  }

  let 값 = 좋아요한포스트들.sort(function(a,b){
    
    return b.like-a.like
    

  })
  res.json({ data:값 })
})




//메인페이지 게시물 조회
router.get("/list",async function(req,res){
  let co = await likekey.findAll({
      where:{
          likekey:req.query.key
      }
  })

  const results = co.map((postlists) => {
  return {
    postId: postlists.postId,
  };
});
  
  let x = await PosT.findAll({});
  let p = x.sort(function(a, b) {
      return b.postId - a.postId
  })
  
    
    
  res.json({ data:p,likes:results })
})





module.exports = router;