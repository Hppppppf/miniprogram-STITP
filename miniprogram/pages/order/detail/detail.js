// pages/order/detail/detail.js
const db = wx.cloud.database(); //初始化数据库
var util = require('../../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    create_time:'',
    pay_time:'',
    is_taken:false,
    id:"",
    taken_time:'',
    note:'',
    address:'',
    latitude:0,
    longitude:0,

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
    }],
  }, 
  
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '订单详情'
    })
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    var temppromotion=0
    this.data.id=JSON.parse(options.order_id)

    db.collection('Order').where({
      order_id:this.data.id
      }).get().then(data=> {
        console.log(data)
      db.collection('programData').get().then(res => {
        if (data.data[0].orderPrice > res.data[0].promotion[0]) {
          this.setData({
            promotion: res.data[0].promotion[1],
          })
          temppromotion = res.data[0].promotion[1]
        }
        this.setData({
          order_food: data.data[0].order,
          price: data.data[0].orderPrice - temppromotion,
          create_time:data.data[0].create_time,
          pay_time:data.data[0].pay_time,
          is_taken:data.data[0].is_taken,
          //taken_time:data.data[0].taken_time,
          note:data.data[0].note,
          address:data.data[0].location,
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
          address: this.data.address,
        })
    })

  },
  onUnload: function () {
    var app = getApp();
    // 支付成功之后调到订单页面，通知订单页刷新
    app.isReloadOrderList = true
    wx.switchTab({
      url: '/pages/order/list/list'
    })
  },
  
  getfood:function(){
    var time = util.formatTime(new Date());
    this.setData({
      is_taken:true,
     taken_time:time
    })
    db.collection('Order').where({
      order_id:this.data.id
    }).get().then(res=>{
      db.collection('Order').doc(res.data[0]._id).update({
         data:{
           is_taken:true,
           taken_time:time
         }
      })
    })
  },
  
  takefood:function(){
    
  },
  onShow:function(){
    db.collection('Order').where({
      order_id: this.data.id
    }).get().then(res=>{
      markers: [{
        iconPath: "/resources/others.png",
        id: 0,
        latitude: res.latitude,
        longitude: res.longitude,
        width: 50,
        height: 50
      }]
      polyline: [{
          points: [{
            latitude: res.latitude,
            longitude: res.longitude
          }, {
            longitude: this.data.address.longitude,
            latitude: this.data.address.latitude
          }],
          color: "#FF0000DD",
          width: 2,
          dottedLine: true
      }]
        
    })
  }
})
