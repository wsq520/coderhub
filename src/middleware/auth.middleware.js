const jwt = require('jsonwebtoken')

const userService = require('../service/user.service')
const authService = require('../service/auth.service')
const md5password = require('../utils/password-handle')
const { PUBLIC_KEY } = require('../app/config')
const errorTypes = require('../constants/error-types')

const verifyLogin = async (ctx, next) => {
  const { name, password } = ctx.request.body
  if (!name || !password) {
    const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED)
    // 发出错误事件
    return ctx.app.emit('error', error, ctx)
  }

  // service.getUserByName(name)[0] 拿到的就是单独的用户信息(当前登录用户的信息)
  const result = await userService.getUserByName(name)
  const user = result[0]
  if (!user) {
    const error = new Error(errorTypes.USER_DOES_NOT_EXISTS)
    return ctx.app.emit('error', error, ctx)
  }

  // 判断密码加密之后是否与数据库存储的密码一样
  if (md5password(password) !== user.password) {
    const error = new Error(errorTypes.PASSWORD_IS_INCORRENT)
    return ctx.app.emit('error', error, ctx)
  }

  // 给ctx添加一个属性叫user 并且将上面拿到用户信息的user赋值给它
  ctx.user = user

  await next()
}

const verifyAuth = async (ctx, next) => {
  console.log('验证授权~')
  // 1.获取token
  const authorization = ctx.headers.authorization
  if (!authorization) {
    const error = new Error(errorTypes.UNAUTHORIZATION)
    return ctx.app.emit('error', error, ctx)
  }
  // 去除多出来的字符串 Bearer 
  const token = authorization.replace('Bearer ', '')
  // console.log(token)
  // 2.验证token
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256']
    })
    ctx.user = result
    await next()
  } catch (error) {
    console.log(error)
    const err = new Error(errorTypes.UNAUTHORIZATION)
    ctx.app.emit('error', err, ctx)
  }
}

// 方法一：动态的检测权限 该方法使用时格式为：verifyPermission(表名) 对哪个表操作就传哪个表名
// const verifyPermission = (tableName) => {
//   return async (ctx, next) => {
//     console.log('验证权限~')

//     // 1.获取参数
//     const { momentId } = ctx.params
//     const { id } = ctx.user

//     // 2.查询是否具备权限
//     try {
//       const isPermission = await authService.checkResource(tableName, momentId, id)
//       if (!isPermission) {
//         console.log('验证发现没权限')
//         throw new Error()
//       }
//       await next()
//     } catch (err) {
//       const error = new Error(errorTypes.UNPERMISSION)
//       return ctx.app.emit('error', error, ctx)
//     }
//   }
// }

const verifyPermission = async (ctx, next) => {
  console.log('验证权限~')

  // 1.获取参数
  const [resourceKey] = Object.keys(ctx.params)
  const tableName = resourceKey.replace('Id', '')
  const resourceId = ctx.params[resourceKey]
  const { id } = ctx.user

  // 2.查询是否具备权限
  try {
    const isPermission = await authService.checkResource(tableName, resourceId, id)
    if (!isPermission) {
      console.log('验证发现没权限')
      throw new Error()
    }
    await next()
  } catch (err) {
    const error = new Error(errorTypes.UNPERMISSION)
    return ctx.app.emit('error', error, ctx)
  }
}


module.exports = {
  verifyLogin,
  verifyAuth,
  verifyPermission
}