// pages/list/list.js
const db = wx.cloud.database();//初始化数据库
var categoryHeight = [] // 右列表各分类高度数组
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0,
    tapIndex: 0,
    foodList: [],
    cartList: {},
    cartPrice: 0,
    cartNumber: 0,
    cartBall: {
      show: false,
      x: 0,
      y: 0
    },
    listLength:0,
    showCart: false,
    promotion:{}
  },
  changingCategory: false, // 是否正在切换左侧激活的分类（防止滚动过快时切换迟缓）
  shopcartAnimate: null,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('programData').where({
      _id: 'c0b4c39b-5e84-482f-bf27-57b8b8c900ab'
    }).get().then(res => {
      this.setData({
        promotion: res.data[0].promotion,
        listLength:res.data[0].listLength,
        location:res.data[0].location
      })
    })
    for (var i in data.list) {
      this.setData({
        activeIndex: i
      })
      break
    }
  },

  order: function () {
    wx.navigateTo({
      url: '/pages/order/checkout/checkout',
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