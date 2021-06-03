//index.js
//获取应用实例
import websocket from '../../utils/websocket.js';
var API = require('../../config/api.js');
var util = require('../../utils/util.js');
var that;
Page({
  data: {    
  },
  onLoad: function (options) {
    that = this;    
    console.log(options)
    that.chatInitData(options.id,options.type);
  },
  chatInitData(toid,type){
    util.request(API.ChatInitData+toid+"/"+type,{},"get").then(result=>{
      console.log(result);
      if(result.code==0){
        let chatLogs = result.data.chatlog['friend'+result.data.to.id]||[];
        that.setData({
          Mine:result.data.mine,
          To:result.data.to,
          chatLogs: chatLogs,
          toLast:"item"+chatLogs.length,
          type:type
        });
        wx.setNavigationBarTitle({
          title: '与'+ result.data.to.username+'的对话'
        });        
        that.websocket(result.data.mine);
      }else{
        util.prompt(that,result.msg);
      }
    })  
  },
  //点击发送
  send(e){
    if(e.detail.value){
      that.sendWebSocketMsg(e.detail.value);
      that.setData({
        inputVal:""
      })
    }
  },
  onShow(){   
    if(that.data.Mine!=undefined){
      that.linkWebsocket();
    }
  },
  onHide(){
    //程序后台后的操作--关闭websocket连接
    that.websocket.closeWebSocket();
  },
  addPic(e){
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res);
        const tempFilePaths = res.tempFiles;
        that.uploadFilebase64(tempFilePaths[0]);
      }
    })
  },
  uploadFilebase64: function (filePath){
    console.log(filePath)    
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    });
    let upres = new Promise(function (resolve, reject) {
      wx.uploadFile({
        url: API.UploadPic,
        filePath: filePath.path, 
        name: 'file',
        header: {"Content-Type": "multipart/form-data" },
        success: function (res) {
          console.log(res);
          if (res.statusCode != 200) { 
            resolve({code:-1,msg:"图片上传失败,请稍后再试"});
          }else{
            var data = JSON.parse(res.data);
            resolve(data);
          }                 
        },
        fail: function (e) {
          console.log(e);
          resolve({code:-1,msg:JSON.stringify(e)});
        },
        complete: function () {
          wx.hideToast();  //隐藏Toast
        }
      })
    })
    upres.then(res=>{
      if(res.code==0){
        that.sendWebSocketMsg("img["+res.data+"]");
      }else{
        util.prompt(that,res.msg);
      }
    })
  },
  preview(e){
    console.log(e);
    wx.previewImage({
      urls: [e.target.dataset.src],
    })
  },
  onUnload(){
    that.websocket.closeWebSocket();
  },
  websocket(Mine){
    wx.showLoading({
      title: '正在连接中...',
    }); 
    //创建websocket对象
    that.websocket = new websocket({
      //true代表启用心跳检测和断线重连
      heartCheck: true,
      isReconnection: true
    });
    // 监听websocket状态
    that.websocket.onSocketClosed({
      url: API.Websocket+Mine.id,
      success(res) {        
        console.log("state:"+res);
      },
      fail(err) { 
        console.log(err);
      }
    });
    // 监听网络变化
    that.websocket.onNetworkChange({
      url: API.Websocket+Mine.id,
      success(res) { console.log(res) },
      fail(err) { console.log(err) }
    });
    // 监听服务器返回
    that.websocket.onReceivedMsg(result => {
      console.log('app.js收到服务器内容：' + result.data);
      // 要进行的操作
      let chatMessage = JSON.parse(result.data);      
      if(chatMessage.type==="chatMessage"){
        let chatLogs = that.data.chatLogs;
        let chatLog = chatMessage.data;
        chatLog.timestamp = util.newTime();
        chatLogs.push(chatLog);
        that.setData({
          chatLogs: chatLogs,
          toLast:"item"+chatLogs.length
        })
      }
    });
    that.linkWebsocket();
  },
  linkWebsocket() {
    // 建立连接
    that.websocket.initWebSocket({
      url: API.Websocket+that.data.Mine.id,
      success(res) { console.log(res);
        wx.showToast({
          title: '连接成功!',
        });
        wx.hideLoading(); },
      fail(err) {
        console.log(err); 
        wx.showToast({
          title: '连接失败,重连中~~',
        }); 
      }
    })
  },  
  sendWebSocketMsg(msg){
    let data = {"type":"chatMessage","data":{
      "username":that.data.Mine.username,
      "avatar":that.data.Mine.avatar,
      "type":"friend",
      "content":msg,
      "fromid":that.data.Mine.id,
      "toid":that.data.To.id
    }};
    console.log(data);

    util.request(API.SendChatMessage+that.data.type,data,"post").then(res=>{
      console.log(res)
      let chatLogs = that.data.chatLogs;
      let chatLog = data.data;
      chatLog.mine = true;
      chatLog.timestamp = util.newTime();
      chatLogs.push(chatLog);
      that.setData({
        chatLogs: chatLogs,
        toLast:"item"+chatLogs.length
      })
    }).catch(err=>{
      console.log(err)
      util.prompt(that,"发送失败");
      that.linkWebsocket();
      console.log("失败");

    })


    
  }
});