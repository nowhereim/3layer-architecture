const jwt = require('jsonwebtoken');
const { Users } = require('../models');
require('dotenv').config();

// 유저 인증에 실패하더라도 에러를 반환하지 않는다.
module.exports = async (req, res, next) => {
  try {
    const cookies = req.cookies[process.env.COOKIE_NAME];
    if (!cookies) {
      return res.status(403).send({
        errorMessage: '로그인이 필요한 기능입니다.',
      });
    }

    const [tokenType, tokenValue] = cookies.split(' ');
    if (tokenType !== 'Bearer') {
      return res.status(403).send({
        errorMessage: '전달된 쿠키에서 오류가 발생하였습니다.',
      });
    }

    const { userId } = jwt.verify(tokenValue, process.env.SECRET_KEY);
    const user = await Users.findByPk(userId);

    res.locals.user = user;
    next();
  } catch (error) {
    res.locals.user = { userId: undefined };
    next();
  }
};
