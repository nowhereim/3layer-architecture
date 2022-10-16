const SignupService = require('../services/signup');
const Joi = require('joi');

const re_nickname = /^[a-zA-Z0-9]{3,10}$/;
const re_password = /^[a-zA-Z0-9]{4,30}$/;

const userSchema = Joi.object({
  nickname: Joi.string().pattern(re_nickname).required(),
  password: Joi.string().pattern(re_password).required(),
  confirm: Joi.string(),
});

class SignupController {
    signupService = new SignupService();
  
    postSignup = async (req, res, next) => {
      try {
        const { nickname, password, confirm } = await userSchema.validateAsync(req.body);
  
        if (password !== confirm) {
            return res.status(412).send({
              errorMessage: '패스워드가 일치하지 않습니다.',
            });
          }
          if (nickname.search(re_nickname) === -1) {
            return res.status(412).send({
              errorMessage: 'ID의 형식이 일치하지 않습니다.',
            });
          }
          if (password.search(re_password) === -1) {
            return res.status(412).send({
              errorMessage: '패스워드 형식이 일치하지 않습니다.',
            });
          }
          if (isRegexValidation(password, nickname)) {
            return res.status(412).send({
              errorMessage: '패스워드에 닉네임이 포함되어 있습니다.',
            });
          }
  
        const existUsers = await this.signupService.findSameNickname(nickname)

        if (existUsers) {
            return res.status(412).send({errorMessage: '중복된 닉네임입니다.'});
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

  function isRegexValidation(target, regex) {
    return target.search(regex) !== -1;
  }

  module.exports = SignupController