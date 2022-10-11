const express = require("express")
const router = express.Router() 
const Post = require("../schemas/post");
const { User,CommenT,PosT,likekey } = require("../models");
const { Op}  = require("sequelize");



// const Cart = require("../schemas/cart");
// router.post("/goods/:goodsId/cart", async (req, res) => {
//   const { goodsId } = req.params;
//   const { quantity } = req.body;

//   const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
//   if (existsCarts.length) {
//     return res.json({ success: false, errorMessage: "이미 장바구니에 존재하는 상품입니다." });
//   }

//   await Cart.create({ goodsId: Number(goodsId), quantity: quantity });

//   res.json({ result: "success" });
// });
let aa = [{"tktle":"title","content":"content","name":"name","pw":"pw"}]






//상세조회
router.get("/detail/:id", async function(req,res){
    res.render("detail")
  })


router.get("/postlist/:postId", async (req,res) => {
const { postId } = req.params;
// const postlist = await Post.find({ postId });
const postlist = await PosT.findAll({
  where: {
    [Op.or]: [{postId}],
  },
});
// console.log(postlist)

let i = Date.now()
// console.log(i)

const commentlists = await CommenT.findAll({
  where: {
    [Op.or]: [{postId}],
  },
});
// console.log(commentlists)
// console.log(commentlists)
const results = postlist.map((postlists) => {
  return {
          // 게시물고유번호: postlists.postId,
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
  console.log(x)
  if (x.length === 0){
    res.send("본인만 수정 가능합니다.")
  }else{
    res.json({ data : x })
  }
  
})

//좋아요 구현
router.post("/like", async (req,res) => {
  const { postId,key } = req.body;
  // console.log(postId)
  // console.log(postId,key)


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
    // await Post.updateOne({ postId:postId }, { $inc: { like: -1 }, $pull : { likekey: key } });
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
// var seconds = ('0' + today.getSeconds()).slice(-2); 

var timeString = hours + '시 ' + minutes
//   + ':' + seconds;

let timeset = dateString + "일 " + timeString + "분"

	let { title , description , key} = req.body;
  const createdposts = await PosT.create({timeset,title,description,key})
  // console.log(timeset)
  // const createdposts = await Post.create({ title,description, key });

  res.json({ post: createdposts });
  console.log(Post)
});

router.get("/list2",async function(req,res){
  // key:req.query
  let {key} = req.query
  // console.log(key)
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
  //   console.log(zz)
  // console.log(results)
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
      // console.log(`a는 = ${a[0]},b는 = ${b[0].like}`)
      return b[0].like-a[0].like
  })
  console.log(p[0])
  res.json({ data:p })
})

router.get("/like",async function(req,res){
  res.render("likelist")
})

router.get("/list",async function(req,res){
  // console.log(req.query)
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
  // console.log(req.headers);
  // console.log(req.headers.authorization.split(" "))
  // console.log(res.locals)
  // console.log(11111111111)
  // res.sendFile(__dirname + "/views/detail.html")
  return res.render("detail")
  
  
})

// router.get("/detaillist/?postId",async function(req,res){
//   let find = await Posts.find(req.params);
//   let comment = await comments.find(req.params);
//   // console.log(find,comment);
//   res.json({게시글 : find, 댓글 : comment})

// })

router.get("/editpost", async (req,res) => {
  res.render("postedit")
})

 //전체조회
router.get("/postlist", async (req,res) => {
    const postlists = await Post.find();
    // console.log(postlists)
    
    
  const results = postlists.map((postlists) => {
		return {
			제목: postlists.title,
            이름: postlists.name,
            내용: postlists.description,
            // pw: postlists.pw,
            작성일: postlists.date,
		};
  });

  res.json({
    게시물목록: results.sort((a,b) =>{
        return b.작성일 - a.작성일
    })
  });
});
 
// 테스트
// router.get("/postlist/post", async (req,res) => {
//   const postlists = await Post.find(req.body);
//   console.log(...postlists)
//   const { postId } = req.body
//   const commentlists = await comments.find({ postId });
//   const results = postlists.map((postlists) => {
//     return {
//       제목: postlists.title,
//             이름: postlists.name,
//             내용: postlists.description,
//             // pw: postlists.pw,
//             작성일: postlists.date,
//     };
//   });
// const comment = commentlists.map((commentlists) => {
//   return {
//   댓글: commentlists.comment,     
//   };
// });

// res.json({
//   게시물목록: results ,댓글 : comment
// });
// });

router.put("/get", async (req, res) => {
    let {postId,description,title} = req.body;
    // const existspost = await Post.find({ postId: Number(postId) });

     await PosT.update({title:title}, {where: {postId}});
     await PosT.update({description:description}, {where: {postId}});
      // await Post.updateOne({ postId: Number(postId) }, { $set: { title } });
      // await Post.updateOne({ postId: Number(postId) }, { $set: { description } });
      
    
    
    res.send("성공");
  })
  
router.delete("/postlist", async (req, res) => {
  const { postId,key } = req.body;
  const existspost = await PosT.findAll({ 
    where:{
      [Op.or]: [{postId,key}],
    }
     });
  // const existspost = await Post.find({ postId,key });
  if(existspost.length === 0){
    res.send("본인만 삭제 가능합니다.")
  }else{
    await PosT.destroy({where:{postId,key}})
    await likekey.destroy({where:{postId}})
    // let x = await Post.deleteOne({ postId, key });
    res.send("삭제완료")
  }
  
});

  // body랑 params랑 잘 숙지하자... 13시간 날렸다..









// router.put("/goods/:goodsId/cart", async (req, res) => {
//     const { goodsId } = req.params;
//     const { quantity } = req.body;
//     if(quantity < 1){
//         res.status(404).json({errorMessage : "수량을 0개로 어떻게 변경해 병신아"})
//     }
  
//     const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
//     if (existsCarts.length) {
//       await Cart.updateOne({ goodsId: Number(goodsId) }, { $set: { quantity } });
//     }
  
//     res.json({ success: true });
//   })

//   router.delete("/goods/:goodsId/cart", async (req, res) => {
//     const { goodsId } = req.params;
  
//     const existsCarts = await Cart.find({ goodsId });
//     if (existsCarts.length > 0) {
//       await Cart.deleteOne({ goodsId });
//     }
  
//     res.json({ result: "success" });
//   });

//   router.get("/goods/cart", async (req, res) => {
//   const carts = await Cart.find();
//   const goodsIds = carts.map((cart) => cart.goodsId);

//   const goods = await Goods.find({ goodsId: goodsIds });

//   res.json({
//       carts: carts.map((cart) => ({
//           quantity: cart.quantity,
//           goods: goods.find((item) => item.goodsId === cart.goodsId),
//       })),
//   });
// });





module.exports = router;