const app = getApp();
var that;
var that;
var log = require('../../../utils/log.js');
var api = require('../../../utils/api.js');
var util = require('../../../utils/util.js');
Page({
  data: {
    tab:0,
    opens:[false,false,false],
    treat:{}
  },
  onLoad: function (option) {
    that = this;
    let vals = wx.getStorageSync('treat')||{};
    that.setData({
      treat:vals
    })
  },
  changeTab: function (e) {
    /* 左右切换*/
    const index = e.currentTarget.dataset.index;
    this.setData({
      tab: index
    })
  },
  kindToggle(e) {
    const index = e.currentTarget.dataset.index;
    const opens = this.data.opens;
    const set_val = 'opens[' + index + ']';
    that.setData({
      [set_val]: !opens[index]
    });
  },
  other(e){
    console.log(e);
    let vals = wx.getStorageSync('treat')||{};
    let title = e.target.dataset.title;
    let level = e.target.dataset.level;
    let val = e.detail.value;
    console.log(level===1)
    if(level==1){
      vals.other = val;
    }else{
      if(vals[title]==undefined){
        vals[title] = {};
      }
      vals[title].other = val
    }    
    that.setData({
      treat: vals
    })
    wx.setStorageSync('treat', vals);
  },
  treat(e){
    console.log(e);
    let vals = wx.getStorageSync('treat')||{};
    let title = e.target.dataset.title;
    console.log(title)
    let val = e.detail.value;
    if(vals[title]==undefined){
      vals[title] = {};
    }
    vals[title].check = val
    that.setData({
      treat: vals
    })
    wx.setStorageSync('treat', vals);
  },
  textarea(e){
    console.log(e);
    let vals = wx.getStorageSync('treat')||{};
    let type = e.target.dataset.type;
    vals[type] = e.detail.value;
    that.setData({
      treat: vals
    })
    wx.setStorageSync('treat', vals);
  },  
  submit: function () {   
    var globalData = app.globalData;
    var if_test = app.globalData.if_test;
    if (if_test){
      wx.navigateTo({
        url: '/pages/pages/test/result'
      });
      wx.removeStorageSync('treat');
    }else{
      let basic = wx.getStorageSync('basic');
      let treat = wx.getStorageSync('treat')||{};
      //组装数据
      var datas = {
        'height':basic.height,
        'weight':basic.weight,
        'incidenceTime':basic.incidenceTime,
        'datet1': globalData.data.result1[0],//面积
        'datet2': globalData.data.result1[1],//红斑
        'datet3': globalData.data.result1[2],//鳞屑
        'datet4': globalData.data.result1[3],//厚度
        'level': globalData.data.level,//生活质量评分
        'if_1': globalData.data.result2[0],//关节炎相关情况1
        'if_2': globalData.data.result2[1],//2
        'if_3': globalData.data.result2[2],//3
        'if_4': globalData.data.result2[3],//4
        'if_5': globalData.data.result2[4],//5
        'if_6': globalData.data.result2[5],//6
        'if_7': globalData.data.result2[6],//7
        //新表
        'checkvalue1': globalData.data.checkvalue1,//是否诊断银屑病
        'time1': globalData.data.time1,//诊断银屑病时间
        'checkvalue2': globalData.data.checkvalue2,//是否诊断银屑病关节炎
        'time2': globalData.data.time2,//诊断银屑病关节炎时间
      };
      datas.treat = ""+JSON.stringify(treat)+"";
      console.log(datas);
      wx.showLoading({
        title: '提交中',
        mask:true
      })
      util.request(api.EvaluationForm,JSON.stringify(datas),"POST").then(function(result){
        log.info(result);
        wx.hideLoading();
        if (result.errcode == 0) {
          wx.removeStorageSync('treat');
          wx.navigateTo({
            url: '/pages/pages/evaluation/result?id='+result.data
          })
        } else{
          wx.hideLoading();
          util.error(that, result.errmsg);
        }
      })
    }
  }, 
})