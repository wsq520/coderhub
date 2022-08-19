const path = require('path')
const Multer = require('koa-multer')
const Jimp = require('jimp')

const { 
  AVATAR_PATH,
  PICTURE_PATH
} = require('../constants/file-path')

// 处理头像上传
const avatarUpload = Multer({
  // 这里的相对路径与项目启动的目录有关
  dest: AVATAR_PATH
})
const avatarHandler = avatarUpload.single('avatar')

// 处理配图上传
const pictureUpload = Multer({
  dest: PICTURE_PATH
})
const pictureHandler = pictureUpload.array('picture', 9)

// 图片大小处理
const pictureResize = async (ctx, next) => {
  // 1.获取所有的图像信息
  const files = ctx.req.files

  // 2.对图像进行处理
  for(let file of files) {
    const destPath = path.join(file.destination, file.filename)
    Jimp.read(file.path).then(image => {
      // 当固定图片高度时 Jimp.AUTO会根据比例设置宽度
      image.resize(1280, Jimp.AUTO).write(`${destPath}-large`)
      image.resize(640, Jimp.AUTO).write(`${destPath}-middle`)
      image.resize(320, Jimp.AUTO).write(`${destPath}-small`)
    })
  }

  await next()
}

module.exports = {
  avatarHandler,
  pictureHandler,
  pictureResize
}