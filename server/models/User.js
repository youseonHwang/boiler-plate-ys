const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10; // salt를 만들때 10자리 수로 만든다.
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true, // 빈칸을 없애주는 역할
    unique: 1
  },
  password: {
    type: String,
    minlength: 5
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token: {
    type: String
  },
  tokenExp: {
    type: Number
  }
})

// 유저 정보를 저장하기 전에 
userSchema.pre('save', function (next) {
  var user = this

  // 비밀번호를 바꿀때만 동작하도록 (db에 기록된 값과 비교해서 변경된 경우 true를, 그렇지 않은 경우 false를 반환하는 함수)
  if (user.isModified('password')) {
    // 비밀번호 암호화
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err) // 에러발생시 err로 보내줌
      bcrypt.hash(user.password, salt, function (err, hash) { // salt를 제대로 생성했다면 
        if (err) return next(err)
        user.password = hash // hash는 암호화 된 상태의 비밀번호기 때문에 user에 담긴 password를 hash로 바꿔줌.
        next() //next function으로
      })
    })
  } else { // 비밀번호 바꾸는 것이 아니라면
    next()
  }
})

// 비밀번호가 맞는지 확인하는 메소드
userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err),
      cb(null, isMatch)
  })
}

// jwt를 이용해서 토큰 생성하는 메소드
userSchema.methods.generateToken = function (cb) {
  var user = this

  var token = jwt.sign(user._id.toHexString(), 'secretToken')

  user.token = token
  user.save(function (err, user) {
    if (err) return cb(err)
    cb(null, user)
  })
}

// 토큰을 이용해서 user 찾기 메소드 
userSchema.statics.findByToken = function (token, cb) {
  var user = this;
  //토큰을 디코드 한다.
  jwt.verify(token, 'secretToken', function (err, decoded) {
    //유저 아이디를 통해 유저를 찾은 다음에 토큰들을 서로 비교
    user.findOne({ "_id": decoded, "token": token }, function (err, user) {
      if (err) return cb(err) // Error happened and passed as first argument
      cb(null, user) // no error so we pass in null

    })
  })
}
const User = mongoose.model('User', userSchema)

module.exports = { User } // user를 모듈로해서 모두가 쓸 수 있도록