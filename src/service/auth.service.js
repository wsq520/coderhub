const connection = require('../app/database')

class AuthService {
  async checkResource(tableName, id, userId) {
    try {
      const statement = `SELECT * FROM ${tableName} WHERE id = ? AND user_id = ?;`
      const [result] = await connection.execute(statement, [id, userId])
      // 如果当前登录用户的id和发布该动态的用户id不一致 那么返回的就是个空的数组
      return result.length === 0 ? false : true
    } catch (error) {
      console.log('checkResource出错~')
    }
  }
}

module.exports = new AuthService()