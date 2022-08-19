const fs = require('fs')

const useRoutes = function () {
  // readdirSync(__dirname) 读取当前文件所在目录下的所有文件 返回的是一个数组
  fs.readdirSync(__dirname).forEach(file => {
    if (file === 'index.js') {
      return
    }
    const router = require(`./${file}`)
    this.use(router.routes())
    this.use(router.allowedMethods())
  })
}

module.exports = useRoutes