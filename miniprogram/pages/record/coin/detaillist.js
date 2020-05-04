// miniprogram/pages/record/coin/detaillist.js
const app = getApp();
const db = wx.cloud.database(); //初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    islast:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      is_last: false
    })
    var that = this
    //由于需要同步获取数据，可能较慢，需要加入加载动画
    wx.showLoading({
      title: '加载中...',
    })
    //定义每次获取的条数
    const MAX_LIMIT = 20
    //先取出集合的总数
    var total = 0
    db.collection('Credit').where({
      _openid: wx.getStorageSync('_OPENID')
    }).count().then(res => {
      //console.log('Count', res)
      total = res.total;
      console.log('Total', total)
      //计算需要分几次取
      const batchTimes = Math.ceil(total / MAX_LIMIT)
      //承载所有读操作的promise的数组
      const arraypro = []
      //初次循环获取云端数据库的分次数的promise数组
      for (let i = 0; i < batchTimes; i++) {
        var promise = 0
        db.collection('Credit').where({
          _openid: wx.getStorageSync('_OPENID')
        }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get().then(res => {
          //console.log('promiseRes', res)
          promise = res
          console.log('promise', promise)
          //二次循环根据获取的promise数组的数据长度获取全部数据push到arraypro数组中
          for (let j = 0; j < promise.data.length; j++) {
            arraypro.push(promise.data[j])
          }
          console.log('arraypro=  ', arraypro)
          //对数据进行排序，使最新的订单出现在最上面
          var compare = function (obj1, obj2) {
            var var1 = obj1.pay_time
            var var2 = obj2.pay_time
            if (var1 < var2) {
              return 1
            } else if (var1 > var2) {
              return -1
            } else {
              return 0
            }
          }
          arraypro.sort(compare)
          console.log('SORTARRAYPRO=', arraypro)
          //将数据传递到页面视图
          that.setData({
            credit: arraypro,
            is_last: true
          })
        })
      }
      if (total == 0) {
        that.setData({
          credit: arraypro,
          is_last: true
        })
      }
      wx.hideLoading()
    })
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