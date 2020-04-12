// pages/pages/details.js
const app = getApp();
var that;
var log = require('../../../utils/log.js');
var api = require('../../../utils/api.js');
var util = require('../../../utils/util.js');
Page({
  data: {
    opens:[false,false,false,false,false],
    evaluation:null,
    code:'',
    doctor:null,
    arraylife: ['毫无影响', '有轻微影响', '有相当程度影响', '有十分严重的影响', '有极度影响，几乎病痛不欲生'],
    show:false,
    tab:0,
    codeHeight:'100%',
  },
  changeTab:function(e){
    const index = e.currentTarget.dataset.index;
    that.setData({
      tab:index
    })    
  },
  kindToggle(e) {
    const index = e.currentTarget.dataset.index;
    const opens = this.data.opens;
    const set_val = 'opens['+index+']';
    that.setData({
      [set_val]:!opens[index]
    });    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    console.log(app.globalData);
    var width = wx.getSystemInfoSync().windowWidth;
    that.setData({
      codeHeight: width * 0.8 * 0.8 + "px"
    })
    console.log('evaluation_detail.js onload');
    var id = options.id;    
    util.request(api.PersonalEvaluationDetail+id,{},"get").then(function(result){
      log.info(result);
      if (result.errcode == 0) {
        that.setData({
          evaluation: result.data,
          code: "data:image/png;base64," + result.code.replace(/[\r\n]/g, ""),
        })
        if (result.doctor){
          that.setData({
            doctor: result.doctor
          })
        }
      } else {
        util.error(that,result.errmsg);
      }
    });   
  },
  share_result:function(){
    that.setData({
      show: true,      
    })
  },
  cancle:function(){
    that.setData({
      show: false,
    })
  },
  home:function(){
    wx.navigateTo({
      url: '/pages/pages/personal/index'
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