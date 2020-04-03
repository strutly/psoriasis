const util = require('../../../utils/util.js');
const formatLocation = util.formatLocation;
var app = getApp();
var domain = app.globalData.host;
Page({
  data: {
    height:'100%',
    markers: [],    
    hasLocation: false,
    latitude: 22.260344,
    longitude: 114.173355 
  },
  onLoad:function(){
    var that = this;
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
    })
    
    var unionid = app.globalData.unionid;
    wx.request({
      url: domain + `/wxs/mob/all?unionid=` + unionid,
      method: 'get',
      success: function (result) {
        console.log(result)
        if (result.data.errcode == 0) {
          var lists = result.data.data;
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
            console.log(markers);       
            that.setData({
              markers: markers,
              
            })
          }
        } else {
          wx.navigateTo({
            url: '/pages/pages/error/error?errmsg=' + result.data.errmsg
          })
        }
      },
      error: function (res) {
        wx.navigateTo({
          url: '/pages/pages/error/error?errmsg=' + JSON.stringify(res)
        })
      }
    })
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