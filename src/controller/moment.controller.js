const fs = require('fs')
const fileService = require('../service/file.service')
const momentService = require('../service/moment.service')

const {
  PICTURE_PATH
} = require('../constants/file-path')

class MomentController {
  async create(ctx, next) {
    // 1.获取数据
    const userId = ctx.user.id
    const content = ctx.request.body.content

    // 2.将数据插入数据库
    const result = await momentService.create(userId, content)
    ctx.body = result
  }

  // 获取某一条动态的详情
  async detail(ctx, next) {
    // 1.获取id
    const momentId = ctx.params.momentId

    // 2.根据id查询该动态数据
    const result = await momentService.getMomentById(momentId)
    ctx.body = result
  }

  async list(ctx, next) {
    // 1.获取数据(传递参数有：偏移量、条数)
    // 请求格式： {{baseURL}}/moment?offset=0&size=10
    const { offset, size } = ctx.query

    // 2.查询列表数据
    const result = await momentService.getMomentList(offset, size)
    ctx.body = result
  }

  async update(ctx, next) {
    // 1.获取要修改的动态的id
    const { momentId } = ctx.params
    // 获取修改之后的内容
    const { content } = ctx.request.body

    // 2.修改内容
    const result = await momentService.update(content, momentId)
    ctx.body = result
  }

  async remove(ctx, next) {
    // 1.获取删除的动态的id
    const { momentId } = ctx.params

    // 2.删除内容
    const result = await momentService.remove(momentId)
    ctx.body = result
  }

  async addLabels(ctx, next) {
    // 1.获取添加的标签和动态的id
    const { labels } = ctx
    const { momentId } = ctx.params

    // 2.添加所有标签
    for (let label of labels) {
      // 判断当前新增标签是否早已被添加到动态上
      const isExist = await momentService.hasLabel(momentId, label.id)
      if (!isExist) {
        await momentService.addLabels(momentId, label.id)
      }
    }

    ctx.body = '动态添加标签成功~'
  }

  async fileInfo(ctx, next) {
    let { filename } = ctx.params
    const fileInfo = await fileService.getFileByFilename(filename)
    // 获取这次请求拿的是哪个尺寸的图片
    const { type } = ctx.query
    const types = ['small', 'middle', 'large']
    if (types.some(item => item === type)) {
      filename = filename + '-' + type
    }
    ctx.response.set('content-type', fileInfo.mimetype)
    ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`)
  }
}

module.exports = new MomentController()