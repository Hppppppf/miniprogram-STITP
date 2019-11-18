// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: 'cloud-103-zifl9',
  traceUser:true
})

const db = cloud.database(); //初始化数据库
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('Order').where({
      number: event.ID
    })
      .update({
        data: {
          is_taken: true
        }
  })
  }catch (e) {
    console.error(e)
  }
}