//main.js
//获取应用实例
const app = getApp();
var log = require('../../utils/log.js');
var util = require('../../utils/util.js');
var api = require('../../utils/api.js');
var that;
Page({
  data:{
    height:'30%',
    show: false,
    warnmsg: '',
    showerr:false
  },
  prompt: function (msg) {
    var that = this;
    that.setData({
      showerr: true,
      warnmsg: msg
    });
    
    setTimeout(function () {
      that.setData({
        show: false,
        warnmsg: ""
      })
    }, 2500);
  },
  onLoad: function(options) {
    that = this;
    console.log("main.js----onload");   
  },  
  showAuthorize:function (){
    this.setData ({
      show:true
    })
  },
  hiddenAuthorize:function(){
    this.setData({
      show: false
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
      return util.request(api.WxAuth,JSON.stringify({
        code: res,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        signature: e.detail.signature,
        rawData: e.detail.rawData
      }),"post");
    }).then(function(result){
      console.log(result)
      wx.hideLoading();
      if(result.errcode==0){
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
        console.log(1)
        that.prompt("授权失败,请稍后再试!");
      }
    }).catch(function(err){
      console.log(2)
      that.prompt("授权失败,请稍后再试!");
      wx.hideLoading();
    });
  },
  cancel:function(){
    //拒绝直接进入自测
    this.setData({
      show: false
    });
    wx.navigateTo({
      url: '/pages/pages/evaluation/form1',
    })
  },
  onShareAppMessage: function () {
      return {
        title: '银屑病智能风险管理',
        imageUrl: '/pages/image/share_img.png',
        path: '/pages/index/index',
      }
   }
})