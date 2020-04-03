// pages/pages/details.js
const app = getApp();
var domain = app.globalData.host;
var socketUrl = domain.replace("http", "ws");
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
    this.setData({
      tab:index
    })    
  },
  kindToggle(e) {
    const index = e.currentTarget.dataset.index;
    const opens = this.data.opens;
    const set_val = 'opens['+index+']';
    this.setData({
      [set_val]:!opens[index]
    });    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData);
    var width = wx.getSystemInfoSync().windowWidth;
    this.setData({
      codeHeight: width * 0.8 * 0.8 + "px"
    })
    console.log('evaluation_detail.js onload');
    var id = options.id;    
    var unionid = app.globalData.unionid;    
    var that = this;
    wx.request({
      url: domain + `/wxs/evaluation/detail/` + id + `?unionid=` + unionid,
      method: 'get',
      success: function (result) {
        console.log(result);
        if (result.data.errcode == 0) {
            that.setData({
              evaluation: result.data.data,
              code: "data:image/png;base64," + result.data.code.replace(/[\r\n]/g, ""),
            })
          if (result.data.doctor){
            that.setData({
              doctor: result.data.doctor
            })
          }
        } else {
          util.error(that,result.data.errmsg);
        }
      },
      error: function (res) {
        util.error(that, JSON.stringify(res));
      }
    })   
  },
  openSocket() {
    wx.onSocketOpen(() => {
      console.log('WebSocket 已连接');
    })

    wx.onSocketClose(() => {
      console.log('WebSocket 已断开');
    })
    wx.onSocketError(error => {
      console.error('socket error:', error);
    })
    // 监听服务器推送消息
    wx.onSocketMessage(message => {      
      console.log('socket message:', message);
    })
    // 打开信道
    wx.connectSocket({
      url: socketUrl+'/websocket/'+app.globalData.unionid,
    });
  },
  share_result:function(){
    //this.openSocket();
    this.setData({
      show: true,      
    })
  },
  cancle:function(){
    this.setData({
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