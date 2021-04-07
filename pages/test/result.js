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
    log.info(e);
    console.log(e);
    wx.showLoading({
      mask:true,
      title: '授权中~~',
    })
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      wx.hideLoading();
      if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
        that.prompt("授权失败");
        return false;
      }
      return false;
    };
    util.getCode().then(function(res){
      wx.hideLoading();
      util.request(api.WxAuth,JSON.stringify({
        code: res,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        signature: e.detail.signature,
        rawData: e.detail.rawData,
        scene:wx.getStorageSync('scene'),
        appOpenid:wx.getStorageSync('appOpenid')
      }),"post");
    }).then(function(result){
      console.log(result)
      wx.hideLoading();
      if(result.errcode==0){
        app.globalData.if_test = false;
        app.globalData.userInfo = result.userInfo;
        app.globalData.if_doctor = result.if_doctor;
        app.globalData.if_information = result.if_information;
        console.log(app.globalData);
        wx.setStorageSync('token', result.token);
        //是否医生
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
      }else{
        console.log(1)
        that.prompt("授权失败,请稍后再试!");
      }
    }).catch(function(err){
      console.log(2)
      that.prompt("授权失败,请稍后再试!");
      wx.hideLoading();
    });
  },
  onShareAppMessage: function () {
    return app.globalData.shareMessage
  } 
})