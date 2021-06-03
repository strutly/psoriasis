const app = getApp();
var that;
var log = require('../../utils/log.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
Page({
  data: {
    imgheight:200,
    headImgHeight: '190rpx',
    topMargin: '80rpx',
    top:350,
    height:'100%',
    warnmsg: '',
    show:false,
    showmodal:false
  },
  prompt: function (msg) {
    that.setData({
      show: true,
      warnmsg: msg
    })
    setTimeout(function () {
      that.setData({
        show: false,
        warnmsg: ""
      })
    }, 1500);
  },
  onLoad: function () {
    that = this;
    console.log("test-result.js----onload");
    var width = wx.getSystemInfoSync().windowWidth;
    var height = wx.getSystemInfoSync().windowHeight;
    console.log(width);
    this.setData({
      imgheight: width * 0.62,
      headImgHeight: width * 0.24,
      topMargin: width * 0.12,
      height: (height - width*1.2)+"px"
    })     
  },
  onReady:function(){

  },
  showbutton:function(){
    this.setData({
      showmodal:true
    })
  },
  cancel:function(){
    wx.reLaunch({
      url: '/pages/personal/index',
    })
  },
  getDatas: function(e) {
    console.log(e);
    wx.showLoading({
      mask:true,
      title: '授权中~~',
    })
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      wx.hideLoading();
      if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
        util.prompt(that,"授权失败");
        return false;
      }
      return false;
    };
    util.auth().then(function(result){
      console.log(result);
      
      that.setData({
        auth:false
      })
      app.globalData.if_test = false;
      app.globalData.userInfo = result.userInfo;
      app.globalData.if_doctor = result.if_doctor;
      app.globalData.if_information = result.if_information;
      console.log(app.globalData);
      if(result.if_information){
        app.globalData.information = result.information;
      }
      wx.setStorageSync('token', result.token);     
      if (result.if_doctor) {
        app.globalData.doctor = result.doctor;
        wx.reLaunch({
          url: '/pages/doctor/index'
        })
      } else {
        wx.reLaunch({
          url: '/pages/personal/index'
        })
      } 
    }).catch((err) => {
      wx.hideLoading();
      console.log(err);
      util.prompt(that,err.errMsg)
    })
  },
  onShareAppMessage: function () {
    return app.globalData.shareMessage
  } 
})