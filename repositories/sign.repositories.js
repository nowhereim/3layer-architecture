// repositories/posts.repository.js

const { User } = require('../models');
const { Op}  = require("sequelize");

class SignRepository {
  logIn = async (id,pw) => {
    const existsUsers = await User.findAll({
      where: {
        [Op.or]: [{ ID:id }],
      },
    });
    return existsUsers;


  };  

  regisTeridcheck = async (아이디) => {
    const existsUsers = await User.findAll({
      where: {
          [Op.or]: [{ ID:아이디 }],
      },
      });
      return existsUsers;

  };
  regisTer = async (아이디,비밀번호) => {
    let user = User.create({
      id : 아이디,
      pw :비밀번호,
      date:new Date()},
      )
      return user;
  }

  logOut = async () => {
    
    
  } 

}


module.exports = SignRepository;