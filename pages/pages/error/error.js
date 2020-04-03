var util = require('../../../utils/util.js');
Page({
  data: {
    error:true,
    errmsg: '糟糕 !!! 好像出错了!',
  },
  onLoad: function (options) {
    console.log(options);
    if (options && options.errmsg != undefined){
       this.setData({
        errmsg: options.errmsg
      }) 
    } 
  },
  back:function(){
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