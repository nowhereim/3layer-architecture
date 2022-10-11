const express = require("express")
const router = express.Router() 
const { User,CommenT,PosT } = require("../models");
const { Op}  = require("sequelize");
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
    
    
  res.render("editcomment")
  
  
  // console.log(req.query.authorization)
  // let x = jwt.verify(req.headers.authorization,"this이즈super개쩌는token");
  // console.log(x.userId)
  // res.render("editcomment")
})
// 라우터 는 배열로 중복 호출 가능 ex app.use("/api",[posts,comments,auth]) 이런식으로 라우트를 여러개 만들어서 주소는 같고 기능이 다른 라우터를 만들수있다.
// app.use("/api",posts) 이런식으로 하면 /api/posts 이런식으로 주소가 만들어진다.


//지정 조회
router.get("/get" , async (req,res) => {
  const postId = req.query.postId;
  const commentId = req.query.commentId;
  // console.log(postId,commentId)
  // const commentlist = await CommenT.findAll({
  //   where: {
  //     [Op.or]: [{postId,commentId}],
      
  //   },
  // });
  // console.log(commentlist)
  const commentlists = await CommenT.findAll({
    where: {
      [Op.or]: [{postId}],
    },
  });
  res.json({댓글 : commentlists});
  })

//댓글작성
router.post("/", async (req, res) => {
	const { 댓글,postId,key } = req.body;
  // console.log(req.body)
  const comment = 댓글
    const commentlist = await CommenT.findAll({});
  let q =commentlist.length - 1 
  // let  findeco = await comments.find().select("commentId");
  // console.log(findeco)
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
  // await comments.updateOne({ commentId : commentId }, { $set: { comment } });
  res.send("수정 성공");
})
      
    
    


  //   if(postId === undefined){
  //     req.status(400).json({errorMessage:"게시글번호를 지정해주세요"})
  // }  
  // if(pw === undefined){
  //       req.status(400).json({errorMessage:"비밀번호를 입력해주세요"})
  //   } 
  //   if(name === undefined){
  //     req.status(400).json({errorMessage:"이름을 입력해주세요"})
  // } 
  // console.log(comment)


//수정기능
// router.put("/", async (req, res) => {
//     const { comment } = req.body;
//     const { pw } = req.body;
//     const { name } = req.body;
//     console.log(comment)
//     const finde = await comments.find({name});
//     if(finde.length === 0){res.status(400).json({errorMessage : "해당 정보의 댓글이 없습니다."})}
//     let findepw = finde[0].pw
//     console.log(finde)
    
//     if(comment === undefined){
//         res.status(400).json({errorMessage : "댓글 내용을 입력해주세요"})
//     }

//     if(name === undefined){
//       res.status(400).json({errorMessage : "이름을 입력해주세요"})
//     }

//     if(pw !== findepw){
//         res.status(400).json({errorMessage : "비밀번호가 틀렸습니다."})
//     }
    
//     if (finde.length && pw === findepw) {
//       await comments.updateOne({ name: name }, { $set: { comment } });

//     }
  
//     res.json({ success: true });
//   })

  //삭제기능
  router.delete("/", async (req, res) => {
    const {commentId} = req.body;
    console.log(commentId)
    // console.log(12)
    // const { pw } = req.body;
    // const existspost = await comments.find( commentId );
    await CommenT.destroy({where: {commentId}});
    // await comments.deleteOne( commentId );
    // await comments.find( commentId );
    // findepw = existspost[0].pw
    

    // if ({pw}.pw === findepw) {
      
    // }
  
    res.send("삭제 성공");
  });


module.exports = router;