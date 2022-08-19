const Koa = require('koa')
const bodyParser = require('koa-bodyparser')

const useRoutes = require('../router/index')
const errorHandler = require('./error-handle')

const app = new Koa()
app.useRoutes = useRoutes

app.use(bodyParser())
app.useRoutes()

// 处理抛出的错误事件
app.on('error', errorHandler)

module.exports = app