// pages/register/register.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    tel: "",
    school: "",
    num: "",
    enter_year: "",
    is_register: false
  },

  changeName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  changeTel: function(e) {
    this.setData({
      tel: e.detail.value
    })
  },
  changeSchool: function(e) {
    this.setData({
      school: e.detail.value
    })
  },
  changeNum: function(e) {
    this.setData({
      num: e.detail.value
    })
  },
  changeYear: function(e) {
    this.setData({
      enter_year: e.detail.value
    })
  },
  bindSubmit: function(e) {
    const db = wx.cloud.database()
    db.collection('UserInfo').where({
      _openid: wx.getStorageSync('_OPENID')
    }).get().then(
      res => {
        if (res.data.length <= 0) {
          db.collection('UserInfo').add({
            data: {
              openid: wx.getStorageSync('_OPENID'),
              globalData: JSON.stringify(app.globalData.userInfo),
              name: this.data.name,
              tel: this.data.tel,
              school: this.data.school,
              num: this.data.num,
              enter_year: this.data.enter_year,
              is_register: true
            }
          }).then(res => {
            wx.showToast({
              title: '新增记录成功',
            })
            wx.cloud.callFunction({
              name: 'getUserInfo',
              complete: res => {
                wx.setStorageSync('userinfo', res.result.data)
              }
            })
            wx.redirectTo({
              url: '../list/list',
            })
          }, )
        } else {
          wx.cloud.callFunction({
            name: 'getUserInfo',
            complete: res => {
              wx.setStorageSync('userinfo', res.result.data)
            }
          })
          wx.showModal({
            title: '提示',
            content: '帐号已注册',
            showCancel: false,
            confirmText: "直接点餐",
            success:function(res) {
              wx.redirectTo({
                url: '../list/list',
              })
            }
          })
        }
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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