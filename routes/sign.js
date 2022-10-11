const express = require("express")
const router = express.Router() 
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { User,CommenT,PosT } = require("../models");
const { Op}  = require("sequelize");



//dotenv 사용

router.get("/",function(req,res){
        res.render("lotest")
})






router.get("/register",function(req,res){
    res.render("register copy")
})
// router.post("/login", async (req, res) => {
//     // const {id,pw} = req.body

   
//     // const user = await User.findOne({
//     //   where: {ID:id, pw},

//     // });
    
//     // console.log(user)

//     // return res.status(401).send("힝")
    
// //    NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses
//     if (!user || pw !== user.password) {
//       res.status(400).send({
//         errorMessage: "이메일 또는 패스워드가 틀렸습니다.",
//       });
//       return;
//     }
  
//     res.send({
//       token: jwt.sign({ userId: user.userId }, "customized-secret-key"),
//     });
//   });

router.get("/logout", async function(req,res){
    
        res.clearCookie("token");
        res.redirect("/");
      
})

router.post("/login", async function(요청,응답){
    // console.log(요청.body)
    const {id,pw} = 요청.body
    if(id===""){
        return 응답.send("아이디를 입력해주세요")
    }
    if(pw===""){
        return 응답.send("비밀번호를 입력해주세요")
    }
    const existsUsers = await User.findAll({
        where: {
          [Op.or]: [{ ID:id }],
        },
      });
    if(existsUsers.length === 0){
        return;
    }else{
        // console.log(existsUsers[0].ID)
        if(existsUsers[0].pw === pw){
            const token = jwt.sign({userId:existsUsers[0].ID},"this이즈super개쩌는token",{expiresIn: '10h'});
            console.log(`내 아이디를 토큰으로 생성한 값 :${token}`)
            const decoed = jwt.verify(token,"this이즈super개쩌는token")
            console.log(`jwt.verify를 통해 디코딩 한 나의 토큰값은 : ${decoed.userId}`)
            return 응답.status(200).json({token : decoed.userId});
             }else if(existsUsers[0].pw !== pw){
            return;
        }}
    
})

// router.post("/register", async (req, res) => {
//   const { id,pw,pw2 } = req.body;
// console.log(req.body)

//   if (pw !== pw2) {
//     res.status(400).send({
//       errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
//     });
//     return;
//   }

//   // email or nickname이 동일한게 이미 있는지 확인하기 위해 가져온다.
//   const existsUsers = await User.findAll({
//     where: {
//       [Op.or]: [{ ID:id }],
//     },
//   });console.log(existsUsers[0].ID)


//   if (existsUsers.length) {
//     res.status(400).send({
//       errorMessage: "이메일 또는 닉네임이 이미 사용중입니다.",
//     });
//     return;
//   }

//   await User.create({ id, pw });
//   res.status(201).send({});
// });



router.post("/register", async function(요청,응답){
console.log(요청.body)
const 아이디 = 요청.body.id;
let regExp = /^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{3,9}$/;

    if( !regExp.test(아이디) ) {
        return 응답.send('아이디 잘못됌.')
    }
        else if(요청.body.pw !== 요청.body.pw2){
        return 응답.send('비번이 다릅니다.')
    }
        else if(요청.body.pw.length < 3 || 요청.body.id === 요청.body.pw ){
        return 응답.send('비번 똑바로 안치셈?')
    }

// let id = await users.find({ id: 아이디 });
const existsUsers = await User.findAll({
    where: {
        [Op.or]: [{ ID:아이디 }],
    },
    });

    if(existsUsers.length > 0){
        return 응답.send('이미 존재하는 아이디입니다.')
        }else{
            User.create({
            id : 요청.body.id,
            pw :요청.body.pw,
            date:new Date()},
            응답.send("성공")

)
}
})
    
    
    
    
    
    
    module.exports = router;