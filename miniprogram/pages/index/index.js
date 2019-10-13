// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiper: ["cloud://cloud-103-zifl9.636c-cloud-103-zifl9-1259648286/程序资源/banner_1.png", "cloud://cloud-103-zifl9.636c-cloud-103-zifl9-1259648286/程序资源/banner_2.png","cloud://cloud-103-zifl9.636c-cloud-103-zifl9-1259648286/程序资源/banner_3.png"],
    ad: "cloud://cloud-103-zifl9.636c-cloud-103-zifl9-1259648286/程序资源/image_ad.png",
    category: ["cloud://cloud-103-zifl9.636c-cloud-103-zifl9-1259648286/程序资源/bottom_1.png", "cloud://cloud-103-zifl9.636c-cloud-103-zifl9-1259648286/程序资源/bottom_2.png", "cloud://cloud-103-zifl9.636c-cloud-103-zifl9-1259648286/程序资源/bottom_3.png", "cloud://cloud-103-zifl9.636c-cloud-103-zifl9-1259648286/程序资源/bottom_1.png"]
  },
  start: function () {
    wx.navigateTo({
      url: '/pages/list/list',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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