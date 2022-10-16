const { Users } = require("../models");

class SignupRepository {
    createUser = async (nickname, password) => {
        const createUser = await Users.create({nickname, password})

        return createUser
    }

    findSameNickname = async (nickname) => {
       const userData = await Users.findOne({where:{nickname}})

       return userData
    }
}

module.exports = SignupRepository