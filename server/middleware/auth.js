const { User } = require("../models/User")

/* 인증을 처리하는 미들웨어 auth */
let auth = (req, res, next) => {

  // 클라이언트 쿠키에서 토큰을 가져온다.
  let token = req.cookies.x_auth // 쿠키에 x_auth이름으로 넣어놓은거

  console.log("token은 " + token)

  // 토큰을 복호화하여 유저를 찾음.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true })

    req.token = token
    req.user = user

    next() // middleware에서 할거 다 하고 갈 수 있도록
  })
}

module.exports = { auth }