// pages/order/checkout/checkout.js
const db = wx.cloud.database(); //初始化数据库
Page({
  /**
   * 页面的初始数据
   */
  data: {
    order:{},
    order_id:0,
    orderPrice:0,
  },

  listenerTextarea: function (e) {
    var note = e.detail.value
    // 存储note值 
    wx.setStorageSync('note', note)
  },

  pay: function () {
    db.collection('Order').get().then(res=>{
      this.setData({
        order_id:++res.data.length
      })
      db.collection('Order').add({
        data: {
          order_id: this.data.order_id,
          order: this.data.order,
          orderPrice: this.data.orderPrice
        }
      })
    })
    wx.navigateTo({
      url: '/pages/order/detail/detail?order_id'+this.data.order_id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  
    var temppromotion=0;
    wx.showLoading({
      title: '努力加载中'
    })
    db.collection('CartList').where({
      _openid:wx.getStorageSync('_OPENID')
    }).get().then(data => {
      db.collection('programData').get().then(res => {
        if(data.data[0].cartPrice>res.data[0].promotion[0]){
          this.setData({
            promotion:res.data[0].promotion[1],
          })
          temppromotion=res.data[0].promotion[1]
        }
        this.setData({
          order_food: data.data[0].cartList,
          price: data.data[0].cartPrice-temppromotion,
          //另存一份备用，以减少访问云数据库的次数
          order: data.data[0].cartList,
          orderPrice: data.data[0].cartPrice - temppromotion,
        })
      })
      wx.hideLoading()
    }, () => {
      this.onLoad(options)
    })
  },
  comment: function (e) {
    this.data.comment = e.detail.value
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