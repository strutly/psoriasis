var app = getApp();
var that;
var util = require('../../utils/util.js');
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
    tab:1,
    canIUse:wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function (query) {
    that = this;
    console.log(query);
    let locscene = wx.getStorageSync('scene');
    let scene = decodeURIComponent(query.scene);
    let openId = decodeURIComponent(query.openId);

    let appOpenid = wx.getStorageSync('appOpenid');
    if(scene != "undefined"){
      if(locscene == ""){      
        locscene = scene;
        wx.setStorageSync('scene', locscene);
      }
    }

    if(openId != "undefined"){
      if(appOpenid ==''){
        appOpenid = openId;
        wx.setStorageSync('appOpenid', appOpenid);
      }
    }
    console.log(scene);
    let know = app.globalData.know;
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
    console.log(userInfo)
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
  async getDatas(e) {
    let res = {};
    try {
      res = await wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      })
    } catch (error) {
      return util.prompt(that,"授权失败,请重试~");
    }
    if(res.errMsg !=="getUserProfile:ok"){
        return util.prompt(that,"授权失败");
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
    }).catch((err) => {
      wx.hideLoading();
      console.log(err);
      util.prompt(that,err.errMsg)
    })
  },
  i_know(){
    wx.setStorageSync('know', true);
    app.globalData.know = true;
    that.setData({
      know:true
    })
  },
  see_next(){
    app.globalData.know = true;
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
      auth:false,
      callBack:null
    });
  },
  info:function(){
    if(app.globalData.if_test){
      that.setData({
        auth:true,
        callBack:function(){
          that.info();
        }
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
  chat(){
    if(app.globalData.if_test){
      that.setData({
        auth:true,
        callBack:function(){
          that.chat();
        }
      })
    }else{
      let if_information = app.globalData.if_information;
      if (if_information) {
        wx.navigateTo({
          url: '/pages/chat/list?type=mobile'
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
  tab(e){
    console.log(e);
    that.setData({
      tab:e.currentTarget.dataset.index
    })
  },
  onShareAppMessage: function () {
    return app.globalData.shareMessage
  }  
})