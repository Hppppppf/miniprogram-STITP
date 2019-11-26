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
      _openid: event._openid,
      'location.index':event.index
    })
      .update({
        data: {
          'location.$.name':event.name,
          'location.$.sex': event.sex,
          'location.$.tel': event.tel,
          'location.$.detail': event.detail,
          'location.$.location': event.location,
        }
      })
  } catch (e) {
    console.error(e)
  }
}