// pages/order/checkout/checkout.js
const db = wx.cloud.database(); //初始化数据库
var util = require('../../../utils/utils.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    order: {},
    order_id: 0,
    orderPrice: 0,
    note: '',
    create_time: '',
    pay_time: '',
    number: 0,
    is_taken: false,
    currentWordNumber: 0
  },
  /*
    listenerTextarea: function (e) {
      var note = e.detail.value
      // 存储note值 
      wx.setStorageSync('note', note)
    },
  */
  pay: function() {
    console.log("note:" + this.data.note)
    var time = util.formatTime(new Date());
    db.collection('programData').get().then(res => {
      this.setData({
        order_id: ++res.data[0].OrderNum,
        pay_time: time
      })
      wx.cloud.callFunction({
        name: 'OrderNum',
      })
      db.collection('Order').add({
        data: {
          order_id: this.data.order_id,
          order: this.data.order,
          orderPrice: this.data.orderPrice,
          note: this.data.note,
          create_time: this.data.create_time,
          number: this.data.number,
          pay_time: this.data.pay_time,
          is_taken: false,
        }
      })
      console.log('order_id', this.data.order_id)
      wx.redirectTo({
        url: '/pages/order/detail/detail?order_id=' + this.data.order_id
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.cloud.init({
      traceUser: true,
      env: 'cloud-103-zifl9'
    })
    var temppromotion = 0;
    wx.showLoading({
      title: '努力加载中'
    })
    var time = util.formatTime(new Date());
    /*wx.getLocation({
      success: function(res) {
        db.collection('UserInfo').where({
          _openid:wx.getStorageSync('_OPENID')
        }).get().then(res=>{
            //此处用于自动匹配已存地址。。。。还不知道咋写，先注释掉
        })
      },
    })*/
    db.collection('CartList').doc(wx.getStorageSync('_OPENID')).get().then(data => {
      console.log('Data', data)
      db.collection('programData').get().then(res => {
        if (data.data.cartPrice > res.data[0].promotion[0]) {
          this.setData({
            promotion: res.data[0].promotion[1],
          })
          temppromotion = res.data[0].promotion[1]
        }
        this.setData({
          order_food: data.data.cartList,
          price: data.data.cartPrice - temppromotion,
          //另存一份备用，以减少访问云数据库的次数
          order: data.data.cartList,
          orderPrice: data.data.cartPrice - temppromotion,
          number: data.data.cartNumber,
          create_time: time,
        })
      })
      wx.hideLoading()
    }, () => {
      this.onLoad(options)
    })
  },
  comment: function(e) {
    this.data.note = e.detail.value
    console.log(this.data.note)
  },

  /****限制字数与计算 */
  getValueLength: function(e) {
    let value = e.detail.value
    let len = parseInt(value.length)
    //最多字数限制
    if (len > 40) return;
    this.setData({
      currentWordNumber: len //当前字数 
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
    db.collection('CartList').doc(wx.getStorageSync('_OPENID')).remove()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

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