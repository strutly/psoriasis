//index.js
//获取应用实例
const app = getApp()
var domain = app.globalData.host;
var log = require('../../utils/log.js');
Page({
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function(options) {
    
    log.info('index.js----onload');
    console.log("index.js----onload");
    wx.showLoading({
      title: '登录中',
    });
    
    //根据code获取openid等信息    
    wx.login({
      success: function (res) {
        console.log(res);
        var code = res.code; //返回code
        wx.request({
          url: domain + '/wxs/rest/code2Session?code=' + code,
          method: 'get',
          dataType: 'json',
          success: function (response) {
            log.error(response);
            console.log(response);
            var result = response.data;                       
            if (result.errcode == 0) {
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
                  //url: '/pages/pages/personal/index'
                })
                // app.globalData.if_information = result.if_information;
                // wx.reLaunch({
                //   url: '/pages/pages/error/error'
                // })
              } else {
                wx.reLaunch({
                  url: '/pages/pages/personal/index'
                })
              }
            }else{
              wx.reLaunch({
                url: '/pages/index/main'
              })
            }
          },
          fail: function (e) {
            log.error(e);
            console.log(e);
            wx.reLaunch({
              url: '/pages/index/main'
            })
          },
          complete:function(){
            wx.hideLoading();
          }
        })
      }, fail: function () {
        console.log("失败");
        wx.reLaunch({
          url: '/pages/index/main'
        })
      }
    })    
  }
})