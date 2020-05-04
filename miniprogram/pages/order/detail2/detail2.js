// pages/order/detail/detail.js
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
    create_time: '',
    pay_time: '',
    is_taken: false,
    order_taken: false,
    id: "",
    taken_time: '',
    note: '',
    address: '',
    latitude: 0,
    longitude: 0,
    food_arrival: false,
    deliveryfee: 0,
    showModal: false,
    deliveryname: '',
    deliverytel: '',
    is_CrossStore:false,
    tip:"",
    distance:0,
    totalDistance:0,
    latitude_food: 0,
    longitude_food: 0,
    latitude_user: 0,
    longitude_user: 0,
    speed_user:1.25,
    totalTime:0,
    polyline: [],
    markers: [],
    deliveryfee:0
    /*
      markers: [{
        //iconPath: "/resources/others.png",
        id: 0,
        latitude: 23.099994,
        longitude: 113.324520,
        width: 50,
        height: 50
      }],
      polyline: [{
        points: [{
          longitude: 113.3245211,
          latitude: 23.10229
        }, {
          longitude: 130.324520,
          latitude: 28.21229
        }],
        color: "#FF0000DD",
        width: 2,
        dottedLine: true
      }],*/
  },

  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '订单详情'
    })
    var temppromotion = 0
    this.data.id = JSON.parse(options.order_id)

    wx.showLoading({
      title: '加载中',
      mask: true,
    })

    db.collection('Order').where({
      order_id: this.data.id
    }).get().then(data => {
      db.collection('programData').get().then(res => {
        if (data.data[0].orderPrice > res.data[0].promotion[0]) {
          this.setData({
            promotion: res.data[0].promotion[1],
          })
          temppromotion = res.data[0].promotion[1]
        }
        //如订单未完成，显示地图
        if (!data.data[0].is_taken){
          //起点
          let temp = {
            iconPath: "../../../images/userLocation.png",
            id: 1,
            latitude: data.data[0].location.latitude,
            longitude: data.data[0].location.longitude,
            width: 30,
            height: 30
          }
          this.data.markers.push(temp)
          //实例化腾讯地图API核心类
          qqmapsdk = new QQMapWX({
            key: '7IXBZ-2TU63-7EF36-Y6HR2-6LDNT-DTBGQ'
          });
          var _this = this
          wx.getLocation({
            type: 'gcj02',
            success(res) {
              const latitudeGet = res.latitude
              const longitudeGet = res.longitude
              const speedGet = res.speed
              const accuracyGet = res.accuracy
              _this.setData({
                latitude_user: latitudeGet,
                longitude_user: longitudeGet,
                speed_user: 1.25,//speedGet,
              })
              _this.calculateDis(longitudeGet,latitudeGet)
            }
          })
        }
        console.log(data)
        this.setData({
          order_food: data.data[0].order,
          price: data.data[0].orderPrice - temppromotion,
          create_time: data.data[0].create_time,
          pay_time: data.data[0].pay_time,
          is_taken: data.data[0].is_taken,
          taken_time: data.data[0].taken_time,
          order_taken: data.data[0].order_taken,
          note: data.data[0].note,
          address: data.data[0].location,
          deliveryfee: data.data[0].deliveryfee
        })
        wx.hideLoading()
      })
      var fetchCode
      if (this.data.id < 10) {
        fetchCode = 'A00' + this.data.id
      } else if (this.data.id >= 10 && this.data.id < 100) {
        fetchCode = 'A0' + this.data.id
      } else if (this.data.id >= 100) {
        fetchCode = '' + this.data.id
      }
      this.setData({
        code: fetchCode,
        sn: this.data.id,
        create_time: this.data.create_time,
        pay_time: this.data.pay_time,
        is_taken: this.data.is_taken,
        taken_time: this.data.taken_time,
        note: this.data.note,
      })
    })
    db.collection('Credit').add({
      data: {
        //_openid: wx.getStorageSync('_OPENID'),
        order_id: this.data.id,
        credit_p: 0,
        credit_got: 0,
        orderPrice: 0,
        order_takentime: ''
      }
    })
    db.collection('CreditTotal').where({
      _openid: wx.getStorageSync('_OPENID')
    }).get().then(res => {
      if (res.data.length <= 0) {
        db.collection('CreditTotal').add({
          data: {
            credit_count: 0,
            credit_transt: 0,
            credit_orderPrice: 0
          }
        })
      }
    })

  },
  onUnload: function() {
    var app = getApp();
    // 支付成功之后调到订单页面，通知订单页刷新
    app.isReloadOrderList = true
    wx.switchTab({
      url: '/pages/order/list/list'
    })
    db.collection('Credit').where({
      _openid: wx.getStorageSync('_OPENID'),
    }).get().then(res => {
      for (var i in res.data) {
        if (res.data[i].credit_p == 0 && res.data[i].credit_got == 0) {
          db.collection('Credit').doc(res.data[i]._id).remove()
        }
      }
    })

  },
  /*
    getfood: function () {
      var time = util.formatTime(new Date());
      this.setData({
        is_taken: true,
        taken_time: time
      })
      db.collection('Order').where({
        order_id: this.data.id
      }).get().then(res => {
        db.collection('Order').doc(res.data[0]._id).update({
          data: {
            is_taken: true,
            taken_time: time
          }
        })
      })
    },*/
  takefood: function() {
    this.showDialogBtn()
  },

  onShow: function() {

  },

  /**
   * 弹窗
   */
  showDialogBtn: function() {
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function() {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function() {
    if (this.data.deliveryname == "" || this.data.deliverytel == "") {
      wx.showToast({
        title: '请输入您的信息方便顾客联系到您',
        icon: 'none'
      })
    } else {
      this.hideModal();
      var time = util.formatTime(new Date());
      //接单后开启位置实时获取
      var order_id = this.data.id
      wx.onLocationChange(function(res) {
        console.log('location change', res)
        wx.cloud.callFunction({
          name: 'sendCourierLocation',
          data: {
            order_id: order_id,
            latitude: res.latitude,
            longitude: res.longitude,
          },
        })
      })
      this.setData({
        order_taken: true
      })

      db.collection('Order').where({
        order_id: this.data.id
      }).get().then(res => {
        console.log("order_taken", res.data)
        wx.cloud.callFunction({
          name: 'order_taken',
          data: {
            _id: res.data[0]._id,
            order_id: this.data.id,
            order_taken: this.data.order_taken,
          }
        })
      })
      db.collection('Credit').where({
        order_id: this.data.id,
      }).get().then(res => {
        wx.cloud.callFunction({
          name: 'credit_get',
          data: {
            _id: res.data[0]._id,
            order_id: this.data.id,
            order_takentime: time,
          },
        })
      })
      db.collection('OrderTaken').add({
        data: {
          order_id: order_id,
          deliveryname: this.data.deliveryname,
          deliverytel: this.data.deliverytel
        }
      })
    }
  },
  inputChange1: function(e) {
    //保存input框的值
    console.log(e.detail)
    this.setData({
      deliveryname: e.detail.value
    })
  },
  calculateDis: function (longitude_user,latitude_user) {
    let tempMarkers = [{
      iconPath: "../../../images/foodLocation.png",
      id: 2,
      latitude: 32.108430,
      longitude: 118.933370,
      width: 30,
      height: 30
    }, {
      iconPath: "../../../images/foodLocation.png",
      id: 3,
      latitude: 32.111720,
      longitude: 118.933180,
      width: 30,
      height: 30
    }, {
      iconPath: "../../../images/foodLocation.png",
      id: 4,
      latitude: 32.117280,
      longitude: 118.933580,
      width: 30,
      height: 30
    }, {
      iconPath: "../../../images/expressLocation.png",
      id: 5,
      latitude: 32.116340,
      longitude: 118.935340,
      width: 30,
      height: 30
    }]
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
          _this.data.markers.push(tempMarkers[3])
          _this.distance(userLocation, locationList)
          _this.setData({
            food_location: tempFood_Location,
            markers: _this.data.markers,
          })
        } else {
          //食品
          db.collection('foods').where({
            _id: tempDataID
          }).get().then(res => {
            if (res.data[0].location == "南一") {
              if (!tempFood_Location[0]) {
                tempFood_Location[0] = true
                locationList += '32.108430,118.933370;'
                _this.data.markers.push(tempMarkers[0])
                console.log("南一" + locationList)
                _this.distance(userLocation, locationList)
                _this.setData({
                  food_location: tempFood_Location,
                  markers: _this.data.markers,
                })
              }
            } else if (res.data[0].location == "南二") {
              if (!tempFood_Location[1]) {
                tempFood_Location[1] = true
                locationList += '32.111720,118.933180;'
                _this.data.markers.push(tempMarkers[1])
                console.log("南二" + locationList)
                _this.distance(userLocation, locationList)
                _this.setData({
                  food_location: tempFood_Location,
                  markers: _this.data.markers,
                })
              }
            } else if (res.data[0].location == "南三") {
              if (!tempFood_Location[2]) {
                tempFood_Location[2] = true
                locationList += '32.117280,118.933580;'
                _this.data.markers.push(tempMarkers[2])
                console.log("南三" + locationList)
                _this.distance(userLocation, locationList)
                _this.setData({
                  food_location: tempFood_Location,
                  markers: _this.data.markers,
                })
              }
            }
          })
        }

      });
    })
  },

  inputChange2: function(e) {
    //保存input框的值
    console.log(e.detail)
    this.setData({
      deliverytel: e.detail.value
    })

    //this.showWay(),
  },
  distance: function (a, b) {
    console.log("调用腾讯地图SDK" + a + b)
    var _this = this;
    console.log(a)
    //调用距离计算接口
    qqmapsdk.calculateDistance({
      //mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
      //from参数不填默认当前地址
      //获取表单提交的经纬度并设置from和to参数（示例为string格式）
      from: a, //若起点有数据则采用起点坐标，若为空默认当前地址
      to: b.substr(0, b.length - 1), //终点坐标
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
              tip: "跨店订单"
            })
          } else {
            _this.setData({
              tip: "订单"
            })
          }
        }
        _this.setData({ //设置并更新distance数据
          distance: dis,
          totalTime: totalDis/_this.data.speed_user,
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
  onShow: function() {
    
  }

})