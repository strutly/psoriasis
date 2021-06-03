var that;
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
Page({
  data: {
    lists:[],
    total:0,
    codeHeight:"200px"
  }, 
  onLoad: function (options) {
    that = this;
    var width = wx.getSystemInfoSync().windowWidth;
    that.setData({
      codeHeight: width * 0.8 * 0.8 + "px",
    })
    that.getList(1);
  },
  getList(page){
    util.request(api.SpreadStatistics,{page:page},"get").then(res=>{
      console.log(res);
      if(res.errcode==0){
        let lists = that.data.lists;
        lists = lists.concat(res.data.result);
        that.setData({
          lists:lists,
          total:res.data.totalCount,
          totalPages:res.data.totalPages,
          page:res.data.pageNo
        })
      }else{
        util.prompt(that,res.errmsg);
      }
    })
  },
  spread(){
    if(that.data.base64ImgUrl){
      that.setData({
        show:true
      })
    }else{
      util.request(api.Spread,{},"get").then(res=>{
        console.log(res);
        that.setData({
          show: true,
          base64ImgUrl: "data:image/png;base64," + res.data.replace(/[\r\n]/g, "")
        })
      })
    }    
  },
  cancle(){
    that.setData({
      show:false
    })
  },
  onReachBottom(){
    let page = that.data.page;
    let totalPages = that.data.totalPages;
    if(page<totalPages){
      let pageNo = page + 1;
      that.getList(pageNo);
    }    
  },
})