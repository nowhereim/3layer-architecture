const express = require("express")
const router = express.Router()
require('dotenv').config()

const signsController = require('../controllers/sign.controllers');
const signController = new signsController();





router.get("/", signController.getloginPage)
router.get("/register", signController.getregisterPage)
router.post("/register", signController.regisTer)
router.get("/logout", signController.logOut)
router.post("/login", signController.logIn)

    
    module.exports = router;