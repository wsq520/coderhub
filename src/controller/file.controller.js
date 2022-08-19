const fileService = require('../service/file.service')
const userService = require('../service/user.service')

const { AVATAR_PATH } = require('../constants/file-path')

const { APP_HOST, APP_PORT } = require('../app/config')

class FileController {
  async saveAvatarInfo(ctx, next) {
    // 1.获取图像信息
    // console.log(ctx.req.file)
    const { filename, mimetype, size } = ctx.req.file
    const { id } = ctx.user

    // 2.将用户信息及头像信息上传到数据库
    const result = await fileService.createAvatar(filename, mimetype, size, id)

    // 3.将图像地址保存到用户表中
    const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`
    await userService.updateAvatarUrlById(avatarUrl, id)

    ctx.body = '用户上传头像成功'
  }

  async savePictureInfo(ctx, next) {
    // 1.获取图片信息
    const files = ctx.req.files
    const { id } = ctx.user
    const { momentId } = ctx.query
   
    // 2.将所有的文件信息保存到数据库中
    for (let file of files) {
      const { filename, mimetype, size } = file
      await fileService.createFile(filename, mimetype, size, id, momentId)
    }

    ctx.body = '动态上传配图成功'
  }
}

module.exports = new FileController()