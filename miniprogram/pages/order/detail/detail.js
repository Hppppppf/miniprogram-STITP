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
    latitude_food: 0,
    logitude_food: 0,
    latitude_user: 0,
    logitude_user: 0,
    polyline: [],
    markers: [],
  },

  onLoad: function(options) {
    //实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: '7IXBZ-2TU63-7EF36-Y6HR2-6LDNT-DTBGQ'
    });
    wx.setNavigationBarTitle({
      title: '订单详情'
    })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var temppromotion = 0
    this.data.id = JSON.parse(options.order_id)

    db.collection('Order').where({
      order_id: this.data.id
    }).get().then(data => {
      console.log(data)
      db.collection('programData').get().then(res => {
        if (data.data[0].orderPrice > res.data[0].promotion[0]) {
          this.setData({
            promotion: res.data[0].promotion[1],
          })
          temppromotion = res.data[0].promotion[1]
        }
        let temp = {
          iconPath: "../../../images/userLocation.png",
          id: 1,
          latitude: data.data[0].location.latitude,
          longitude: data.data[0].location.longitude,
          width: 30,
          height: 30
        }
        this.data.markers.push(temp)
        this.setData({
          order_food: data.data[0].order,
          price: data.data[0].orderPrice - temppromotion,
          create_time: data.data[0].create_time,
          pay_time: data.data[0].pay_time,
          is_taken: data.data[0].is_taken,
          //taken_time:data.data[0].taken_time,
          order_taken: data.data[0].order_taken,
          note: data.data[0].note,
          address: data.data[0].location,
          latitude_user: data.data[0].location.latitude,
          logitude_user: data.data[0].location.longitude,

          latitude_food: res.data[0].geoPoint[0][0],
          logitude_food: res.data[0].geoPoint[0][1],
          markers: this.data.markers,
        })

        this.showWay(),
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
        address: this.data.address,
      })
    })

  },
  onUnload: function() {
    var app = getApp();
    // 支付成功之后调到订单页面，通知订单页刷新
    app.isReloadOrderList = true
    wx.switchTab({
      url: '/pages/order/list/list'
    })
  },

  getfood: function() {
    var _that=this
    wx.showModal({
      title: '提示',
      content: '请务必收到货物后再确认！',
      success(res) {
        if (res.confirm) {
          var time = util.formatTime(new Date());
          _that.setData({
            is_taken: true,
            taken_time: time
          })
          db.collection('Order').where({
            order_id: _that.data.id
          }).get().then(res => {
            db.collection('Order').doc(res.data[0]._id).update({
              data: {
                is_taken: true,
                taken_time: time
              }
            })
          })
        }else if(res.cancel){

        }
      }
    })
  },

  takefood: function() {

  },
  showWay: function() {
    console.log("调用腾讯地图SDK")
    var _this = this;
    //调用距离计算接口
    qqmapsdk.direction({
      mode: 'walking', //'walk'(步行路线规划)
      //from参数不填默认当前地址
      from: String(this.data.latitude_food + ',' + this.data.logitude_food),
      to: String(this.data.latitude_user + ',' + this.data.logitude_user),
      success: function(res) {
        console.log(res);
        var ret = res.result.routes[0];
        var count = ret.steps.length;
        var pl = [];
        var coors = [];
        //获取各个步骤的polyline
        //  for (var i = 0; i < count; i++) {
        //    if (ret.steps[i].mode == 'WALKING' && ret.steps[i].polyline) {
        //      coors.push(ret.steps[i].polyline);
        //    }
        //    if (ret.steps[i].mode == 'TRANSIT' && ret.steps[i].lines[0].polyline) {
        //      coors.push(ret.steps[i].lines[0].polyline);
        //    }
        //  }
        coors.push(ret.polyline);
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 0; i < coors.length; i++) {
          for (var j = 2; j < coors[i].length; j++) {
            coors[i][j] = Number(coors[i][j - 2]) + Number(coors[i][j]) / kr;
          }
        }
        //定义新数组，将coors中的数组合并为一个数组
        var coorsArr = [];
        for (var i = 0; i < coors.length; i++) {
          coorsArr = coorsArr.concat(coors[i]);
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coorsArr.length; i += 2) {
          pl.push({
            latitude: coorsArr[i],
            longitude: coorsArr[i + 1]
          })
        }
        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点

        _this.setData({
          latitude: pl[0].latitude,
          longitude: pl[0].longitude,
          polyline: [{
            points: pl,
            color: '#FF0000DD',
            width: 4
          }]
        })
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
      }
    });
  },
  onShow: function() {
    db.collection('Order').where({
      order_id: this.data.id
    }).get().then(res => {
      this.setData({
        markers: [{
          iconPath: "../../../images/foodLocation.png",
          id: 0,
          latitude: 32.10843,
          longitude: 118.93337,
          width: 30,
          height: 30
        }]
      })
    })
  },
})