const { Users } = require('../models');

class LoginRepository {
    findUser = async (nickname) => {
        const user = await Users.findOne({where:{nickname}})
        return user
    }

    changePassword = async (nickname, password) => {
        await Users.update({password},{where:{nickname}})
    }
}

module.exports = LoginRepository