// pages/pages/details.js
const app = getApp();
var domain = app.globalData.host;
var util = require('../../../utils/util.js');
Page({
  data: {
    opens: [false, false, false, false, false],
    evaluation: null,
    information: null,
    arraylife: ['毫无影响', '有轻微影响', '有相当程度影响', '有十分严重的影响', '有极度影响，几乎病痛不欲生'],
    arrayeducation: ['文盲', '小学', '初中', '高中', '大学', '研究生以上'],
    show: false,
    tab: 0,
    handleArray: ['否', '是'],
    multiArray: [['否','是'],[0]],
    handleResult:['','','','','',''],
    show:false,
    num: [[0],[1,2]],
    multiIndex:[0,0],
    error:false,
    errmsg:""
  },
  changeTab: function (e) {
    /* 左右切换*/
    const index = e.currentTarget.dataset.index;
    this.setData({
      tab: index
    })
    console.log(this.data);
  },
  kindToggle(e) {
    const index = e.currentTarget.dataset.index;
    const opens = this.data.opens;
    const set_val = 'opens[' + index + ']';
    this.setData({
      [set_val]: !opens[index]
    });
  },  
  handle:function(e){
    console.log(e);
    const index = e.currentTarget.dataset.index;
    const set_val = 'handleResult[' + index + ']';
    this.setData({
      [set_val]: parseInt(e.detail.value)
    })
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      "handleResult[1]": e.detail.value[0] * (e.detail.value[1]+1)
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    if (e.detail.column==0){
      switch (e.detail.value) {
        case 0:         
          data.multiIndex[0] = 0;
          data.multiArray[1] = [0]
          break;
        case 1:        
          data.multiIndex[0] = 1;
          data.multiArray[1] = [1,2]
          break;
      }    
      this.setData(data);
    }
  },
  cancel: function () {
    util.back();
  },
  formSubmit:function(){    
    var that = this;
    var data = JSON.stringify({
      id: that.data.evaluation.id,
      num1: that.data.handleResult[0],
      num2: that.data.handleResult[1],
      num3: that.data.handleResult[2],
      num4: that.data.handleResult[3],
      num5: that.data.handleResult[4],
      num6: that.data.handleResult[5],
    })
    wx.request({
      url: domain + '/wxs/doctor/process?unionid=' + app.globalData.unionid,
      data: data,
      method: 'POST',
      contentType: 'application/json;charset=UTF-8',
      success: function (data) {
        console.log(data);
        wx.showToast({
          title: data.data.errmsg,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log('doctor-evaluation_detail.js onload');
    var id = options.id;    
    var unionid = app.globalData.unionid;    
    if (unionid==""){
      app.globalData.check();
      unionid = app.globalData.unionid; 
    }
    wx.request({
      url: domain + `/wxs/doctor/evaluation_detail/` + id + `?unionid=` + unionid,
      method: 'get',
      success: function (result) {
        console.log(result);        
        if (result.data.errcode == 0) {
          var evaluation = result.data.data;
          that.setData({
            evaluation: evaluation,
            information: result.data.information,
            handleResult: [evaluation.num1, evaluation.num2, evaluation.num3, evaluation.num4, evaluation.num5, evaluation.num6]
          })
          if (result.data.doctor) {
            that.setData({
              doctor: result.data.doctor
            })
          }
        } else{
          util.error(that, result.data.errmsg);
        }
      },
      error: function (res){
        util.error(that, JSON.stringify(res));
      }
    })
  },
  back: function () {
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