const service = require('../service/label.service')

const verifyLabelExists = async (ctx, next) => {
  //1.获取要添加的所有标签
  const { labels } = ctx.request.body
  
  // 2.判断每一个标签是否都存在
  const newLables = []
  for (let name of labels) {
    // 查询当前要添加的标签是否存在
    const labelResult = await service.getLabelByName(name)
    const label = { name }
    if (!labelResult) {
      // 1.如果要添加的标签不存在，那么创建标签
      const result = await service.create(name)
      label.id = result.insertId
    } else {
      label.id = labelResult.id
    }
    newLables.push(label)
  }
  // newLables里的标签就是最终需要添加的标签
  ctx.labels = newLables

  await next()
}

module.exports = {
  verifyLabelExists
}