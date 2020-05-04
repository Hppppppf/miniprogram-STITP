// miniprogram/pages/record/coin/coin.js
const app = getApp();
const db = wx.cloud.database(); //初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isProup: false,
    height: app.globalData.height,
    credit_total: 0,
    credit_earn: {},
    credit_trans: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    db.collection('CreditPayTotal').where({
      _openid: wx.getStorageSync('_OPENID')
    }).get().then(res => {
      if (res.data.length <= 0) {
        db.collection('CreditPayTotal').add({
          data: {
            paycredit_count: 0,
            paycredit_orderPrice: 0
          }
        })
      }
    })

    wx.cloud.callFunction({
      name: 'jfpay_total'
    })
    db.collection('CreditPayTotal').where({
      _openid: wx.getStorageSync('_OPENID')
    }).get().then(res => {
      const paycredit_count = res.data[0].paycredit_count;
      const paycredit_orderPrice = res.data[0].paycredit_orderPrice;
      db.collection('CreditTotal').where({
        _openid: wx.getStorageSync('_OPENID')
      }).get().then(res => {
        wx.cloud.callFunction({
          name: 'credit_total',
          data: {
            _id: res.data[0]._id,
          }
        })
      })
      db.collection('CreditTotal').where({
        _openid: wx.getStorageSync('_OPENID')
      }).get().then(res => {
        this.setData({
          credit_total: res.data[0].credit_count + res.data[0].credit_orderPrice + res.data[0].credit_transt - paycredit_count - paycredit_orderPrice,
          credit_earn: res.data[0].credit_count + res.data[0].credit_transt - paycredit_count,
          credit_trans: res.data[0].credit_transt,
        })
      })
    })
  },

  pageTo: function() {
    wx.navigateTo({
      url: './detaillist',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log("下拉刷新")
    this.onLoad()
    setTimeout(function() {
      wx.stopPullDownRefresh()
    }, 1000) //延迟时间 这里是1秒


  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})