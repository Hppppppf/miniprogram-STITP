// pages/order/list/list.js
const db = wx.cloud.database(); //初始化数据库
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_last:false,
    whichorder:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.clickmyorder()
  },

  detail: function(e) {
    if (this.data.whichorder)
    {
      wx.navigateTo({
        url: '../detail/detail?order_id=' + e.target.dataset.order_id,
      })
    }
    else
    {
      wx.navigateTo({
        url: '../detail2/detail2?order_id=' + e.target.dataset.order_id,
      })
    }
    
  },

  clickmyorder:function(e){
    this.setData({
      whichorder:true,
      is_last:true
    })
    db.collection('Order').where({
      _openid: wx.getStorageSync('_OPENID')
    }).get().then(res => {
      if (res.data.length <= 0) {
        this.data.is_last = true;
      }
      console.log(res.data.order)
      this.setData({
        order: res.data,
        is_last: this.data.is_last,
      })
    })
  },
  clickallorder: function (e) {
    this.setData({
      whichorder:false,
      is_last:false,
    })
    db.collection('Order').get()
      .then(res => {
        if (res.data.length<=0||res.data[res.data.length - 1].order_id == res.data.length) {
          this.data.is_last = true;
        }
        this.setData({
          order: res.data,
          is_last: this.data.is_last
        })
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