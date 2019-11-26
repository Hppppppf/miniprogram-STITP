const cloud = require('wx-server-sdk')

//cloud.init()
cloud.init({
  traceUser: true,
  env: 'cloud-103-zifl9'
})
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  console.log(event)
  try {
    return await db.collection('programData').where({
      _id: "c0b4c39b-5e84-482f-bf27-57b8b8c900ab"
    }).update({
      data: {
        orderNum: _.inc(1)
      },
    })
  } catch (e) {
    console.error(e)
  }
}