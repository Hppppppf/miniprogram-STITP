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
    cartList: [],
    cartPrice: 0,
    cartNumber: 0,
    cartBall: {
      show: false,
      x: 0,
      y: 0
    },

    currentType: 0,
    currentIndex: 0,
    sumMonney: 0, // 总价钱
    cupNumber: 0, // 购物车里商品的总数量
    showCart: false, // 是否展开购物车
    loading: false,
    containerH: '',
    heightArr: [], // 数组:查找到的所有单元的内容高度
    
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
    //console.log(index)
    this.setData({
      activeIndex: index
    })
    if(index ==0)
   { db.collection('foods').where({
      location:this.data.foodList[this.data.activeIndex]
    }).get().then(res => {
      this.setData({
        foodList2:res.data
      })
    })
   }

    if(index == 3)
    {
      db.collection('express').where({
        category: this.data.foodList[this.data.activeIndex]
      }).get().then(res => {
        this.setData({
          foodList2: res.data
        })
      })

   }
  },

  onFoodScroll: function (e) {
    var scrollTop = e.detail.scrollTop
    var activeIndex = 0
    categoryHeight.forEach((item, i) => {
      if (scrollTop >= item) {
        activeIndex = iz
      }
    })
    if (!this.changingCategory) {
      this.changingCategory = true
      this.setData({
        activeIndex: activeIndex,
      }, () => {
        this.changingCategory = false
      })
    }
  },
  scrolltolower: function () {
    this.setData({
      activeIndex: categoryHeight.length - 1
    })
  },

  addToCart: function (e) {
    console.log(e)
   // var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index; 
    this.setData({
     // currentType: type,
      currentIndex: index, 
    });
    
    var a = this.data
    var addItem = {
      "name": a.foodList2[a.currentIndex].name,
      "price": a.foodList2[a.currentIndex].price,
      "number": 1,   
    }
    var sumMonney = /*a.sumMonney +*/ a.price
    var cartList = this.data.cartList;
    cartList.push(addItem);
    this.setData({
      cartList: cartList,
      showModalStatus: false,
      sumMonney: sumMonney,
      cupNumber: a.cupNumber + 1,
      cartNumber:a.cartNumber + 1
    });
  },

  // 展开购物车
  showCartList: function () {
    if (this.data.cartList.length != 0) {
      this.setData({
        showCart: !this.data.showCart,
      });
    }
  },
/*
  // 购物车添加商品数量
  addNumber: function (e) {
    var index = e.currentTarget.dataset.index;
    var cartList = this.data.cartList;
    cartList[index].number++;
    var sum = this.data.sumMonney + cartList[index].price;
    cartList[index].sum += cartList[index].price;
    this.setData({
      cartList: cartList,
      sumMonney: sum,
      cupNumber: this.data.cupNumber + 1
    })
  },
  // 购物车减少商品数量
  decNumber: function (e) {
    var index = e.currentTarget.dataset.index;
    var cartList = this.data.cartList;
    var sum = this.data.sumMonney - cartList[index].price;
    cartList[index].sum -= cartList[index].price;
    cartList[index].number == 1 ? cartList.splice(index, 1) : cartList[index].number--;
    this.setData({
      cartList: cartList,
      sumMonney: sum,
      showCart: cartList.length == 0 ? false : true,
      cupNumber: this.data.cupNumber - 1
    });
  },
  // 清空购物车
  clearCartList: function () {
    this.setData({
      cartList: [],
      showCart: false,
      sumMonney: 0,
      cupNumber: 0
    });
  },

*/

  order: function () {
    {
      wx.navigateTo({
        url: '../order/checkout/checkout',
      })
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