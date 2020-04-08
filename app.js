//app.js
//var domain = "http://17240k68p1.51mypc.cn";
var domain = "https://tty.tsing-care.com";
App({
  globalData: {    
    if_doctor:false,//医生信息
    if_information: false,//身份信息
    unionid: '',
    userInfo: null,//个人信息
    host: domain,
    time:0,
    //需要上传的数据
    data:{
      /*面积,红斑,鳞屑,厚度 */
      'result1':['','','',''],
      'level': '',//生活质量评分
      'result2': ['', '', '', '', '', '', ''],
      'checkvalue1': '',//是否诊断银屑病
      'time1': '',//诊断银屑病时间
      'checkvalue2': '',//是否诊断银屑病关节炎
      'time2': '',//诊断银屑病关节炎时间
    },
    evaluationResult:'',
    check:function(){
      var that = this;
      //根据code获取openid等信息    
      wx.login({
        success: function (res) {
          console.log(res);
          var code = res.code; //返回code
          wx.request({
            url: domain + '/wxs/rest/code2Session?code=' + code,
            method: 'get',
            dataType: 'json',
            success: function (response) {
              console.log(response);
              var result = response.data;
              if (result.errcode == 0) {
                that.unionid = result.unionid;
                that.userInfo = result.userInfo;

                console.log(app.globalData);
                //是否医生
                if (result.if_doctor) {
                  that.if_doctor = true;
                  that.doctor = result.doctor;                  
                } else {
                  that.if_information = result.if_information;
                }
              } else {
                wx.reLaunch({
                  url: '/pages/index/main'
                })
              }
            },
            fail: function (e) {
              console.log(e);
              wx.reLaunch({
                url: '/pages/index/main'
              })
            }
          })
        }, fail: function () {
          console.log("失败");
          wx.reLaunch({
            url: '/pages/index/main'
          })
        }
      })
    },
    
    // auth: function (e) {
    //   var that = this;
    //   console.log(this);
    //   console.log(e);
    //   //表示获取成功同意获取用户信息
    //   if (e.detail.errMsg == "getUserInfo:ok") {        
    //     wx.getSetting({
    //       success: resp => {
    //         console.log(resp);
    //         if (resp.authSetting['scope.userInfo']) {
    //           //获取用户信息
    //           wx.login({
    //             success: function (date) {
    //               if (date.code) {
    //                 wx.getUserInfo({
    //                   success: res => {
    //                     console.log(res);
    //                     //发起网络请求
    //                     wx.request({
    //                       url: domain + '/wxs/rest/sign',
    //                       data: JSON.stringify({
    //                         code: date.code,
    //                         encryptedData: res.encryptedData,
    //                         iv: res.iv,
    //                         signature: res.signature,
    //                         rawData: res.rawData
    //                       }),
    //                       method: 'POST',
    //                       contentType: 'application/json;charset=UTF-8',
    //                       header: {
    //                         'content-type': 'application/json'
    //                       },
    //                       success: function (response) {
    //                         console.log(response);
    //                         console.log(response.data.status);
    //                         console.log(response.data.status != undefined);                            
    //                         console.log(response.data.if_doctor);
    //                         console.log(response.data.if_information);
    //                         //这里需要 if_information==true 的时候才会有返回                            

                            
    //                       }
    //                     })
    //                   }
    //                 })
    //               } else {
    //                 console.log('登录失败！' + date.errMsg)
    //               }
    //             }
    //           })
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         } else if (resp.authSetting['scope.userInfo'] === false) { // 授权弹窗被拒绝
    //           wx.clearStorage()
    //         }
    //       }
    //     });
    //   } else {
    //     this.prompt("您取消授权了");
    //   }
    // },    
  },
  onLaunch: function() {
    console.log(new Date().getTime())
    console.log("app.js---onLaunch");
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);    
  },
})