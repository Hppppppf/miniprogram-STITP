// pages/order/checkout/checkout.js
const db = wx.cloud.database(); //初始化数据库
var util = require('../../../utils/utils.js');
//引入腾讯地图SDK核心类
var QQMapWX = require('qqmap-wx-jssdk.js'); //相对路径有BUG？只能放到同目录下
var qqmapsdk = new QQMapWX({
  key: '7IXBZ-2TU63-7EF36-Y6HR2-6LDNT-DTBGQ' // 必填
});
Page({
  /**
   * 页面的初始数据
   */
  data: {
    order: {},
    order_id: 0,
    orderPrice: 0,
    note: '',
    create_time: '',
    pay_time: '',
    number: 0,
    is_taken: false,
    order_taken: false,
    deliveryfee: 1,
    currentWordNumber: 0,
    paymethod: '',
    distance:0,
    totalDistance:0,
  },
  /*
    listenerTextarea: function (e) {
      var note = e.detail.value
      // 存储note值 
      wx.setStorageSync('note', note)
    },
  */
  pay: function() {
    this.calculateDis(this.data.location.longitude, this.data.location.latitude)
    var that = this
    console.log("note:" + this.data.note)
    var time = util.formatTime(new Date());
    wx.showActionSheet({
      itemList: ['微信支付', '积分支付'],
      success(res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          that.setData({
            paymethod: "wx",
          })
          db.collection('programData').get().then(res => {
            that.setData({
              order_id: ++res.data[0].orderNum,
              pay_time: time
            })
            wx.cloud.callFunction({
              name: 'orderNum'
            })
            db.collection('Order').add({
              data: {
                order_id: that.data.order_id,
                order: that.data.order,
                orderPrice: that.data.orderPrice,
                note: that.data.note,
                create_time: that.data.create_time,
                number: that.data.number,
                pay_time: that.data.pay_time,
                is_taken: false,
                order_taken: false,
                location: that.data.location,
                deliveryfee: that.data.deliveryfee,
                paymethod: that.data.paymethod,
                totalDis:that.data.totalDistance,
              }
            })
            console.log('order_id', that.data.order_id)
            wx.redirectTo({
              url: '/pages/order/detail/detail?order_id=' + that.data.order_id
            })
          })
          db.collection('CartList').doc(wx.getStorageSync('_OPENID')).remove()
        } else if (res.tapIndex == 1) {
          console.log('jfffffffff')
          var credit_count = 0;
          var paycredit_count = 0;
          var credit_orderPrice = 0;
          var paycredit_orderPrice = 0;
          wx.cloud.callFunction({
            name: 'jfpay_total',
          })
          db.collection('CreditTotal').where({
            _openid: wx.getStorageSync('_OPENID')
          }).get().then(res => {
            wx.cloud.callFunction({
              name: 'credit_total',
              data: {
                _id: res.data[0]._id,
              }
            })
            credit_count = res.data[0].credit_count;
            credit_orderPrice = res.data[0].credit_orderPrice;
          })
          db.collection('CreditPayTotal').where({
            _openid: wx.getStorageSync('_OPENID')
          }).get().then(res => {
            paycredit_count = res.data[0].paycredit_count;
            paycredit_orderPrice = res.data[0].paycredit_orderPrice
          })
          var vcredit_count = credit_count - paycredit_count;
          var vcredit_orderPrice = credit_orderPrice = paycredit_orderPrice;
          var vprice = that.data.orderPrice + that.data.deliveryfee
          if (vcredit_count + vcredit_orderPrice >= vprice) {
            that.setData({
              paymethod: 'jf'
            })
            db.collection('programData').get().then(res => {
              that.setData({
                order_id: ++res.data[0].orderNum,
                pay_time: time
              })
              wx.cloud.callFunction({
                name: 'orderNum'
              })
              db.collection('Order').add({
                data: {
                  order_id: that.data.order_id,
                  order: that.data.order,
                  orderPrice: that.data.orderPrice,
                  note: that.data.note,
                  create_time: that.data.create_time,
                  number: that.data.number,
                  pay_time: that.data.pay_time,
                  is_taken: false,
                  order_taken: false,
                  location: that.data.location,
                  deliveryfee: that.data.deliveryfee,
                  paymethod: that.data.paymethod,
                }
              })
              console.log('order_id', that.data.order_id)
              wx.redirectTo({
                url: '/pages/order/detail/detail?order_id=' + that.data.order_id
              })
              wx.cloud.callFunction({
                name: 'jfpay',
                data: {
                  paytime: time,
                  order_id: that.data.order_id,
                  credit_count:vcredit_count,
                  credit_orderPrice:vcredit_orderPrice
                }
              })
            })
            db.collection('CartList').doc(wx.getStorageSync('_OPENID')).remove()
          } else {
            wx.showToast({
              title: '积分不足，请选择其他支付方式',
              icon: 'none'
            })
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.cloud.init({
      traceUser: true,
      env: 'cloud-103-zifl9'
    })
    var temppromotion = 0;
    wx.showLoading({
      title: '努力加载中'
    })
    var time = util.formatTime(new Date());
    
    db.collection('CartList').doc(wx.getStorageSync('_OPENID')).get().then(data => {
      db.collection('programData').get().then(res => {
        if (data.data.cartPrice > res.data[0].promotion[0]) {
          this.setData({
            promotion: res.data[0].promotion[1],
          })
          temppromotion = res.data[0].promotion[1]
        }
        this.setData({
          order_food: data.data.cartList,
          price: data.data.cartPrice - temppromotion,
          //另存一份备用，以减少访问云数据库的次数
          order: data.data.cartList,
          orderPrice: data.data.cartPrice - temppromotion,
          number: data.data.cartNumber,
          create_time: time,
        })
        db.collection('UserInfo').where({
          _openid: wx.getStorageSync('_OPENID')
        }).get().then(res => {
          this.setData({
            location: res.data[0].location[0]
          })
        })
      })
      wx.hideLoading()
    }, () => {
      this.onLoad(options)
    })
    
  },
  comment: function(e) {
    this.data.note = e.detail.value
    console.log(this.data.note)
  },

  /****限制字数与计算 */
  getValueLength: function(e) {
    let value = e.detail.value
    let len = parseInt(value.length)
    //最多字数限制
    if (len > 40) return;
    this.setData({
      currentWordNumber: len //当前字数 
    })
  },

  /*计算配送费*/

  selectone: function() {
    this.setData({
      deliveryfee: 1,
    })
  },

  selectthree: function() {
    this.setData({
      deliveryfee: 3,
    })
  },

  selectfive: function() {
    this.setData({
      deliveryfee: 5,
    })
  },

  selectother: function() {

  },

  changefee: function(e) {
    console.log("fee=", e.detail)
    var fee = e.detail.value;
    if (fee < 1) {
      wx.showToast({
        title: '请输入大于1的金额',
        icon: 'none'
      })
      fee = 1;
    }
    this.setData({
      deliveryfee: parseFloat(fee),
    })

  },
  distance: function (a, b) {
    var _this = this;
    console.log(b)
    //调用距离计算接口
    qqmapsdk.calculateDistance({
      //mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
      //from参数不填默认当前地址
      //获取表单提交的经纬度并设置from和to参数（示例为string格式）
      from: a, //若起点有数据则采用起点坐标，若为空默认当前地址
      to: b, //终点坐标
      success: function (res) { //成功后的回调
        console.log(res);
        var res = res.result;
        var dis = [];
        var totalDis = 0;
        var flag = false;
        for (var i = 0; i < res.elements.length; i++) {
          dis.push(res.elements[i].distance); //将返回数据存入dis数组，
          totalDis += res.elements[i].distance;
          if (i > 0) {
            flag = true
            _this.setData({
              tip: "[跨店订单]"
            })
          }
        }
        _this.setData({ //设置并更新distance数据
          distance: dis,
          totalDistance: totalDis / 1000.0,
          totalTime: totalDis / _this.data.speed_user,
          is_CrossStore: flag
        });
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    });
    return true
  }, 
  calculateDis: function (longitude_user, latitude_user) {
    var tempFood_Location = [false, false, false, false]
    var locationList = ''
    this.setData({
      distance: 0
    })
    var userLocation = String(latitude_user + "," + longitude_user)
    var _this = this
    //判断商品出发点
    db.collection('Order').where({
      order_id: this.data.id
    }).get().then(res => {
      this.setData({
        food_location: [false, false, false, false]
      })
      Object.keys(res.data[0].order).forEach(function (key) {
        var tempDataID = res.data[0].order[key].dataID
        console.log(tempDataID)
        //快递
        if (tempDataID == "fc0705b9-1f32-4295-ae58-76427cdab816" || tempDataID == "ff4ed28d-d8c2-4c82-af0d-0ebd355546f1" || tempDataID == "f836f523-decb-4289-bfab-d89adf4b03fe") {
          tempFood_Location[3] = true
          locationList += '32.116340,118.935340;'
        } else {
          //食品
          db.collection('foods').where({
            _id: tempDataID
          }).get().then(res => {
            console.log(res)
            if (res.data[0].location == "南一") {
              if (!tempFood_Location[0]) {
                tempFood_Location[0] = true
                locationList += '32.108430,118.933370;'
              }
            } else if (res.data[0].location == "南二") {
              if (!tempFood_Location[1]) {
                tempFood_Location[1] = true
                locationList += '32.111720,118.933180;'
              }
            } else if (res.data[0].location == "南三") {
              if (!tempFood_Location[2]) {
                tempFood_Location[2] = true
                locationList += '32.117280,118.933580;'
              }
            }
            locationList = locationList.substr(0, locationList.length - 1)
            _this.distance(userLocation, locationList)
          })
        }
      });
      this.setData({
        food_location: tempFood_Location,
      })
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