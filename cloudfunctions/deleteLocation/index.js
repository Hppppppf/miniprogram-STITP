const cloud = require('wx-server-sdk')

//cloud.init()
cloud.init({
  traceUser: true,
  env: 'cloud-103-zifl9'
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection("UserInfo").where({
      _openid:event._openid
    })
      .update({
        data: {
          OrderNum: _.inc(1)
        },
      })
  } catch (e) {
    console.error(e)
  }
}