// pages/list/list.js
const db = wx.cloud.database();//初始化数据库
var categoryHeight = [] // 右列表各分类高度数组
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0,
    tapIndex: 0,
    foodList: [],
    foodList2:[],
    cartList: {},
    cartPrice: 0,
    cartNumber: 0,
    cartBall: {
      show: false,
      x: 0,
      y: 0
    },
    
    showCart: false,
    promotion:{}
  },
  changingCategory: false, // 是否正在切换左侧激活的分类（防止滚动过快时切换迟缓）
  shopcartAnimate: null,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('programData').where({
      _id: 'c0b4c39b-5e84-482f-bf27-57b8b8c900ab'
    }).get().then(res => {
      this.setData({
        promotion: res.data[0].promotion,
        foodList:res.data[0].locations
      })
    })
    /*
    for (var i in data.list) {
      this.setData({
        activeIndex: i
      })
      break
    }*/
  },
  // 点击左侧菜单项选择
  selectMenu: function (e) {
    let index = e.currentTarget.dataset.index
    console.log(index)
    this.setData({
      activeIndex: index,
      tapIndex:index
    })
    db.collection('foods').where({
      location:this.data.foodList[this.data.activeIndex]
    }).get().then(res => {
      this.setData({
        foodList2:res.data
      })
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