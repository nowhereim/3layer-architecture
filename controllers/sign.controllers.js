// controllers/posts.controller.js

const SignService = require('../services/sign.services');

class SignsController {
  
  signService = new SignService();

  logIn = async (req, res, next) => {
    const {id,pw} = req.body
    let login = await this.signService.logIn(id,pw)
    res.status(200).json(login)
  };

  regisTer = async (req, res, next) => {
    const 아이디 = req.body.id;
    const 비밀번호 = req.body.pw
    const 비밀번호체크 = req.body.pw2


    let test = await this.signService.regisTer(아이디,비밀번호,비밀번호체크)
    res.send(test);
  };

  logOut = async (req,res) => {
    res.clearCookie("token");
        res.redirect("/");
        }

  getloginPage = async (req, res, next) => {
    

    res.render("lotest")
  };

  getregisterPage = async (req, res, next) => {
   
    res.render("register copy")
  };
}

module.exports = SignsController;