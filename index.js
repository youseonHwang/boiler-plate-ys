const express = require('express') //express 모듈을 가져옴
const { request } = require('../backend/app')
const app = express() //function을 이용해서 새로운 app을 이용
const port = 5000 // 5000번 포트번호 이용


/* mongoose, body-parser를 불러옵니다. */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/testdb');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log("mongo db connection OK.");
});

app.get('/', (req, res) => { // '/'루트를 이용하면 hello world 찍어줌
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})