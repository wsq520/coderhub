// nodoe内置模块
const crypto = require('crypto')

const md5password = (password) => {
  // crypto.createHash('md5') 返回的是一个md5对象
  const md5 = crypto.createHash('md5')
  // md5.update(password) 返回的是个对象
  // digest() 拿到的结果是二进制的(Buffer)
  // digest('hex')获取的结果是16进制
  const result = md5.update(password).digest('hex')

  return result
}

module.exports = md5password