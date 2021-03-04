if (process.env.NODE_ENV === 'production') {//development 모드일때
  module.exports = require('./prod')
} else {
  module.exports = require('./dev')
}