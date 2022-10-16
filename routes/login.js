const express = require('express');
const router = express.Router();
const authLoginUserMiddleware = require('../middlewares/authLoginUserMiddleware');

const LoginController = require('../controllers/login')
const loginController = new LoginController();

router.post('/', authLoginUserMiddleware, loginController.postLogin)
router.put('/password', authLoginUserMiddleware, loginController.changePassword)

module.exports = router;