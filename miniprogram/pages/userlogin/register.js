// pages/register/register.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    locationList: {},
    address: "请选择收货地址",
    index: 0,
    name: "收货人姓名",
    tel: "收货人手机号",
    detail: "例：桃苑25栋",
    sex: true,
    isAdd: false,
  },
  locationSubmit: function(e) {
    //判断用户是否输入了数据
    if (this.data.name == "收货人姓名" || this.data.name == "undefined" || this.data.name == "") {
      wx.showToast({
        title: '收货人姓名不能为空！',
        icon: 'none'
      })
      return
    }
    if (this.data.tel == "收货人手机号" || this.data.tel == "undefined" || this.data.tel == "") {
      wx.showToast({
        title: '收货人手机号不能为空！',
        icon: 'none'
      })
      return
    }
    if (this.data.address == "请选择收货地址" || this.data.address == "undefined" || this.data.address == "") {
      wx.showToast({
        title: '收货地址不能为空！',
        icon: 'none'
      })
      return
    }
    if (this.data.detail == "例：桃苑25栋" || this.data.detail == "undefined" || this.data.detail == "") {
      wx.showToast({
        title: '详细地址不能为空！',
        icon: 'none'
      })
      return
    }
    //以上为判断用户是否输入了数据函数
    var locationList = this.data.locationList
    db.collection('UserInfo').where({
      _openid: wx.getStorageSync('_OPENID')
    }).get().then(
      res => {
        if (res.data.length <= 0) { //数据库中没有用户信息，属于新增用户，进行注册
            locationList[this.data.index] = {
              name: this.data.name,
              tel: this.data.tel,
              location: this.data.address,
              detail: this.data.detail,
              sex: this.data.sex,
            }
            db.collection('UserInfo').add({ //将新用户的信息添加到数据库
              data: {
                globalData: JSON.stringify(app.globalData.userInfo),
                location: locationList,
              }
            }).then(res => {
              wx.showToast({
                title: '新增记录成功',
              })
              wx.cloud.callFunction({ //调用云函数获取用户信息并记入缓存中，此后以缓存中是否有该数据作为判断用户是否需要注册或重新获取权限
                name: 'getUserInfo',
                complete: res => {
                  wx.setStorageSync('userinfo', res.result.data)
                }
              })
              wx.redirectTo({
                url: '../list/list',
              })
            })
          }
        else { //若数据库中有用户信息，不属于新增用户，执行下面操作
          if (this.data.isAdd) { //如果用户是从添加地址按钮进入
            var location = res.data[0].location
            var count = 0
            for (var i in location) { //数一数用户一共存了多少个地址
              count++
            }
            if (count < 20) { //限制用户最多存20个地址
              this.setData({
                index: count
              })
              locationList[this.data.index] = {
                index: this.data.index,
                name: this.data.name,
                tel: this.data.tel,
                location: this.data.address,
                detail: this.data.detail,
                sex: this.data.sex,
              }
              db.collection('UserInfo').doc(res.data[0]._id).update({
                data: {
                  location: this.data.locationList
                }
              }).then(res => {
                wx.showToast({
                  title: '新增地址成功',
                })
              })
              wx.navigateBack()
              wx.hideToast()
            } else { //如果用户存的地址超过了20个，则执行
              wx.showToast({
                title: '新增地址失败！您的地址已达上限',
                icon: 'none',
              })
            }
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
              success: function(res) {
                wx.redirectTo({
                  url: '../list/list',
                })
              }
            })
          }
        }
      })
  },

  selectTrue: function () {
    this.setData({
      sex: true
    })
  },
  selectFalse: function () {
    this.setData({
      sex: false
    })
  },
  changeName: function(e) {
    this.setData({
      name: e.detail.value,
    })
  },

  changeTel: function(e) {
    this.setData({
      tel: e.detail.value,
    })
  },

  changeDetail: function(e) {
    this.setData({
      detail: e.detail.value,
    })
  },

  getGeopoint: function() {
    var that = this
    wx.chooseLocation({
      success: function(res) {
        // success
        console.log(res, "location")
        that.setData({
          address: res.address
        })
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      isAdd: options.isAdd
    })
    db.collection('UserInfo').where({
      _openid: wx.getStorageSync('_OPENID')
    }).get().then(
      res => {
        if (res.data.length > 0) {
          if (!this.data.isAdd) {
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
              success: function(res) {
                wx.redirectTo({
                  url: '../list/list',
                })
              }
            })
          }
        }
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