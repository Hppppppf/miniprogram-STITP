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
  console.log(event)
  var index = event.index
  try {
    return await db.collection('UserInfo').where({
      _openid: event._openid
    })
      .update({
        data: {
          'location.index.name':event.name,
          'location.index.sex': event.sex,
          'location.index.tel': event.tel,
          'location.index.detail': event.detail,
          'location.index.location': event.location,
        }
      })
  } catch (e) {
    console.error(e)
  }
}