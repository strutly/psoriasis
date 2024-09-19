var app = getApp()
var that;
var log = require('../../utils/log.js');
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
import WxValidate from '../../utils/WxValidate.js';
Page({  
  data:{
    arrayeducation: ['文盲', '小学','初中','高中','大学','研究生以上'],
    show: false,
    warnmsg:'', 
    infomation:{},
    id:'',
    /*需要提交的数据*/
    vals:['','','','','',''],
    tipsMsg: ["请输入您的真实姓名", "请选择您的性别","请授权您的微信号","请选择您的出生日期","请选择您的教育程度"],//, "请输入您的身高",'请输入您的体重',"请选择您的发病日期"
  },
  onLoad: function (option) {
    console.log('info.js onload');
    that = this;    
    that.initValidate(); 
  },
  onShow(){
    util.request(api.InformationDetail,{},"get").then(function(result){
      log.info(result);
      that.setData({
        information: result.data||{}
      });
    })
  },
  initValidate() {
    let rules = {
      id:{
        required: true
      },
      name: {
        required: true
      },
      sex: {
        required: true
      },
      phoneNum: {
        tel:true,
        required: true
      },
      birthday: {
        required: true
      },
      education: {
        required: true
      }
    }, messages = {
      id:{
        required: "参数错误"
      },
      name: {
        required: "请输入姓名"
      },      
      phoneNum: {
        tel:"请输入正确的手机号",
        required: "请输入正确的手机号"
      },
      
      birthday: {
        required: "请选择生日"
      },
      education: {
        required: "请选择学历"
      },
      
    };
    that.WxValidate = new WxValidate(rules, messages);
  },


  cancel:function(){
    util.back();
  },
  radioChoose: function (e) {
    console.log("radioChoose");
    var index = e.currentTarget.dataset.index;
    var val = e.detail.value;
    var set_vals = 'vals['+index+']'
    this.setData({
      [set_vals]:val
    });
  },
  bindKeyInput: function (e) {
    console.log("bindKeyInput");
    var type = e.currentTarget.dataset.type;
    var val = e.detail.value;    
    var index = e.currentTarget.dataset.index;
    var set_vals = 'vals[' + index + ']'
    this.setData({     
      [set_vals]: val
    })
  },
  pickerChange(e) {
    var type = e.currentTarget.dataset.type;    
    this.setData({
      ['information.'+type]: e.detail.value
    })
  },
  bindPickerIncidenceTime: function (e) {
    var index = e.currentTarget.dataset.index;
    var set_vals = 'vals[' + index + ']';
    this.setData({
      [set_vals]: e.detail.value
    })
  },
  bindPickerEducation: function (e) {
    var index = e.currentTarget.dataset.index;
    var set_vals = 'vals[' + index + ']';
    this.setData({
      [set_vals]: e.detail.value
    });
  }, 
  submit(e) {
    let data = e.detail.value;
    if (!that.WxValidate.checkForm(data)) {
      console.log(that.WxValidate)
      let error = that.WxValidate.errorList[0];
      util.prompt(that, error.msg);        
      return false;
    }
    util.request(api.InformationForm,data,"POST").then(function(result){
      log.info(result);
      if (result.errcode == 0) {
        app.globalData.if_information = true;
        var pages = getCurrentPages();//当前页面栈
        if (pages.length > 1) {
          var beforePage = pages[pages.length - 2];//获取上一个页面实例对象
          beforePage.setData({       //如果需要传参，可直接修改A页面的数据，若不需要，则可省去这一步
            show: false
          })
          beforePage.onLoad();//触发父页面中的方法
        }
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000,
          success:function(){
            util.back();
          }
        })
      } else {
        util.error(that, result.errmsg);        
      }
    });
  },
  onShareAppMessage: function () {
    return app.globalData.shareMessage
  },
  getPhoneNumber(e) {
    let that = this;
    console.log(e);
    if (e.detail.errMsg === "getPhoneNumber:ok") {
      util.request(api.PhoneNumber,JSON.stringify({"code":e.detail.code}),"POST").then(res=>{
        console.log(res);
        if(res.errcode==0){
          that.setData({
            ["information.phoneNum"]:res.phone_info.phoneNumber
          })
        }else{
          util.prompt(that, "手机号获取失败");
        }        
      },err=>{
        console.log(err);
        util.prompt(that, "手机号获取失败");
      })
    }
  },  
})
