var app = getApp()
var that;
var log = require('../../../utils/log.js');
var api = require('../../../utils/api.js');
var util = require('../../../utils/util.js');
const formatLocation = util.formatLocation;
Page({
  data: {
    mob:"",
  },
  onLoad: function (options) {
    log.info(options);
    var id = options.id;
    that = this;
    util.request(api.MobDetail+id,{},"get").then(function(result){
      log.info(result);
      if (result.errcode == 0) {
        that.setData({
          mob: result.data,
        })
      } else {
        wx.navigateTo({
          url: '/pages/pages/error/error?errmsg=' + result.errmsg
        })
      }
    });  
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