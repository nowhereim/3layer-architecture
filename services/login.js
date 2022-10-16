const LoginRepository = require('../repositories/login')
const bcrypt = require("bcrypt");
const saltRounds = 10;

class LoginService {
    loginRepository = new LoginRepository()

    findUser = async (nickname) => {
        const loginUser = await this.loginRepository.findUser(nickname)
        return loginUser
    }
    
    changePassword = async (nickname, password) => {
        const salt = bcrypt.genSaltSync(saltRounds);
        password = await bcrypt.hash(password, salt);
        
        await this.loginRepository.changePassword(nickname, password)
    }
}

module.exports = LoginService