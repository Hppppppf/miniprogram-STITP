// miniprogram/pages/record/location/location.js
const db = wx.cloud.database(); //初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    haveLocation: true,
    locationList: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...',
    })
    db.collection('UserInfo').where({
      _openid: wx.getStorageSync('_OPENID')
    }).get().then(res => {
      if (res.data[0].location.length != 0) {
        console.log(res.data[0].location)
        this.setData({
          locationList: res.data[0].location
        })
      } else {
        this.setData({
          haveLocation: false
        })
      }
      wx.hideLoading()
    })

  },
  modifyLocation(e) {
    wx.navigateTo({
      url: 'setLocation/setLocation?index=' + e.currentTarget.dataset.index,
    })
  },

  addLocation:function(e){
    wx.navigateTo({
      url: '/pages/userlogin/register?isAdd='+true,
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
    this.onLoad()
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
    setTimeout(function () {
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