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
  try {
    return await db.collection('Order').where({
      order_id: event.order_id,
    })
      .update({
        data: {
          'latitude': event.latitude,
          'longitude':event.longitude,
        }
      })
  } catch (e) {
    console.error(e)
  }
}