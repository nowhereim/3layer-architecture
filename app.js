const express = require('express');
const app = express();
const postRouter = require("./routes/posts.js")
const commentRouter = require("./routes/comments.js")
const port = 3000;
const connect = require("./schemas");
const sign = require("./routes/sign.js");
connect();
require('dotenv').config()
const authMiddleware = require("./middlewares/auth-middleware");
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.json());
app.use("/post",postRouter);
app.use("/comment",commentRouter);
app.use("/sign",sign);
app.get("/", async function(req,res){
    console.log("/로 접속");
    res.render("main")
})


app.listen(port, () => {
    console.log("3000번 실행 완료")
});
