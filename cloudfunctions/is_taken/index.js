// 云函数入口文件
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
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection('Order').doc(event._id).update({
      data: {
        is_taken: event.is_taken,
        taken_time: event.taken_time
      }
    })
  } catch (e) {
    console.error(e)
  }
}