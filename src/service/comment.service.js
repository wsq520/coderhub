const connection = require('../app/database')

class CommentService {
  async create(momentId, content, userId) {
    const statement = `INSERT into comment (content, moment_id, user_id) VALUES (?,?,?);`
    try {
      const [result] = await connection.execute(statement, [content, momentId, userId])
      return result
    } catch (error) {
      console.log('创建评论出错~')
    }
  }

  async reply(momentId, content, commentId, userId) {
    const statement = `INSERT into comment (content, moment_id, user_id, comment_id) VALUES (?,?,?,?);`
    try {
      const [result] = await connection.execute(statement, [content, momentId, userId, commentId])
      return result
    } catch (error) {
      console.log('回复评论出错~')
    }
  }

  async update(commentId, content) {
    const statement = `UPDATE comment SET content = ? WHERE id = ?;`
    try {
      const [result] = await connection.execute(statement, [content, commentId])
      return result
    } catch (error) {
      console.log('修改评论出错~')
    }
  }

  async remove(commentId) {
    const statement = `DELETE FROM comment WHERE id = ?;`
    try {
      const [result] = await connection.execute(statement, [commentId])
      return result
    } catch (error) {
      console.log('删除评论出错~')
    }
  }

  async getCommentsByMomentId(commentId) {
    const statement = `
      SELECT 
        m.id, m.content, m.comment_id commentId, m.createAt createTime,
        JSON_OBJECT('id', u.id, 'name', u.name) user
      FROM comment m
      LEFT JOIN user u on u.id = m.user_id
      WHERE moment_id = ?;
    `
    try {
      const [result] = await connection.execute(statement, [commentId])
      return result
    } catch (error) {
      console.log('查询动态的所有评论出错~')
    }
  }
}

module.exports = new CommentService()