const jwt = require('jsonwebtoken')
const { PRIVATE_KEY } = require('../app/config')

class AuthController {
  async login(ctx, next) {
    const { id, name } = ctx.user
    // 颁发签名
    const token = jwt.sign({ id, name }, PRIVATE_KEY, {
      // 一天后过期
      expiresIn: 60 * 60 * 24,
      algorithm: 'RS256'
    })

    ctx.body = {
      id,
      name,
      token
    }
    console.log('欢迎用户' + name + '回来~')
  }

  async success(ctx, next) {
    ctx.body = '授权了'
  }
}

module.exports = new AuthController()