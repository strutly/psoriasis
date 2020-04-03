var app = getApp();
Page({
  data: {
    imgheight:150,
    nickName: '',
    headImg: '/pages/image/headimg.png',
    headImgHeight:'190rpx',
    topMargin:'80rpx',
    show:false,
    if_doctor:false
  },
  onLoad: function () {
    console.log("persion-index.js----onload");
    console.log(new Date().getTime() - app.globalData.time)
    var width = wx.getSystemInfoSync().windowWidth;
    console.log(width);
    var userInfo = app.globalData.userInfo;
    this.setData({
      imgheight: width * 0.62,
      nickName: userInfo.nickname ? userInfo.nickname :"",
      headImg: userInfo.headimgurl ? userInfo.headimgurl : "/pages/image/headimg.png",
      headImgHeight: width * 0.24,
      topMargin: width*0.12,
    });
    if(app.globalData.if_doctor){
      this.setData({
        if_doctor:true
      })
    }
  },
  go:function(){
    if(this.data.if_doctor){
      wx.reLaunch({
        url: '/pages/pages/doctor/index'
      })
    }else{
      this.setData({
        if_doctor: false
      })
    }
  },
  info:function(){    
    wx.navigateTo({
      url: '/pages/pages/personal/info'
    })
  },
  history:function(){
    let if_information = app.globalData.if_information;
    if (if_information) {
      wx.navigateTo({
        url: '/pages/pages/personal/history'
      })
    } else {
      //弹出信息
      this.setData({
        show: true
      })
    }    
  },
  go_test:function(){
    let if_information = app.globalData.if_information;
    if (if_information){
      wx.navigateTo({
        url: '/pages/pages/evaluation/form1'
      })
    }else{
      //弹出信息
      this.setData({
        show:true
      })
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
      url: '/pages/pages/ifram/index'
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