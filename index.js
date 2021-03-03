const express = require('express') //express 모듈을 가져옴
const { request } = require('../backend/app')
const app = express() //function을 이용해서 새로운 app을 이용
const port = 5000 // 5000번 포트번호 이용
const bodyParser = require('body-parser')

const config = require('./config/key')

const { User } = require('./models/User')

//application/x-www-form-ur~ 타입 분석 가능
app.use(bodyParser.urlencoded({ extended: true }))
// json 타입 분석 가능
app.use(bodyParser.json())

/* 몽고디비 연결 */
var mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function callback() {
  console.log("mongo db connection OK.")
})

app.get('/', (req, res) => { // '/'루트를 이용하면 hello world 찍어줌
  res.send('Hello World!')
})

app.post('/register', (req, res) => {
  // 회원가입할때 클라이언트에서 보내주는 이름과 패스워드 등의 정보를 가져오면
  // 그것들을 데이터베이스에 넣어준다.
  const user = new User(req.body) // 리퀘스트바디에 들어있는 정보를 bodyParser를 이용해서 받아옴
  user.save((err, doc) => {// 몽고디비의 메소드
    if (err) return res.json({ success: false, err }) //실패했다면 json형식으로 success false와 err메세지 보냄.
    return res.status(200).json({ // 성공했다면 success true 전달
      success: true
    })
  })

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})