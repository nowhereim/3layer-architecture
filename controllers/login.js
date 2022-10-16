const LoginService = require('../services/login')
const Joi = require('joi');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginSchema = Joi.object({
    nickname: Joi.string().required(),
    password: Joi.string().required(),
  });

class LoginController {
    loginService = new LoginService()

    postLogin = async (req, res, next) => {
        try {
        let {nickname, password} = await loginSchema.validateAsync(req.body);
        const loginUser = await this.loginService.findUser(nickname)

        if (!loginUser) {return res.status(412).send({errorMessage: '닉네임 또는 패스워드를 확인해주세요.'})}

        const match = bcrypt.compareSync(password, loginUser.password);
        
        const token = jwt.sign({ userId: loginUser.userId }, process.env.SECRET_KEY);

        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 60);
        
        if (match) {res.cookie(process.env.COOKIE_NAME, `Bearer ${token}`, {expires: expires});
        } else {res.status(401).send({errorMessage: "닉네임 또는 패스워드가 틀렸습니다."});
            return;
          }

        return res.status(200).json({ 
            token 
        });
        } catch (error) {
            console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
            return res.status(400).send({
            errorMessage: '로그인에 실패하였습니다.',
            });
        }
    }
}

module.exports = LoginController