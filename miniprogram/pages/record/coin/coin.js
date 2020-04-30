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
    credit_count:0,
    credit_earn:0,
    credit_trans:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('Credit').where({
      _openid: wx.getStorageSync('_OPENID')
    }).get().then(res => {
      this.setData({
        credit_count:res.data[0].credit_count,
        credit_earn:res.data[0].credit_earn,
        credit_trans:res.data.credit_trans
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})