// miniprogram/pages/record/location/setLocation/setLocation.js
const db = wx.cloud.database(); //初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: "请选择收货地址",
    index: 0,
    name: "收货人姓名",
    tel: "收货人手机号",
    detail: "例：桃苑25栋",
    sex: true,
    locationList:{},
  },
  openMap: function (e) {
    var that = this
    wx.getSetting({
      success(res) {
        //这里判断是否有地位权限
        if (!res.authSetting['scope.userLocation']) {
          wx.showModal({
            title: '提示',
            content: '请求获取位置权限',
            success: function (res) {
              if (res.confirm == false) {
                return false;
              }
              wx.openSetting({
                success(res) {
                  //如果再次拒绝则返回页面并提示
                  if (!res.authSetting['scope.userLocation']) {
                    wx.showToast({
                      title: '此功能需获取位置信息，请重新设置',
                      duration: 3000,
                      icon: 'none'
                    })
                  } else {
                    //允许授权，调用地图
                    that.getGeopoint()
                  }
                }
              })
            }
          })
        } else {
          //如果有定位权限，调用地图
          that.getGeopoint()
        }

      }

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
      index: JSON.parse(options.index)
    })
    console.log(this.data.index)
    db.collection('UserInfo').where({
      _openid: wx.getStorageSync('_OPENID')
    }).get().then(res => {
      console.log(res.data)
      if (res.data.length > 0) {
        this.setData({
          name: res.data[0].location[this.data.index].name,
          tel: res.data[0].location[this.data.index].tel,
          address: res.data[0].location[this.data.index].location,
          detail: res.data[0].location[this.data.index].detail,
          sex: res.data[0].location[this.data.index].sex,
          locationList: res.data[0].location
        })
      }
    })
  },
  locationSubmit: function() {
    console.log(this.data.location)
    wx.cloud.callFunction({
      name: 'submitLocation',
      data: {
        _openid: wx.getStorageSync('_OPENID'),
        index: this.data.index,
        name: this.data.name,
        tel: this.data.tel,
        location: this.data.address,
        detail: this.data.detail,
        sex: this.data.sex
      },
    })
    wx.navigateTo({
      url: '../location',
    })
  },
  locationDelete: function() {
    for (var i = this.data.index; i < this.data.locationList.length - 1; i++) {
      this.data.locationList[i].index = this.data.locationList[i + 1].index
      this.data.locationList[i].name = this.data.locationList[i + 1].name
      this.data.locationList[i].sex = this.data.locationList[i + 1].sex
      this.data.locationList[i].tel = this.data.locationList[i + 1].tel
      this.data.locationList[i].location = this.data.locationList[i + 1].location
      this.data.locationList[i].detail = this.data.locationList[i + 1].detail
    }
    this.data.locationList.splice(this.data.locationList.length - 1, 1)
    wx.cloud.callFunction({
      name: 'deleteLocation',
      data: {
        _openid: wx.getStorageSync('_OPENID'),
        location: this.data.locationList
      }
    })
    wx.navigateTo({
      url: '../location',
    })
  },
  selectTrue:function(){
    this.setData({
      sex:true
    })
  },
  selectFalse: function () {
    this.setData({
      sex: false
    })
  },
  changeName:function(e){
    console.log(e)
    this.setData({
      name:e.detail.value
    })
  },

  changeTel: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },

  changeDetail: function (e) {
    this.setData({
      detail: e.detail.value
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