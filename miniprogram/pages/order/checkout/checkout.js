// pages/order/checkout/checkout.js
const db = wx.cloud.database(); //初始化数据库
var util = require('../../../utils/utils.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    order:{},
    order_id:0,
    orderPrice:0,
    note:'',
    create_time:'',
    pay_time:'',
    number:0,
    is_taken:false
  },
/*
  listenerTextarea: function (e) {
    var note = e.detail.value
    // 存储note值 
    wx.setStorageSync('note', note)
  },
*/
  pay: function () {
    db.collection('CartList').doc(wx.getStorageSync('_OPENID')).remove().then(res => {
      console.log('remove  ', res)
    })
    var time = util.formatTime(new Date());
    db.collection('Order').get().then(res=>{
      this.setData({
        order_id:++res.data.length,
        pay_time:time
      })
      db.collection('Order').add({
        data: {
          order_id: this.data.order_id,
          order: this.data.order,
          orderPrice: this.data.orderPrice,
          note:this.data.note,
          create_time:this.data.create_time,
          number:this.data.number,
          pay_time:this.data.pay_time,
          is_taken:false,
        }
      })
      wx.redirectTo({
        url: '/pages/order/detail/detail?order_id=' + this.data.order_id
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  
    wx.cloud.init({
      traceUser: true,
      env: 'cloud-103-zifl9'
    })
    var temppromotion=0;
    wx.showLoading({
      title: '努力加载中'
    })
    var time = util.formatTime(new Date());
    db.collection('CartList').doc(wx.getStorageSync('_OPENID')).get().then(data => {
      db.collection('programData').get().then(res => {
        if(data.data.cartPrice>res.data[0].promotion[0]){
          this.setData({
            promotion:res.data[0].promotion[1],
          })
          temppromotion=res.data[0].promotion[1]
        }
        this.setData({
          order_food: data.data.cartList,
          price: data.data.cartPrice-temppromotion,
          //另存一份备用，以减少访问云数据库的次数
          order: data.data.cartList,
          orderPrice: data.data.cartPrice - temppromotion,
          number:data.data.cartNumber,
          create_time:time,
        })
      })
      wx.hideLoading()
    }, () => {
      this.onLoad(options)
    })
  },
  comment: function (e) {
    this.data.note = e.detail.value
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