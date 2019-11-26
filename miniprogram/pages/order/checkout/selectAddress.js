// miniprogram/pages/order/checkout/selectAddress.js
const db = wx.cloud.database(); //初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    haveLocation: true,
    locationList: {},
    addressList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    db.collection('UserInfo').where({
      _openid: wx.getStorageSync('_OPENID')
    }).get().then(res => {
      if (res.data[0].location) {
        this.setData({
          locationList: res.data[0].location
        })
      } else {
        haveLocation: false
      }
      for (var i in this.data.locationList) {
        this.data.addressList[i] = {
          detail: this.data.locationList[i].detail,
          location: this.data.locationList[i].location,
          name: this.data.locationList[i].name,
          sex: this.data.locationList[i].sex,
          tel: this.data.locationList[i].tel,
          value: i,
          checked: false
        }
      }
      console.log(this.data.addressList)
      this.setData({
        addressList: this.data.addressList
      })
    })
  },

  modifyLocation(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/record/location/setLocation/setLocation?index=' + e.currentTarget.dataset.index,
    })
  },

  addLocation: function(e) {
    wx.navigateTo({
      url: '/pages/userlogin/register?isAdd=' + true,
    })
  },

  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var addressList = this.data.addressList;
    for (var i = 0, len = addressList.length; i < len; ++i) {
      addressList[i].checked = addressList[i].value == e.detail.value;
    }

    this.setData({
      addressList: addressList
    })

    let pages = getCurrentPages(); //获取当前页面js里的pages里的所有信息。
    let prevPages = pages[pages.length - 2];
    //prevPage是获取上一个页面的js里面pages的所有信息。-2是上一个页面，-3是上上个页面，以此类推
    var whichAddress = 0;
    for (var i in addressList) {
      if (addressList[i].checked) {
        whichAddress = i
        break
      }
    }
    console.log('whichAddress', whichAddress)
    prevPages.setData({ //将我们想要传递的参数在这里直接setData.上个页面就会执行这里的操作。
      location: addressList[whichAddress]
    })
    //上一个页面内执行setData操作，将我们想要的信息保存住。当我们返回去的时候，页面已经处理完毕。
    //返回上一个页面
    wx.navigateBack({
      delta: 1 //返回上一级页面。
    })
    //此时页面数据已经改变为我们传递过来的数据。如果想要返回之后处理这些数据，那么要在onShow函数里执行，因为我们执行的是返回，不会触发onLoad函数。
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