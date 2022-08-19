const connection = require('../app/database')

class FileService {
  async createAvatar(filename, mimetype, size, userId) {
    const statement = `INSERT INTO avatar (filename, mimetype, size, user_id) values (?,?,?,?);`
    try {
      const [result] = await connection.execute(statement, [filename, mimetype, size, userId])
      return result
    } catch (error) {
      console.log('上传头像出错~')
    }
  }

  async getAvatarByUserId(userId) {
    const statement = `SELECT * FROM avatar where user_id = ?;`
    try {
      const [result] = await connection.execute(statement, [userId])
      return result.pop()
    } catch (error) {
      console.log('通过用户id查询其头像出错~')
    }
  }

  async createFile(filename, mimetype, size, userId, momentId) {
    const statement = `INSERT INTO file (filename, mimetype, size, user_id, moment_id) 
    values (?,?,?,?,?);`
    try {
      const [result] = await connection.execute(statement, [filename, mimetype, size, userId, momentId])
      return result
    } catch (error) {
      console.log('上传动态配图出错~')
    }
  }

  async getFileByFilename(filename) {
    const statement = `SELECT * FROM file where filename = ?;`
    try {
      const [result] = await connection.execute(statement, [filename])
      return result[0]
    } catch (error) {
      console.log('查询动态配图出错~')
    }
  }
}

module.exports = new FileService()