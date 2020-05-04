// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  traceUser: true,
  env: 'cloud-103-zifl9'
})
const db = cloud.database()
const _ = db.command
//const rp=require('request-promise')
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  var paycredit_orderPrice=0;
  var paycredit_count=0;
      const res = await db.collection('Order').where({ order_id: event.order_id}).get()
        var price=res.data[0].orderPrice+res.data[0].deliveryfee
        console.log('cartPrice= ',price)
          if (event.credit_orderPrice >= price) {
            paycredit_orderPrice=price
          } else {
            paycredit_count = price - event.credit_orderPrice
            paycredit_orderPrice = event.credit_orderPrice
          }
          return await db.collection('CreditPay').add({
            data:{
              _openid:wxContext.OPENID,
              paycredit_count:paycredit_count,
              paycredit_orderPrice:paycredit_orderPrice,
              paytime:event.paytime,
              order_id:event.order_id
            }
          })
        }
}