// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  traceUser: true,
  env: 'cloud-103-zifl9'
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try{
    
    return await db.collection('CreditTotal').doc(event._id).update({
      data:{
        credit_count:event.credit_count,
        credit_orderPrice:event.credit_orderPrice,
      }
    })
  }catch(e){
    console.log(e)
  }
}