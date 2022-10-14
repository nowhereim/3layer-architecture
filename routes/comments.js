const express = require("express")
const router = express.Router() 
const { User,CommenT,PosT } = require("../models");
const { Op}  = require("sequelize");
authmiddleware = require("../middlewares/auth-middleware")
//댓글 전체조회
router.get("/" , async (rea,res) => {
  const x = {"key":"taejjyang"}
  const commentlist = await CommenT.findAll({
    where: {
      [Op.or]: [x],
    },
  });

const results = commentlist.map((commentlists) => {
  return {
  댓글: commentlists.comment,
  작성일: commentlists.date 
  };
});
res.json({전체댓글목록 : results.sort((a,b) =>{
  return a.작성일 < b.작성일 ? 1 : -1;
})});
})


router.get("/edit", function(req,res){
  console.log(1)
    
    
  res.render("editcomment")
})


//지정 조회
router.get("/get" , async (req,res) => {
  console.log("뭐해?")
  const postId = req.query.postId;
  const commentId = req.query.commentId;
  const commentlists = await CommenT.findAll({
    where: {
      [Op.or]: [{postId,commentId}],
    },
  });
  res.json({댓글 : commentlists});
  })

//댓글작성
router.post("/",authmiddleware, async (req, res) => {
  console.log(res.locals.user)
	const { 댓글,postId,key } = req.body;
  const comment = 댓글
    const commentlist = await CommenT.findAll({});
  let q =commentlist.length - 1 
  if(commentlist.length > 0){
    let commentId = commentlist[q].commentId + 1
  if(댓글 === ''){
      return res.send("댓글을 입력해주세요")
    }else{
  await CommenT.create({
    commentId : commentId,
    comment :댓글,
    postId :postId,
    key: key})

  res.send("작성 성공");

}
}else{
  let commentId = 1
  await CommenT.create({
    commentId : commentId,
    comment :댓글,
    postId :postId,
    key: key})

  res.send("작성 성공");
}


})

router.put("/", async (req,res) => {
  const { commentId, comment } = req.body;
  // console.log(req.body)
  await CommenT.update({comment:comment}, {where: {commentId}});
  res.send("수정 성공");
})

  //삭제기능
  router.delete("/", async (req, res) => {
    const {commentId} = req.body;
    console.log(commentId)
    await CommenT.destroy({where: {commentId}});
  
    res.send("삭제 성공");
  });


module.exports = router;