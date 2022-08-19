const Router = require('koa-router')

const {
  verifyAuth,
  verifyPermission
} = require('../middleware/auth.middleware')

const {
  create,
  reply,
  update,
  remove,
  list
} = require('../controller/comment.controller')

const commentRouter = new Router({ prefix: '/comment' })

// 用户发布评论：1.要先登录 2.发布评论
commentRouter.post('/', verifyAuth, create)
// 用户回复某条评论
commentRouter.post('/:commentId/reply', verifyAuth, reply)
// 用户修改评论
commentRouter.patch('/:commentId', verifyAuth, verifyPermission, update)
// 用户删除评论
commentRouter.delete('/:commentId', verifyAuth, verifyPermission, remove)
// 获取评论列表
commentRouter.get('/', list)
module.exports = commentRouter