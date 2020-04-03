const util = require('../../../utils/util.js')
const formatLocation = util.formatLocation;
var app = getApp()
var domain = app.globalData.host;
Page({
  data: {
    mob:"",
  },
  onLoad: function (options) {
    var id = options.id;
    var unionid = app.globalData.unionid;
    var that = this;
    wx.request({
      url: domain + `/wxs/mob/detail/` + id + `?unionid=` + unionid,
      method: 'get',
      success: function (result) {
        console.log(result);
        if (result.data.errcode == 0) {
          that.setData({
            mob: result.data.data,
          })
        } else {
          wx.navigateTo({
            url: '/pages/pages/error/error?errmsg=' + result.data.errmsg
          })
        }
      },
      error: function (res) {
        wx.navigateTo({
          url: '/pages/pages/error/error?errmsg=' + JSON.stringify(res)
        })
      }
    })   
  },
  prompt: function (msg) {
    this.setData({
      show: true,
      warnmsg: msg
    })
    var that = this;
    setTimeout(function () {
      that.setData({
        show: false,
        warnmsg: ""
      })
    }, 1500);
  },
  previewImage:function(e){
    console.log(e);
    var that = this;    
    const current = e.target.dataset.src;
    console.log(current);
    console.log(that.data.mob.imgList)
    wx.previewImage({
      current,
      urls: that.data.mob.imgList
    })
  },
  
})