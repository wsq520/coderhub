const connection = require('../app/database')

class LabelService {
  async create(name) {
    const statement = `INSERT INTO label (name) values (?);`
    try {
      const [result] = await connection.execute(statement, [name])
      return result
    } catch (error) {
      console.log('创建标签出错~')
    }
  }

  async getLabelByName(name) {
    const statement = `SELECT * FROM label WHERE name = ?;`
    try {
      const [result] = await connection.execute(statement, [name])
      return result[0]
    } catch (error) {
      console.log('通过新增标签名查询该标签是否存在出错~')
    }
  }

  async getLabels(limit, offset) {
    const statement = `SELECT * FROM label LIMIT ?, ?;`
    try {
      const [result] = await connection.execute(statement, [offset, limit])
      return result
    } catch (error) {
      console.log('获取所有标签出错~')
    }
  }
}

module.exports = new LabelService()