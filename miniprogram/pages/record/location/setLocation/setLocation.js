// miniprogram/pages/record/location/setLocation/setLocation.js
const db = wx.cloud.database(); //初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:"请输入收货地址",
    index:0,
    name:"收货人姓名",
    tel:"收货人手机号",
    detail:"例：桃苑25栋",
    sex:true,
  },
  getGeopoint:function()
  {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        // success
        console.log(res, "location")
        that.setData({
          address:res.address
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      index: JSON.parse(options.index)
    })
    console.log(this.data.index)
    db.collection('UserInfo').where({
      _openid: wx.getStorageSync('_OPENID')
    }).get().then(res => {
      console.log(res.data)
      this.setData({
        name:res.data[0].location[this.data.index].name,
        tel: res.data[0].location[this.data.index].tel,
        address: res.data[0].location[this.data.index].location,
        detail: res.data[0].location[this.data.index].detail,
        sex:res.data[0].location[this.data.index].sex
      })
    })
  },
  locationSubmit:function(){
    wx.cloud.callFunction({
      name:'submitLocation',
      data:{
        _openid: wx.getStorageSync('_OPENID'),
        index:this.data.index,
        name:this.data.name,
        tel:this.data.tel,
        location:this.data.address,
        detail:this.data.detail,
        sex:this.data.sex
      },
    })
    wx.navigateTo({
      url: '../location',
    })
  },
  locationDelete:function(){
    wx.cloud.callFunction()
    {
      name:'deleteLocation'
    }
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