const dotenv = require('dotenv')
const fs = require('fs')
const path = require('path')

// 将 .env配置信息写入到 process.env里面
dotenv.config()

// 读取密钥和公钥
const PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, './keys/private.key'))
const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, './keys/public.key'))

// 将process.env里面的内容解构出来在导出
module.exports = {
  APP_HOST,
  APP_PORT,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD
} = process.env

// 给导出的对象再添加两个属性
module.exports.PRIVATE_KEY = PRIVATE_KEY
module.exports.PUBLIC_KEY = PUBLIC_KEY