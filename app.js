const express = require('express');
const app = express();
const postRouter = require("./routes/posts.js")
const commentRouter = require("./routes/comments.js")
const port = 3000;
const sign = require("./routes/sign.js");
const cors = require('cors');
app.use(cors({
    origin: '*', // 모든 출처 허용 옵션. true 를 써도 된다.
}));
require('dotenv').config()
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


console.log(process.env.ATS)
console.log(process.env.TRS)

console.log(process.env.ID)
console.log(process.env.password)