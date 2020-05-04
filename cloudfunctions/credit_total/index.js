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
  const arraypro = []
  //定义每次获取的条数
  const MAX_LIMIT = 100
  //先取出集合的总数
  var total = 0
  const count= await db.collection('Credit').where({ _openid: wxContext.OPENID}).count()
    //console.log('Count', res)
    total = count.total;
    console.log('Total', total)
    //计算需要分几次取
    const batchTimes = Math.ceil(total / MAX_LIMIT)
    //承载所有读操作的promise的数组
    //初次循环获取云端数据库的分次数的promise数组
    for (let i = 0; i < batchTimes; i++) {
      var promise = 0
      let res = await db.collection('Credit').where({_openid: wxContext.OPENID}).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
        //console.log('promiseRes', res)
        promise = res
        console.log('promise', promise)
        //二次循环根据获取的promise数组的数据长度获取全部数据push到arraypro数组中
        for (let j = 0; j < promise.data.length; j++) {
          arraypro.push(promise.data[j])
        }
        console.log('arraypro=  ', arraypro)
      }
    var ctotal = 0;
    var ctotal_p = 0;
    var ctotal_g=0;
    for (var i in arraypro) {
     ctotal += arraypro[i].credit_got
    ctotal_p += arraypro[i].credit_p
    ctotal_g+=arraypro[i].orderPrice
    }
    return await db.collection('CreditTotal').doc(event._id).update({
      data: {
        credit_count: ctotal,
        credit_transt: ctotal_p,
        credit_orderPrice:ctotal_g
      }
    })
}