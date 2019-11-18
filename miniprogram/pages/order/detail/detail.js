// pages/order/detail/detail.js
const db = wx.cloud.database(); //初始化数据库
var util = require('../../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    create_time:'',
    pay_time:'',
    is_taken:false,
    id:"",
  }, 
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '订单详情'
    })
    var temppromotion=0
    console.log('options.id=',options.order_id)
    this.data.id=JSON.parse(options.order_id)
    db.collection('Order').where({
      order_id:this.data.id
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
          comment:data.data[0].note,
          order_food: data.data[0].order,
          price: data.data[0].orderPrice - temppromotion,
          create_time:data.data[0].create_time,
          pay_time:data.data[0].pay_time,
          is_taken:data.data[0].is_taken,
        })
      })
    })
    var fetchCode
    if (this.data.id<10){
      fetchCode = 'A00' + this.data.id
    } else if (this.data.id>=10&&id<100){
      fetchCode = 'A0' + this.data.id
    } else if (this.data.id>=100){
      fetchCode = '' + this.data.id
    }
    this.setData({
      code:fetchCode,
      sn: this.data.id,
      create_time:this.data.create_time,
      pay_time:this.data.pay_time,
      is_taken:this.data.is_taken
    })
  },
  onUnload: function () {
    var app = getApp();
    // 支付成功之后调到订单页面，通知订单页刷新
    app.isReloadOrderList = true
    wx.switchTab({
      url: '/pages/order/list/list'
    })
  },
  getfood:function(){
    var id1 = this.data.id
    this.setData({
      is_taken:true
    })
    wx.cloud.callFunction({
      name:'gotfood',
      data:{
        ID: id1,
      },
      success: function (res) {
        console.log(res)
      },
    })
  }
})
