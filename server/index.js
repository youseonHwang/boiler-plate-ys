const express = require('express') //express 모듈을 가져옴
//const { request } = require('../../backend/app')
const app = express() //function을 이용해서 새로운 app을 이용
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { auth } = require('./middleware/auth')
const { User } = require('./models/User')
const config = require('./config/key')

/* bodyParser와 CookieParser 사용 */
app.use(bodyParser.urlencoded({ extended: true })) //application/x-www-form-ur~ 타입 분석 가능
app.use(bodyParser.json()) // json 타입 분석 가능
app.use(cookieParser())

/* 몽고디비 연결 */
var mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function callback() {
  console.log("mongo db connection OK.")
})

/* 포트 설정 */
const port = 5000 // 5000번 포트번호 이용
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

//-------------------------------- 라우터 시작 ----------------------------------------------------

app.get('/', (req, res) => { // '/'루트를 이용하면 hello world 찍어줌
  res.send('Hello World!')
})

/* register 회원가임 라우터 
  클라이언트에서 보내주는 정보를 가져오면 데이터베이스에 넣어준다.
*/
app.post('/api/users/register', (req, res) => {
  const user = new User(req.body)
  user.save((err, doc) => {
    if (err) return res.json({ success: false, err }) //실패했다면 json형식으로 success false와 err메세지 보냄.
    return res.status(200).json({ // 성공했다면 success true 전달
      success: true
    })
  })
})
/* login 라우터 */
app.post('/api/users/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    console.log(req.body.email)
    if (!user) { // user가 없다면
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
    })
    // 비밀번호까지 맞다면 유저를 위한 token 생성
    user.generateToken((err, user) => {
      if (err) return res.status(400).send(err)
      // token을 쿠키에 저장한다.
      res.cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id })
    })
  })
})

/* auth 라우터 */
app.get('/api/users/auth', auth, (req, res) => { // auth 미들웨어
  // 여기까지 왔다는 것은 미들웨어를 모두 통과 (authentication이 true라는 말)
  res.status(200).json({
    _id: req.user._id,  //이렇게 할 수 있는 이유는 auth에서 request에 정보를 넣었기때문에
    isAdmin: req.user.role === 0 ? false : true, //role이 0이면 user
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

/* 로그아웃 라우터 */
app.get('/api/users/logout', auth, (req, res) => {
  console.log(req.body)
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).send({
      success: true
    })
  })
})

app.get('/api/hello', (req, res) => {
  res.send('안녕하세요') //프론트로 res를 줌
})

