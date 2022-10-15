// services/posts.service.js
const jwt = require('jsonwebtoken')
require('dotenv').config()

const SignRepository = require('../repositories/sign.repositories');

class SignService {
  signRepository = new SignRepository();

  logIn = async (id,pw) => {
    let existsUsers = await this.signRepository.logIn(id,pw);
    if(id===""){
      return"아이디를 입력해주세요"
  }
  if(pw===""){
      return"비밀번호를 입력해주세요"
  }
    if(existsUsers.length === 0){
      return "아이디가 존재하지 않습니다.";
  }else{
      if(existsUsers[0].pw === pw){
          const token = jwt.sign({userId:existsUsers[0].ID},process.env.ATS,{expiresIn: '30m'});
          console.log(`내 아이디를 토큰으로 생성한 값 :${token}`)
          const decoed = jwt.verify(token, process.env.ATS)
          console.log(`jwt.verify를 통해 디코딩 한 나의 토큰값은 : ${decoed.userId}`)
          return {token : decoed.userId}
           }else if(existsUsers[0].pw !== pw){
          return "비밀번호가 틀렸습니다."
      }}
  }

  regisTer = async (아이디,비밀번호,비밀번호체크) => {
    let regExp = /^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{3,9}$/;
    if( !regExp.test(아이디) ) {
      return '아이디 형식을 확인해주세요.'
  }
      else if(비밀번호 !== 비밀번호체크){
      return '비밀번호를 다시 확인해주세요.'
  }
      else if(비밀번호.length < 3 || 아이디 === 비밀번호 ){
      return '비밀번호 형식을 확인해주세요.'
  }

    let checkId = await this.signRepository.regisTeridcheck(아이디);
    if (checkId.length > 0) {
      return "이미 존재하는 아이디입니다.";
    }
    await this.signRepository.regisTer(아이디,비밀번호)

    return "회원가입 성공";
  }
    
  logOut = async (title,content) => {

  }


}

module.exports = SignService;