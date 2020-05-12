// pages/index/index.js
const app = getApp();
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiper: [
      "cloud://cloud-103-zifl9.636c-cloud-103-zifl9-1259648286/程序资源/banner2.png",
      "cloud://cloud-103-zifl9.636c-cloud-103-zifl9-1259648286/程序资源/banner3.png",
      "cloud://cloud-103-zifl9.636c-cloud-103-zifl9-1259648286/程序资源/banner4.png",
      "cloud://cloud-103-zifl9.636c-cloud-103-zifl9-1259648286/程序资源/banner5.png",
      "cloud://cloud-103-zifl9.636c-cloud-103-zifl9-1259648286/程序资源/banner6.png",
      "cloud://cloud-103-zifl9.636c-cloud-103-zifl9-1259648286/程序资源/banner7.png",
    ],
    ad: "cloud://cloud-103-zifl9.636c-cloud-103-zifl9-1259648286/程序资源/banner1.png",
    category: ["cloud://cloud-103-zifl9.636c-cloud-103-zifl9-1259648286/程序资源/bot4.png",
     "cloud://cloud-103-zifl9.636c-cloud-103-zifl9-1259648286/程序资源/bot3.png",
      "cloud://cloud-103-zifl9.636c-cloud-103-zifl9-1259648286/程序资源/bot2.png", 
      "cloud://cloud-103-zifl9.636c-cloud-103-zifl9-1259648286/程序资源/bot5.png"],
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('view.open-type.getUserInfo')
  },
  start: function(e) {
    /*
    if (wx.getStorageSync('userinfo')) {
      this.setData({
        userInfo: wx.getStorageSync('userinfo'),
        hasUserInfo: true,
      })
      wx.navigateTo({
        url: '../list/list',
      })
    } */
    db.collection('UserInfo').where({
      _openid: wx.getStorageSync('_OPENID')
    }).get().then(res => {
      if (res.data.length > 0) {
        this.setData({
          userInfo: res.data[0].globalData,
          hasUserInfo: true,
        })
        wx.setStorageSync('userinfo', this.data.userInfo)
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
      db.collection('UserInfo').where({
        _openid: wx.getStorageSync('_OPENID')
      }).get().then(res => {
        if (res.data.length <= 0) {
          wx.showModal({
            title: '提示',
            content: '您还没有注册',
            showCancel: false,
            confirmText: "确定",
            success: function(res) {
              wx.navigateTo({
                url: '../userlogin/userlogin',
              })
            }
          })
        }
      })
    })
    /*  if (!wx.getStorageSync('userinfo')) {
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
      }*/
  },
  getUserInfo: function(e) {
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
  onLoad: function(options) {},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.startLocationUpdateBackground({
      success(res) {
        console.log('开启后台定位', res)
      },
      fail(res) {
        console.log('开启后台定位失败', res)
      }
    })
  },

  adgolist: function() {
    wx.navigateTo({
      url: '../list/list',
    })
  },

  b0gol: function() {
    wx.navigateTo({
      url: '../list/list?activeIndex=' + 0,
    })
  },

  b1gol: function() {
    wx.navigateTo({
      url: '../list/list?activeIndex=' + 1,
    })
  },

  b2gol: function() {
    wx.navigateTo({
      url: '../list/list?activeIndex=' + 2,
    })
  },

  b3gol: function() {
    wx.navigateTo({
      url: '../list/list?activeIndex=' + 3,
    })
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

  },
})