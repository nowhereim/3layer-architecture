const SignupService = require('../services/signup');
const Joi = require('joi');

const usersSchema = Joi.object({
  nickname: Joi.string().alphanum().min(3).required(),
  password: Joi.string().min(4).required(),
  confirm: Joi.string().required(),
});

class SignupController {
    signupService = new SignupService();
  
    postSignup = async (req, res, next) => {
      try {
        let { nickname, password, confirm } = await usersSchema.validateAsync(req.body);
  
        if (password !== confirm) {
          res.status(401).send({
            errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
          });
          return;
        }
  
        if (password.includes(nickname)) {
          res.status(400).send({
            errorMessage: "패스워드에 닉네임을 넣을 수 없습니다.",
          });
          return;
        }
  
        const existUsers = await this.signupService.findSameNickname(nickname)
        if (existUsers) {
          res.status(409).send({
            errorMessage: "이미 가입된 닉네임이 있습니다.",
          });
          return;
        } else {
          const createdUser = await this.signupService.createUser(nickname, password);
          
          res.status(201).send({ message: '회원 가입에 성공하였습니다.', data: createdUser});
        }
  
      } catch (error) {
        const message = `${req.method} ${req.originalUrl} : ${error.message}`;
        console.log(message);
        res.status(400).json({ message });
      }
    };
  }
  
  module.exports = SignupController