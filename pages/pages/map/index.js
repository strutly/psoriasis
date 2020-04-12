var app = getApp();
var that;
var log = require('../../../utils/log.js');
var api = require('../../../utils/api.js');
var util = require('../../../utils/util.js');
const formatLocation = util.formatLocation;
Page({
  data: {
    height:'100%',
    markers: [],    
    hasLocation: false,
    latitude: 22.260344,
    longitude: 114.173355 
  },
  onLoad:function(){
    that = this;
    var height = wx.getSystemInfoSync().windowHeight;
    this.setData({
      height:height+"px",
    });
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res);
        that.setData({
          latitude:res.latitude,
          longitude:res.longitude
        })
      }
    });
    util.request(api.MobAll,{},"get").then(function(result){
      log.info(result);
      if (result.errcode == 0) {
        var lists = result.data;
        if (lists != '' && lists.length > 0) {
          var markers = [];
          for (var i = 0; i < lists.length;i++){
            markers.push({
              iconPath: "/pages/image/marker.png",
              id: lists[i].id,
              latitude: lists[i].latitude,
              longitude: lists[i].longitude,
              width: 32,
              height: 32
            })
          }
          that.setData({
            markers: markers
          })
        }
      } else {
        wx.navigateTo({
          url: '/pages/pages/error/error?errmsg=' + result.errmsg
        })
      }
    });
  },
  regionchange(e) {
    console.log(e);
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId);
    wx.navigateTo({
      url: '/pages/pages/map/detail?id='+e.markerId
    })
  },
  controltap(e) {
    console.log(e);
    console.log(e.controlId)
  },
  
  add(){
    wx.navigateTo({
      url: '/pages/pages/map/add'
    })
  }
})