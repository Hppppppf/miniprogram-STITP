// pages/order/detail/detail.js
const db = wx.cloud.database(); //初始化数据库
var util = require('../../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  }, onLoad: function (options) {
    // 取出缓存的note值
    //var note = wx.getStorageSync('note')
    wx.setNavigationBarTitle({
      title: '订单详情'
    })
    var temppromotion=0
    console.log('options.id=',options.order_id)
    var id=JSON.parse(options.order_id)
    db.collection('Order').where({
      order_id:id
      }).get().then(data=> {
      db.collection('programData').get().then(res => {
        console.log('data=    ',data)
        if (data.data[0].orderPrice > res.data[0].promotion[0]) {
          this.setData({
            promotion: res.data[0].promotion[1],
          })
          temppromotion = res.data[0].promotion[1]
        }
        this.setData({
          order_food: data.data[0].order,
          price: data.data[0].orderPrice - temppromotion,
        })
      })
    })

    var time = util.formatTime(new Date());
    var fetchCode
    if(id<10){
      fetchCode='A00'+id
    }else if(id>=10&&id<100){
      fetchCode='A0'+id
    }else if(id>=100){
      fetchCode=''+id
    }
    this.setData({
      code:fetchCode,
      sn:id,
      create_time:time,
      pay_time:time
    })
  },
  onUnload: function () {
    var app = getApp();
    // 支付成功之后调到订单页面，通知订单页刷新
    app.isReloadOrderList = true
    wx.switchTab({
      url: '/pages/order/list/list'
    })
  }
})