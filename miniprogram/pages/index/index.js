// pages/index/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiper: ["cloud://cloud-103-zifl9.636c-cloud-103-zifl9-1259648286/程序资源/banner_1.png", "cloud://cloud-103-zifl9.636c-cloud-103-zifl9-1259648286/程序资源/banner_2.png", "cloud://cloud-103-zifl9.636c-cloud-103-zifl9-1259648286/程序资源/banner_3.png"],
    ad: "cloud://cloud-103-zifl9.636c-cloud-103-zifl9-1259648286/程序资源/image_ad.png",
    category: ["cloud://cloud-103-zifl9.636c-cloud-103-zifl9-1259648286/程序资源/bottom_1.png", "cloud://cloud-103-zifl9.636c-cloud-103-zifl9-1259648286/程序资源/bottom_2.png", "cloud://cloud-103-zifl9.636c-cloud-103-zifl9-1259648286/程序资源/bottom_3.png", "cloud://cloud-103-zifl9.636c-cloud-103-zifl9-1259648286/程序资源/bottom_1.png"],
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('view.open-type.getUserInfo')
  },
  start: function (e) {
    if (wx.getStorageSync('userinfo')) {
      this.setData({
        userInfo: wx.getStorageSync('userinfo'),
        hasUserInfo: true,
      })
      wx.navigateTo({
        url: '../list/list',
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    if (!wx.getStorageSync('userinfo')) {
      wx.showModal({
        title: '提示',
        content: '您还没有注册',
        showCancel: false,
        confirmText: "确定",
        success: function (res) {
          wx.navigateTo({
            url: '../userlogin/userlogin',
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    wx.navigateTo({
      url: '../userlogin/userlogin',
    })
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { },
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

  },
})