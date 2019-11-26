// pages/order/detail/detail.js
const db = wx.cloud.database(); //初始化数据库
var util = require('../../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    create_time: '',
    pay_time: '',
    is_taken: false,
    id: "",
    taken_time: '',
    note: '',
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '订单详情'
    })
    var temppromotion = 0
    this.data.id = JSON.parse(options.order_id)

    wx.showLoading({
      title: '加载中',
      mask: true,
    })

    db.collection('Order').where({
      order_id: this.data.id
    }).get().then(data => {
      db.collection('programData').get().then(res => {
        if (data.data[0].orderPrice > res.data[0].promotion[0]) {
          this.setData({
            promotion: res.data[0].promotion[1],
          })
          temppromotion = res.data[0].promotion[1]
        }
        this.setData({
          order_food: data.data[0].order,
          price: data.data[0].orderPrice - temppromotion,
          create_time: data.data[0].create_time,
          pay_time: data.data[0].pay_time,
          is_taken: data.data[0].is_taken,
          taken_time: data.data[0].taken_time,
          note: data.data[0].note,
        })

      })
      var fetchCode
      if (this.data.id < 10) {
        fetchCode = 'A00' + this.data.id
      } else if (this.data.id >= 10 && this.data.id < 100) {
        fetchCode = 'A0' + this.data.id
      } else if (this.data.id >= 100) {
        fetchCode = '' + this.data.id
      }
      this.setData({
        code: fetchCode,
        sn: this.data.id,
        create_time: this.data.create_time,
        pay_time: this.data.pay_time,
        is_taken: this.data.is_taken,
        taken_time: this.data.taken_time,
        note: this.data.note,
      })
      wx.hideLoading()
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
  getfood: function () {
    var time = util.formatTime(new Date());
    this.setData({
      is_taken: true,
      taken_time: time
    })
    db.collection('Order').where({
      order_id: this.data.id
    }).get().then(res => {
      db.collection('Order').doc(res.data[0]._id).update({
        data: {
          is_taken: true,
          taken_time: time
        }
      })
    })
  },
  takefood: function () {

  },
  onShow: function () {

  }
})
