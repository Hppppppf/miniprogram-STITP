//app.js
App({
  onLaunch: function() {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'cloud-103-zifl9',
        traceUser: true,  
      })
    }
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var _this = this;
    const db = wx.cloud.database({
      env: 'cloud-103-zifl9'
    })
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        wx.setStorageSync('_OPENID', res.result.openid);
      }
    })
    wx.login({
      success: res => {
        db.collection('UserInfo').where({
          _openid: wx.getStorageSync('_OPENID')
        }).get().then(
          res => {
            if (res.data.length <= 0) {
              wx.showModal({
                title: '提示',
                content: '请先注册',
                showCancel: false,
                confirmText: "确定",
                success: function(res) {
                  wx.navigateTo({
                    url: '/pages/userlogin/userlogin',
                  })
                }
              })
            } else {
              wx.setStorageSync('userinfo', res.data)
            }
          })
      },
      fail: function(res) {
        console.log('res', res)
      }
    })
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
               // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    _openid: null,
  }
})
