const express = require('express');
const Joi = require('joi');
const { Users, sequelize, Sequelize } = require('../models');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const authLoginUserMiddleware = require('../middlewares/authLoginUserMiddleware');

const router = express.Router();
require('dotenv').config();

const loginSchema = Joi.object({
  nickname: Joi.string().required(),
  password: Joi.string().required(),
});

router.post('/', authLoginUserMiddleware, async (req, res) => {
  try {
    const { nickname, password } = await loginSchema.validateAsync(req.body);
    const user = await Users.findOne({
      where: {
        [Op.and]: [{ nickname }, { password }],
      },
    });

    if (!user) {
      return res.status(412).send({
        errorMessage: '닉네임 또는 패스워드를 확인해주세요.',
      });
    }

    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 60);

    const token = jwt.sign({ userId: user.userId }, process.env.SECRET_KEY);

    res.cookie(process.env.COOKIE_NAME, `Bearer ${token}`, {
      expires: expires,
    });
    return res.status(200).json({ token });
  } catch (error) {
    console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
    return res.status(400).send({
      errorMessage: '로그인에 실패하였습니다.',
    });
  }
});

module.exports = router;
