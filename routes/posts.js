const express = require("express")
const router = express.Router() 
const { User,CommenT,PosT,likekey } = require("../models");
const { Op}  = require("sequelize");







//상세조회
router.get("/detail/:id", async function(req,res){
    res.render("detail")
  })


router.get("/postlist/:postId", async (req,res) => {
const { postId } = req.params;
const postlist = await PosT.findAll({
  where: {
    [Op.or]: [{postId}],
  },
});

const commentlists = await CommenT.findAll({
  where: {
    [Op.or]: [{postId}],
  },
});
const results = postlist.map((postlists) => {
  return {
          제목: postlists.title,
          이름: postlists.name,
          내용: postlists.description,
          작성일: postlists.timeset
  };
})
let comment = commentlists.map((commentlists) => {
  return {
    _id: commentlists._id,
  댓글: commentlists.comment,
  작성일: commentlists.date,
  commentId : commentlists.commentId,
  키 : commentlists.key
  };
});

res.json({게시글목록 : results, 댓글목록 : comment.sort((a,b) =>{
  return b.createdAt - a.createdAt
})});
})


router.get("/posting", async (req,res) => {
  res.render("posting")
  
})

router.post("/get", async (req,res) =>{
  let { postId,key } = req.body
  console.log(req.body)
  let x = await PosT.findAll({
    where: {
      [Op.or]: [{postId,key}],
    },
  });
  if (x.length === 0){
    res.send("본인만 수정 가능합니다.")
  }else{
    res.json({ data : x })
  }
  
})

//좋아요 구현
router.post("/like", async (req,res) => {
  const { postId,key } = req.body;


  let x = await PosT.findAll({ 
    where: {
      [Op.or]: [{postId}],
    },
   })
   let upcount = x[0].dataValues.like + 1
   let downcount = x[0].dataValues.like - 1
    let l = await likekey.findAll({ 
    where: {
      [Op.or]: [{postId,likekey:key}],
    },
   })
  if(l.length === 0){
  await likekey.create({postId,likekey:key})
    await PosT.update({like:upcount}, {where: {postId}});
 res.send("success")
  
  }else{
    await likekey.destroy({where:{postId,likekey:key}})
    await PosT.update({like:downcount}, {where: {postId}});
    res.send("descount")
}
})
 






//게시글작성
router.post("/posting", async (req, res) => {
  var today = new Date();

var year = today.getFullYear();
var month = ('0' + (today.getMonth() + 1)).slice(-2);
var day = ('0' + today.getDate()).slice(-2);

var dateString = year + '년 ' + month  + '월 ' + day;

var today = new Date();   

var hours = ('0' + today.getHours()).slice(-2); 
var minutes = ('0' + today.getMinutes()).slice(-2);

var timeString = hours + '시 ' + minutes
//   + ':' + seconds;

let timeset = dateString + "일 " + timeString + "분"

	let { title , description , key} = req.body;
  const createdposts = await PosT.create({timeset,title,description,key})

  res.json({ post: createdposts });
  console.log(Post)
});

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
  
    let zz = {...results}
  let qwe = []
  
  for(let i = 0; i < results.length; i++){
      let q = zz[i].postId
       let y = await PosT.findAll({
      where:{
          [Op.or]:[{postId:q}]
      }});
      qwe.push(y)
  }
  let p = qwe.sort(function(a,b){
      return b[0].like-a[0].like
  })
  res.json({ data:p })
})

router.get("/like",async function(req,res){
  res.render("likelist")
})

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
      return new Date(b.createdAt) - new Date(a.createdAt);
  })
  
    
    
  res.json({ data:p,likes:results })
})

router.get("/detail/?", async function(req,res){
  return res.render("detail")
  
  
})

router.get("/editpost", async (req,res) => {
  res.render("postedit")
})

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

router.put("/get", async (req, res) => {
    let {postId,description,title} = req.body;

     await PosT.update({title:title}, {where: {postId}});
     await PosT.update({description:description}, {where: {postId}});
      
    
    
    res.send("성공");
  })
  
router.delete("/postlist", async (req, res) => {
  const { postId,key } = req.body;
  const existspost = await PosT.findAll({ 
    where:{
      [Op.or]: [{postId,key}],
    }
     });
  if(existspost.length === 0){
    res.send("본인만 삭제 가능합니다.")
  }else{
    await PosT.destroy({where:{postId,key}})
    await likekey.destroy({where:{postId}})
    res.send("삭제완료")
  }
  
});

module.exports = router;