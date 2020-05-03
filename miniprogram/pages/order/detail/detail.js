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
    markers: [{
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
    }],
    deliveryfee:0,
    food_location:[false,false,false,false],
    locationList:'',
    distance:[],
    totalDistance:0,
    is_CrossStore:false,
    tip:'',
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

          logitude_food: res.data[0].geoPoint[0][0],
          latitude_food: res.data[0].geoPoint[0][1],
          markers: this.data.markers,

          deliveryfee:data.data[0].deliveryfee,
        })
        this.calculateDis()
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
        deliveryfee:this.data.deliveryfee,
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
           wx.cloud.callFunction({
             name:'is_taken',
             data:{
               _id:res.data[0]._id,
               is_taken:_that.data.is_taken,
               taken_time:_that.data.taken_time,
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
  distance:function(a,b){
    var _this = this;
    console.log(b)
    //调用距离计算接口
    qqmapsdk.calculateDistance({
      //mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
      //from参数不填默认当前地址
      //获取表单提交的经纬度并设置from和to参数（示例为string格式）
      from: a, //若起点有数据则采用起点坐标，若为空默认当前地址
      to: b, //终点坐标
      success: function (res) {//成功后的回调
        console.log(res);
        var res = res.result;
        var dis = [];
        var totalDis = 0;
        var flag = false;
        for (var i = 0; i < res.elements.length; i++) {
          dis.push(res.elements[i].distance); //将返回数据存入dis数组，
          totalDis += res.elements[i].distance;
          if (i>0){
            flag=true
          }
        }
        _this.setData({ //设置并更新distance数据
          distance: dis,
          totalDistance:totalDis/1000.0,
          is_CrossStore:flag
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
  showWay: function(a,b) {
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
            color: '#90EE90',
            width: 5
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
  calculateDis:function(){
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
    var userLocation = String(this.data.latitude_user + "," + this.data.logitude_user)
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
          this.data.markers.push(tempMarkers[3])
        } else {
          //食品
          db.collection('foods').where({
            _id: tempDataID
          }).get().then(res => {
            console.log(res)
            if (res.data[0].location == "南一") {
              if(!tempFood_Location[0]){
                tempFood_Location[0] = true
                locationList += '32.108430,118.933370;'
                _this.data.markers.push(tempMarkers[0])
              }
            } else if (res.data[0].location == "南二") {
              if (!tempFood_Location[1]) {
                tempFood_Location[1] = true
                locationList += '32.111720,118.933180;'
                _this.data.markers.push(tempMarkers[1])
              }
            } else if (res.data[0].location == "南三") {
              if (!tempFood_Location[2]) {
                tempFood_Location[2] = true
                locationList += '32.117280,118.933580;'
                _this.data.markers.push(tempMarkers[2])
              }
            }
            locationList = locationList.substr(0, locationList.length - 1)
            _this.distance(userLocation, locationList)
          })
        }
      });
      this.setData({
        food_location: tempFood_Location,
        markers: this.data.markers,
      })
    })


    //this.showWay(),
  },
  onShow: function() {
    

  },
})