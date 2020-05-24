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
    
    wx.getSetting({
      success: (res) => {
        console.log(res);
        if (!res.authSetting['scope.userInfo']) { 
          wx.reLaunch({
            url: '/pages/index/main'
          })
        }else{
          util.login().then(function(result){
            wx.hideLoading();
            log.info(result);
            if(result.errcode===0){
              app.globalData.if_test = false;
              app.globalData.userInfo = result.userInfo;
              wx.setStorageSync('userInfo', result.userInfo);
              app.globalData.if_doctor = result.if_doctor;
              app.globalData.if_information = result.if_information;
              console.log(app.globalData);
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
      }
    })    
  }
})