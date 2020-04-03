const util = require('../../../utils/util.js')
const formatLocation = util.formatLocation;
var app = getApp();
var domain = app.globalData.host;
var FSM = wx.getFileSystemManager();
Page({
  data: {
    hasLocation: false,
    name:'',//用户姓名
    phone:'',//用户电话
    num :1,//暴徒数量
    address:'',//暴徒地址
    latitude : 0.00000000,//纬度
    longitude : 0.00000000,//经度
    content:'',
    show: false,
    imageList:[],
  },
  bindKeyInput: function (e) {
    console.log("bindKeyInput");
    var type = e.currentTarget.dataset.type;
    var val = e.detail.value;
    var set_type = '' + type + '';
    this.setData({
      [set_type]: val,
    })
    console.log(this.data)
  }, 
  chooseLocation() {
    const that = this
    wx.chooseLocation({
      success(res) {
        console.log(res)
        that.setData({
          hasLocation: true,
          latitude: res.latitude,
          longitude: res.longitude,
          address: res.address
        })
      }
    })
  },
  bindTextAreaBlur:function(e){
    console.log(e);
    this.setData({
      content:e.detail.value
    })
  },
  cancel: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  formSubmit:function(){
    var that = this;
    if(that.data.name==''){
      util.prompt(that,"请输入您的姓名");
      return;
    }
    if (that.data.phone == '') {
      util.prompt(that,"请输入您的电话");
      return;
    }    
    if (!that.data.hasLocation) {
      util.prompt(that,"请选择暴徒所在位置");
      return;
    }
    if (that.data.content == '' || that.data.content.length<10) {
      util.prompt(that,"文字说明不能少于10个字");
      return;
    }
    var data = JSON.stringify({
      unionid: app.globalData.unionid,
      name: this.data.name,//用户姓名
      phone: this.data.phone,//用户电话
      num: this.data.num,//暴徒数量
      address: this.data.address,//暴徒地址
      latitude: this.data.latitude,//纬度
      longitude: this.data.longitude,//经度
      content:this.data.content,
      pics: this.data.imageList.toString()
    })
    console.log(data)
    wx.request({
      url: domain + `/wxs/mob/form?unionid=`+app.globalData.unionid,
      data: data,
      method: 'POST',
      contentType: 'application/json;charset=UTF-8',
      header: {
        'content-type': 'application/json'
      },
      success: function (result) {
        console.log(result);
        if(result.data.errcode==0){
          wx.showToast({
            title: '提交成功',
            duration: 500
          })
          setTimeout(function(){
            wx.reLaunch({
              url: '/pages/pages/map/index'
            })
          },1000);
        }else{
         util.prompt(that,result.data.errmsg);
        }
      }
    })
  },
  chooseImage:function(){
    var that = this;
    wx.chooseImage({
      count: 8-that.data.imageList.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res);
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFiles;
        for(var i=0;i<tempFilePaths.length;i++){
          console.log(tempFilePaths[i])
          //将图片传入自家服务器
          //that.uploadFile(tempFilePaths[i].path);
          //将图片转换为base64直接上传至七牛服务器
          FSM.readFile({
            filePath: tempFilePaths[i].path,
            encoding: "base64",
            success: function (data) {
              that.uploadFilebase64(data.data);
            }
          });          
        }
      }
    })
  },
  move:function(e){
    var index = e.currentTarget.dataset.index;
    var imglist = this.data.imageList;
    imglist.splice(index, 1);
    this.setData({
      imageList: imglist
    })
  },
  previewImage:function(e){
    console.log(e);    
    const current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  uploadFilebase64: function (base64) {
    var that = this;
    var imageList = that.data.imageList;
    wx.request({
      url: domain + '/api/upload/put64image',
      data: base64,
      method: 'POST',
      contentType: 'application/json;charset=UTF-8',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        var result = res.data;
        var errmsg = "图片失败";
        if (result.errcode == 0) {
          imageList.push(result.errmsg);
          errmsg = "图片上传成功";
          that.setData({
            imageList: imageList
          })
        } 
        wx.showToast({
          title: "图片上传",
          icon: 'success',
          duration: 700
        });
      },
      fail: function (res) {
      }
    })
  },
  uploadFile:function(filePath) {
    var that = this;
    var imageList = that.data.imageList;
    wx.uploadFile({
      url: domain+'/api/upload/file',
      filePath: filePath,
      name: 'file',
      header: {
          'content-type': 'multipart/form-data'
      }, // 设置请求的 header
      success: function (res) {
        var result = JSON.parse(res.data);
        if (result.error==0){
          imageList.push(result.url);
          wx.showToast({
            title: "图片上传",
            icon: 'success',
            duration: 700
          });
          that.setData({
            imageList: imageList
          })
        }
        console.log(that);
        console.log(result);
        
       },
       fail: function (res) {
       }
    })
  }
})