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
  const wxContext = cloud.getWXContext()
  const arraypro = []
  //定义每次获取的条数
  const MAX_LIMIT = 100
  //先取出集合的总数
  var total = 0
  const count = await db.collection('CreditPay').where({
    _openid: wxContext.OPENID
  }).count()
  //console.log('Count', res)
  total = count.total;
  console.log('Total', total)
  //计算需要分几次取
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  //承载所有读操作的promise的数组
  //初次循环获取云端数据库的分次数的promise数组
  for (let i = 0; i < batchTimes; i++) {
    var promise = 0
    let res = await db.collection('CreditPay').where({
      _openid: wxContext.OPENID
    }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    //console.log('promiseRes', res)
    promise = res
    console.log('promise', promise)
    //二次循环根据获取的promise数组的数据长度获取全部数据push到arraypro数组中
    for (let j = 0; j < promise.data.length; j++) {
      arraypro.push(promise.data[j])
    }
    console.log('arraypro=  ', arraypro)
  }
  var ccount = 0;
  var corderPrice = 0;
  for (var i in arraypro) {
    ccount += arraypro[i].paycredit_count;
    corderPrice += arraypro[i].paycredit_orderPrice
  }
  return await db.collection('CreditPayTotal').where({
    _openid: wxContext.OPENID
  }).update({
    data: {
      paycredit_count: ccount,
      paycredit_orderPrice: corderPrice
    }
  })
}