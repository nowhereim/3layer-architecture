const LoginRepository = require('../repositories/login')

class LoginService {
    loginRepository = new LoginRepository()

    findUser = async (nickname) => {
        const loginUser = await this.loginRepository.findUser(nickname)
        return loginUser
    }
}

module.exports = LoginService