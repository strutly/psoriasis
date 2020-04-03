var app = getApp()
var domain = app.globalData.host;
var util = require('../../../utils/util.js');
Page({
  data: {
    lists: [],
    show:false,
    pro: false
  },
  onLoad: function (option) {
    var unionid = app.globalData.unionid;
    console.log('info.js onload');
    var that = this;
    var if_information = app.globalData.if_information;
    //获取历史记录判断是否填写个人信息
    if (if_information){
      wx.request({
        url: domain + `/wxs/evaluation/list?unionid=` + unionid,
        method: 'get',
        success: function (result) {
          console.log(result);
          if (result.data.errcode == 0) {
            var lists = result.data.data;
            if (lists != null && lists.length > 0) {
              that.setData({
                lists: lists,
                pro: false
              })
            } else {
              that.setData({
                pro: true
              })
            }
          }else {
            util.error(that, result.data.errmsg);
          }
        },
        error: function (res) {
          util.error(that, result.data.errmsg);
        }
      })
    }else{
      that.setData({
        show: true
      })
    }    
  },  
  detail:function(e){
    const id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/pages/personal/evaluation_detail?id='+id
      //url: '/pages/pages/evaluation/result?id='+id
    })
  },
  info: function () {
    wx.navigateTo({
      url: '/pages/pages/personal/info'
    })
  },
  cancel: function () {
    util.back();
  },
  onShareAppMessage: function () {
    return {
      title: '银屑病智能风险管理',
      imageUrl: '/pages/image/share_img.png',
      path: '/pages/index/index',
    }
  }
})
