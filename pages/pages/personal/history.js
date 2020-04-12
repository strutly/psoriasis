var app = getApp()
var that;
var log = require('../../../utils/log.js');
var api = require('../../../utils/api.js');
var util = require('../../../utils/util.js');
Page({
  data: {
    lists: [],
    show:false,
    pro: false
  },
  onLoad: function (option) {
    console.log('info.js onload');
    that = this;
    var if_information = app.globalData.if_information;
    //获取历史记录判断是否填写个人信息
    if (if_information){
      util.request(api.PersonalEvaluationList,{},"get").then(function(result){
        log.info(result);
        if (result.errcode == 0) {
          var lists = result.data;
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
          util.error(that, result.errmsg);
        }
      });
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
