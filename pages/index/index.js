//index.js
//获取应用实例
const app = getApp()
var log = require('../../utils/log.js');
var util = require('../../utils/util.js');
Page({  
  onLoad: function(options) {
    wx.showLoading({
      title: '登录中~~',
      mask:true
    })
    console.log("index--onload")
    util.login().then(function(result){
      wx.hideLoading();
      log.info(result);
      if(result.errcode===0){
        app.globalData.if_test = false;
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
        };
        wx.setStorageSync('token', result.token);      
      }else{
        wx.reLaunch({
          url: '/pages/index/main'
        })
      }
    }).catch(function(res){
      wx.hideLoading();
      wx.reLaunch({
        url: '/pages/index/main'
      })
    })      
  }
})