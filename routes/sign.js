const express = require("express")
const router = express.Router() 
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { User,CommenT,PosT } = require("../models");
const { Op}  = require("sequelize");


router.get("/",function(req,res){
        res.render("lotest")
})






router.get("/register",function(req,res){
    res.render("register copy")
})

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
            const token = jwt.sign({userId:existsUsers[0].ID},process.env.ATS,{expiresIn: '30m'});
            console.log(`내 아이디를 토큰으로 생성한 값 :${token}`)
            const decoed = jwt.verify(token, process.env.ATS)
            console.log(`jwt.verify를 통해 디코딩 한 나의 토큰값은 : ${decoed.userId}`)
            return 응답.status(200).json({token : decoed.userId});
             }else if(existsUsers[0].pw !== pw){
            return;
        }}
    
})


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