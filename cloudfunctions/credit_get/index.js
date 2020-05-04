// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  traceUser: true,
  env: 'cloud-103-zifl9'
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
  console.log(event)
  const wxContext = cloud.getWXContext()
  try {
    //return await 
    /*db.collection('Order').where({
      order_id: event.order_id,
    }).get().then(res => {
      var credit=res.data[0].deliveryfee
      if (res.data[0].order_taken&&!res.data[0].is_taken) 
      {
        console.log('credit=',res.data)
        db.collection('Credit').doc(event._id).update({
          data: {
            credit_p: res.data[0].deliveryfee,
          },
        }).then(res=>{
          console.log('addcredit',res)
        })
      }
      if(res.data[0].order_taken&&res.data[0].is_taken){
        console.log('creditupdate',credit)
        db.collection('Credit').doc(event._id).updata({
          data:{
            credit_p:0,
            credit_got: res.data[0].deliveryfee,
          },
        })
      }
    })*/

     const res= await cloud.callFunction({
       name:'deliveryfee_get',
       data:{
         order_id:event.order_id
       }
     }) 
      console.log('callfunction=', res.result.data[0])
      var deliveryfee = res.result.data[0].deliveryfee
      var order_taken = res.result.data[0].order_taken
      var is_taken = res.result.data[0].is_taken
      var orderPrice=res.result.data[0].orderPrice
      if (order_taken && !is_taken) {
       return await db.collection('Credit').doc(event._id).update({
          data: {
            credit_p: deliveryfee,
          },
        }).then(res => {
          console.log('addcredit', res)
        })
      }
      if (order_taken && is_taken) {
        console.log('creditupdate', deliveryfee)
       return await db.collection('Credit').doc(event._id).update({
          data: {
            credit_p: 0,
            credit_got: deliveryfee,
            orderPrice:orderPrice
          },
        })
      }
  } catch (e) {
    console.error(e)
  }

}