const connection = require('../app/database')

// 将相同部分的sql语句抽取出来
const sqlFragment = `
  SELECT 
    m.id id, m.content content, m.createAt creatTime, m.updateAt updateTime,
    JSON_OBJECT('id', u.id, 'name', u.name) author
  FROM moment m
  LEFT JOIN user u on m.user_id = u.id
`

class MomentService {
  async create(userId, content) {
    const statement = `INSERT INTO moment (content, user_id) VALUES (?,?);`
    try {
      const result = await connection.execute(statement, [content, userId])
      return result[0]
    } catch (error) {
      console.log('创建动态出错~')
    }
  }

  async getMomentById(momentId) {
    const statement = `
      SELECT 
        m.id id, m.content content, m.createAt creatTime, m.updateAt updateTime,
        JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url) author,
        IF(COUNT(l.id),JSON_ARRAYAGG(
          JSON_OBJECT('id', l.id, 'name', l.name)
        ),null) labels,
        (SELECT IF(COUNT(c.id),JSON_ARRAYAGG(
          JSON_OBJECT('id', c.id, 'content', c.content, 'commentId', c.comment_id, 'createTime', c.createAt,
                      'user', JSON_OBJECT('id', cu.id, 'name', cu.name, 'avatarUrl', cu.avatar_url))
        ), NULL) FROM comment c LEFT JOIN user cu on c.user_id = cu.id WHERE m.id = c.moment_id) comments,
        (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8000/moment/images/', file.filename)) 
        FROM file WHERE m.id = file.moment_id) images
      FROM moment m
      LEFT JOIN user u on m.user_id = u.id
      LEFT JOIN moment_label ml on m.id = ml.moment_id
      LEFT JOIN label l on ml.label_id = l.id
      WHERE m.id = ?
      GROUP BY m.id
    `
    try {
      const [result] = await connection.execute(statement, [momentId])
      return result[0]
    } catch (error) {
      console.log('获取单个动态详情出错~')
      console.log(error)
    }
  }

  async getMomentList(offset, size) {
    const statement = `
      SELECT 
        m.id id, m.content content, m.createAt creatTime, m.updateAt updateTime,
        JSON_OBJECT('id', u.id, 'name', u.name) author,
        (SELECT COUNT(*) FROM comment c WHERE c.moment_id = m.id) commentCount,
        (SELECT COUNT(*) FROM moment_label ml WHERE ml.moment_id = m.id) labelCount,
        (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8000/moment/images/', file.filename)) 
        FROM file WHERE m.id = file.moment_id) images
      FROM moment m
      LEFT JOIN user u on m.user_id = u.id
      LIMIT ?,?;
    `
    try {
      const [result] = await connection.execute(statement, [offset, size])
      return result
    } catch (error) {
      console.log('获取动态列表出错~')
    }
  }

  async update(content, momentId) {
    const statement = `UPDATE moment SET content = ? WHERE id = ?;`
    try {
      const [result] = await connection.execute(statement, [content, momentId])
      return result
    } catch (error) {
      console.log('更新动态内容出错')
    }
  }

  async remove(momentId) {
    const statement = `DELETE FROM moment WHERE id = ?;`
    try {
      const [result] = await connection.execute(statement, [momentId])
      return result
    } catch (error) {
      console.log('删除动态出错~')
    }
  }
  // 查看目前新增的标签是否之前已经被添加到该动态
  async hasLabel(momentId, labelId) {
    const statement = `SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?;`
    try {
      const [result] = await connection.execute(statement, [momentId, labelId])
      return result[0] ? true : false
    } catch (error) {
      console.log('查询新增的标签是否早已被添加到当前动态出错~')
    }
  }

  async addLabels(momentId, labelId) {
    const statement = `INSERT INTO moment_label (moment_id, label_id) VALUES(?, ?);`
    try {
      const [result] = await connection.execute(statement, [momentId, labelId])
      return result
    } catch (error) {
      console.log('插入新增标签出错~')
    }
  }
}

module.exports = new MomentService()