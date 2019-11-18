// pages/list/list.js
const db = wx.cloud.database(); //初始化数据库
var categoryHeight = [] // 右列表各分类高度数组
Page({

  /**
   * 页面的初始数据
   */
  data: {
    firsttime: false, //记录是否是第一次加载页面
    activeIndex: 0,
    tapIndex: 0,
    foodList: [],
    foodList2: [],
    cartList: {},
    cartPrice: 0,
    cartNumber: 0,
    cartBall: {
      show: false,
      x: 0,
      y: 0
    },

    currentType: 0,
    currentIndex: 0,
    sumMoney: 0, // 总价钱
    cupNumber: 0, // 购物车里商品的总数量
    showCart: false, // 是否展开购物车
    loading: false,
    containerH: '',
    heightArr: [], // 数组:查找到的所有单元的内容高度

    showCart: false,
    promotion: {}
  },
  changingCategory: false, // 是否正在切换左侧激活的分类（防止滚动过快时切换迟缓）
  shopcartAnimate: null,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    db.collection('programData').where({
        _id: 'c0b4c39b-5e84-482f-bf27-57b8b8c900ab'
      }).get().then(res => {
        this.setData({
          promotion: res.data[0].promotion,
          foodList: res.data[0].locations
        })
      }),
      db.collection('foods').where({
        location: '南一'
      }).get().then(res => {
        this.setData({
          foodList2: res.data
        })
      })
    this.data.firsttime = true;
  },
  // 点击左侧菜单项选择
  selectMenu: function(e) {
    let index = e.currentTarget.dataset.index
    //console.log(index)
    this.setData({
      activeIndex: index
    })
    if (index != 3) {
      db.collection('foods').where({
        location: this.data.foodList[this.data.activeIndex]
      }).get().then(res => {
        this.setData({
          foodList2: res.data
        })
      })
    }

    if (index == 3) {
      db.collection('express').where({
        category: this.data.foodList[this.data.activeIndex]
      }).get().then(res => {
        this.setData({
          foodList2: res.data
        })
      })

    }
  },

  onFoodScroll: function(e) {
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
  scrolltolower: function() {
    this.setData({
      activeIndex: categoryHeight.length - 1
    })
  },

  addToCart: function(e) {
    var id = this.data.foodList2[e.currentTarget.dataset.index].ID
    var category_id = e.currentTarget.dataset.type
    var food = this.data.foodList2[e.currentTarget.dataset.index]
    var cartList = this.data.cartList
    if (cartList[id]) {
      ++cartList[id].number
    } else {
      cartList[id] = {
        id: food.id,
        name: food.name,
        price: parseFloat(food.price),
        number: 1
      }
    }
    //this.shopcartAnimate.show(e)
    this.setData({
      cartList: cartList,
      cartPrice: this.data.cartPrice + cartList[id].price,
      cartNumber: this.data.cartNumber + 1
    })
  },
  cartNumberDec: function(e) {
    var id = e.currentTarget.dataset.id
    var cartList = this.data.cartList
    if (cartList[id]) {
      var price = cartList[id].price
      if (cartList[id].number > 1) {
        --cartList[id].number
      } else {
        delete cartList[id]
      }
      this.setData({
        cartList: cartList,
        cartNumber: --this.data.cartNumber,
        cartPrice: this.data.cartPrice - price
      })
      if (this.data.cartNumber <= 0) {
        this.setData({
          showCart: false
        })
      }
    }
  },
  cartNumberAdd: function(e) {
    var id = e.currentTarget.dataset.id
    var cartList = this.data.cartList
    if (cartList[id]) {
      var price = cartList[id].price

        ++cartList[id].number

      this.setData({
        cartList: cartList,
        cartNumber: ++this.data.cartNumber,
        cartPrice: this.data.cartPrice + price
      })
    }
  },

  // 展开购物车
  showCartList: function() {
    if (this.data.cartList.length != 0) {
      this.setData({
        showCart: !this.data.showCart,
      });
    }
  },
  // 清空购物车
  clearCartList: function() {
    this.setData({
      cartList: {},
      showCart: false,
      cartPrice: 0,
      cartNumber: 0
    });
  },
  /*
    // 购物车添加商品数量
    addNumber: function (e) {
      var index = e.currentTarget.dataset.index;
      var cartList = this.data.cartList;
      cartList[index].number++;
      var sum = this.data.sumMoney + cartList[index].price;
      cartList[index].sum += cartList[index].price;
      this.setData({
        cartList: cartList,
        sumMoney: sum,
        cupNumber: this.data.cupNumber + 1
      })
    },
    // 购物车减少商品数量
    decNumber: function (e) {
      var index = e.currentTarget.dataset.index;
      var cartList = this.data.cartList;
      var sum = this.data.sumMoney - cartList[index].price;
      cartList[index].sum -= cartList[index].price;
      cartList[index].number == 1 ? cartList.splice(index, 1) : cartList[index].number--;
      this.setData({
        cartList: cartList,
        sumMoney: sum,
        showCart: cartList.length == 0 ? false : true,
        cupNumber: this.data.cupNumber - 1
      });
    },
    // 

  */

  order: function() {
    {
      if (this.data.cartNumber != 0) {
        wx.navigateTo({
          url: '../order/checkout/checkout',
        })
      }
    }
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
    //页面显示时，从云端获取用户上次购物车中的数据
    db.collection('CartList').where({
      _openid: wx.getStorageSync('_OPENID')
    }).get().then(res => {
      console.log('res=', res)
      if (res.data.length > 0) {
        this.setData({
          cartList: res.data[0].cartList,
          cartNumber: res.data[0].cartNumber,
          cartPrice: res.data[0].cartPrice
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    //页面隐藏时将选择的商品同时添加到云数据库中以保存用户数据
    if (this.data.firsttime) {
      db.collection('CartList').doc(wx.getStorageSync('_OPENID')).set({
        data: {
          cartList: this.data.cartList,
          cartNumber: this.data.cartNumber,
          cartPrice: this.data.cartPrice,
        }
      })
      this.data.firsttime=false
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    //返回时将选择的商品同时添加到云数据库中以保存用户数据
    if(this.data.firsttime){
    db.collection('CartList').doc(wx.getStorageSync('_OPENID')).set({
      data: {
        cartList: this.data.cartList,
        cartNumber: this.data.cartNumber,
        cartPrice: this.data.cartPrice,

      }
    })
    this.data.firsttime=false
    }
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