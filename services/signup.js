const SignupRepository = require('../repositories/signup')
const bcrypt = require("bcrypt");
const saltRounds = 10;

class SignupService {
  signupRepository = new SignupRepository()

  createUser = async (nickname, password) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    password = await bcrypt.hash(password, salt);

    const createUser = await this.signupRepository.createUser(nickname, password)

    return {
      userId: createUser.null,
      nickname: createUser.nickname,
      createdAt: createUser.createdAt,
      updatedAt: createUser.updatedAt,
    }
  }

  findSameNickname = async (nickname) => {
    const findSameNickname = await this.signupRepository.findSameNickname(nickname)

    return findSameNickname
  }
}

module.exports = SignupService