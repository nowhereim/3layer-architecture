const { Users } = require('../models');

class LoginRepository {
    findUser = async (nickname) => {
        const user = await Users.findOne({where:{nickname}})
        return user
    }
}

module.exports = LoginRepository