var app = getApp();
var that;
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
Page({
  data: {
    imgheight:150,
    nickName: '',
    headImg: '/images/headimg.png',
    headImgHeight:'190rpx',
    topMargin:'80rpx',
    show:false,
    if_doctor:false,
    know:false,
  },
  onLoad: function (query) {
    that = this;
    let locscene = wx.getStorageSync('scene')||0;
    let scene = decodeURIComponent(query.scene);
    if(locscene==0){
      if(scene=="undefined"){
        scene = 0;
      }
      wx.setStorageSync('scene', scene);
    }
    console.log(scene);
    let know = wx.getStorageSync('know')||false;
    console.log(know);
    var width = wx.getSystemInfoSync().windowWidth;
    console.log(width);
    this.setData({
      know:know,
      imgheight: width * 0.62,      
      headImgHeight: width * 0.24,
      topMargin: width*0.12,
    });
    if(app.globalData.first){
      that.wxlogin();
    }    
  },
  onShow(){
    var userInfo = app.globalData.userInfo||{};
    that.setData({
      nickName: userInfo.nickname ? userInfo.nickname :"微信授权",
      headImg: userInfo.headimgurl ? userInfo.headimgurl : "/images/headimg.png",
    })    
    if(app.globalData.if_doctor){
      this.setData({
        if_doctor:true
      })
    }
  },
  wxlogin(){
    wx.showLoading({
      title: '登录中~~',
      mask:true
    })
    wx.getSetting({
      success: (res) => {
        console.log(res);
        wx.hideLoading();
        
        app.globalData.first = false;

        if (res.authSetting['scope.userInfo']) {
          util.login().then(function(result){
            console.log(result)
            if(result.errcode===0){
              app.globalData.if_test = false;
              app.globalData.userInfo = result.userInfo;
              wx.setStorageSync('userInfo', result.userInfo);
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
              }                  
            }
          })
        }
      }
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
      wx.hideLoading();
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

      that.onShow();
      if(that.data.callBack!=undefined){
        that.data.callBack();
      }else{
        //是否医生
        if (result.if_doctor) {
          app.globalData.doctor = result.doctor;
          wx.reLaunch({
            url: '/pages/doctor/index'
          })
        }  
      }   
    })
  },
  i_know(){
    wx.setStorageSync('know', true);
    that.setData({
      know:true
    })
  },
  see_next(){
    that.setData({
      know:true
    })
  },
  know(){
    that.setData({
      know:false
    })
  },
  go:function(){
    if(this.data.if_doctor){
      wx.reLaunch({
        url: '/pages/doctor/index'
      })
    }else{
      this.setData({
        if_doctor: false
      })
    }
  },
  no(){
    that.setData({
      auth:false
    })
  },
  info:function(){
    if(app.globalData.if_test){
      that.setData({
        auth:true,
        callBack:function(){
          that.info();
        },

      })
    }else{
      wx.navigateTo({
        url: '/pages/personal/info'
      })
    } 
    
  },
  history:function(){
    if(app.globalData.if_test){
      that.setData({
        auth:true,
        callBack:function(){
          that.history();
        }
      })
    }else{
      let if_information = app.globalData.if_information;
      if (if_information) {
        wx.navigateTo({
          url: '/pages/personal/history'
        })
      } else {
        //弹出信息
        this.setData({
          show: true
        })
      }
    }    
  },
  go_test:function(){
    if(app.globalData.if_test){
      wx.navigateTo({
        url: '/pages/evaluation/form1'
      })
    }else{
      let if_information = app.globalData.if_information;
      if (if_information){
        wx.navigateTo({
          url: '/pages/evaluation/form1'
        })
      }else{
        //弹出信息
        this.setData({
          show:true
        })
      } 
    }       
  },
  cancel(){
    //弹出信息
    this.setData({
      show: false
    })
  },
  map(){
    wx.navigateTo({
      url: '/pages/ifram/index'
    })
  },
  onShareAppMessage: function () {
    return app.globalData.shareMessage
  }  
})