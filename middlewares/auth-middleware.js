const jwt = require("jsonwebtoken");
const { User,CommenT,PosT,likekey } = require("../models");
const { Op}  = require("sequelize");

module.exports = async (req, res, next) => {

    
    const { authorization } = req.headers;
    console.log(authorization)
    const [tokenType, tokenValue] = String(authorization).split(' ');
    console.log(tokenType + 1111111)
    if (tokenType !== "Bearqer") {
        return res.status(400).send({
            errorMessage: '로그인 후 사용하세요',
        
        });;
    }
    

                
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0YWVqanlhbmciLCJpYXQiOjE2NjU2NjIwOTMsImV4cCI6MTY2NTY2Mzg5M30.VWYKNBLMxZdqepohK_jaEvMl16nQHwPBLzuZbmxhUHs"
            const { userId } = jwt.verify(token, process.env.ATS);
            console.log(userId)
            let x = await User.findAll({
                where: {
                    [Op.or]: [{ ID:userId }],
                },
            })
            console.log(x)
        
        
                res.locals.user = x[0].dataValues.ID;
                // throw new Error("여기까지 정상적으로 온다.");
                console.log(res.locals.user)
                
                next()




    
   
           
        

}
// 미들웨어는 넥스트가 호출되어야 다음으로 넘거단다.
// 포론트에서 http header를 Authorization : bearer JWT토큰내용 으로 보내고 있따.

// const jwt = require('jsonwebtoken');
// const { User,CommenT,PosT,likekey } = require("../models");

// module.exports = async (req, res, next) => {
    
//     const { authorization } = req.headers;
//     console.log(authorization.split(' '))
//     // console.log(authorization)
//     const [tokenType, tokenValue] = authorization.split(' ');
//     console.log(`토큰 타입은 ===${tokenType},토큰 벨류는 ===${tokenValue}`)
//     next();
// // 토큰 타입을 검사한다.
// if(tokenType !== 'Bearer'){
// res.status(401).send({
// errorMessage: '로그인 후 사용하세요.'
// })
// return;
// }

// try {
// const {userId} = jwt.verify(tokenValue, 'this이즈super개쩌는token'); // userId가 없으면 오류가 나기 때문에 catch로 넘어가게 된다.
// User.findOne({userId}).then((user) => { // 위 코드에서 오류가 나게 되면 아래 코드는 안타기 때문에, 아래에서 userId를 DB에서 조회할 때 무조건 있다는 가정하에 코드를 작성한다.
// res.locals.user = user;
// next();
// })
// } catch (error) {
// res.status(401).send({
// errorMessage: '로그인 후 사용하세요.'
// });
// return;
// }
// }