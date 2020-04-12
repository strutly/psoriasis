const app = getApp();
var that;
var log = require('../../../utils/log.js');
var util = require('../../../utils/util.js');
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
    this.setData({
      show: true,
      warnmsg: msg
    })
    var that = this;
    setTimeout(function () {
      that.setData({
        show: false,
        warnmsg: ""
      })
    }, 1500);
  },
  onLoad: function () {
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
      url: '/pages/index/main',
    })
  },
  getDatas: function(e) {
    console.log(e);
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
        that.prompt("授权失败");
        return false;
      }
      return false;
    };

    util.auth().then(function(result){
      log.debug(result);
      if(result.errcode==0){
        app.globalData.unionid = result.unionid;
        app.globalData.userInfo = result.userInfo;
        app.globalData.if_doctor = result.if_doctor;
        app.globalData.if_information = result.if_information;
        console.log(app.globalData);
        if(result.if_information){
          app.globalData.information = result.information;
        }
        //是否医生
        if (result.if_doctor) {
          app.globalData.doctor = result.doctor;
          wx.reLaunch({
            url: '/pages/pages/doctor/index'
          })
        } else {
          wx.reLaunch({
            url: '/pages/pages/personal/index'
          })
        }
        wx.setStorageSync('token', result.token);
      }else{
        that.prompt("授权失败,请稍后再试!");
      }
    });    
  },
  onShareAppMessage: function () {
    return {
      title: '银屑病智能风险管理',
      imageUrl: '/pages/image/share_img.png',
      path: '/pages/index/index',
    }
  }
})