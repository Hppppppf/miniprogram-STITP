const cloud = require('wx-server-sdk')
const md5 = require('md5-node')

//cloud.init()
cloud.init({
  traceUser: true,
  env: 'cloud-103-zifl9'
})
const db = cloud.database()
const usersTable = db.collection("UserInfo")
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  try {
    return await db.collection('UserInfo').where({
      _openid: cloud.getWXContext().OPENID
    }).get().then(res => {
      return res
    })
  } catch (e) {
    console.error(e)
  }
}

