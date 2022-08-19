const Router = require('koa-router')

const {
  create,
  detail,
  list,
  update,
  remove,
  addLabels,
  fileInfo
} = require('../controller/moment.controller')

const {
  verifyAuth,
  verifyPermission
} = require('../middleware/auth.middleware')

const {
  verifyLabelExists
} = require('../middleware/label.middleware')

const momentRouter = new Router({ prefix: '/moment' })

momentRouter.post('/', verifyAuth, create)
momentRouter.get('/', list)
momentRouter.get('/:momentId', detail)

// 用户更新动态内容的条件：1.用户必须先登录 2.用户具备修改权限
momentRouter.patch('/:momentId', verifyAuth, verifyPermission, update)

// 用户删除动态
momentRouter.delete('/:momentId', verifyAuth, verifyPermission, remove)

// 给动态添加标签
momentRouter.post('/:momentId/labels', verifyAuth, verifyPermission, verifyLabelExists, addLabels)

// 动态配图
momentRouter.get('/images/:filename', fileInfo)

module.exports = momentRouter
