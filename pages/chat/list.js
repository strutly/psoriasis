var app = getApp()
var that;
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
Page({
  data: {
    lists: {},
    type:"",
    noData:false
  },
  onLoad: function (options) {
    console.log('info.js onload');
    that = this;
    let type = options.type;
    util.request(api.ChatFriends+type,{},"get").then(function(result){
      console.log(result)
      if(result.data[0].list!=null){
        that.setData({
          lists: result.data[0].list,
          type: type
        })
      }else{
        that.setData({
          noData:true
        })
      }
    })           
  },
  tip(){
    that.setData({
      tips:true
    })
    setTimeout(function () {
      that.setData({
        tips: false
      })
    }, 3000);
  },  
  chat:function(e){
    console.log(e);
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let set_key = 'lists['+index+'].unRead'
    that.setData({
      [set_key]:0
    })
    console.log(id);
    console.log(index)
    wx.navigateTo({
      url: '/pages/chat/chat?id='+id+"&type="+that.data.type
    })
  },
  back: function () {
    util.back();
  },
  onShareAppMessage: function () {
    return app.globalData.shareMessage
  } 
})
