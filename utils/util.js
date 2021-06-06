var api = require('../config/api.js');
var log = require('log.js');
function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  const hour = parseInt(time / 3600, 10)
  time %= 3600
  const minute = parseInt(time / 60, 10)
  time = parseInt(time % 60, 10)
  const second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}
const newTime = () => {
  const date = new Date();
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}

function fib(n) {
  if (n < 1) return 0
  if (n <= 2) return 1
  return fib(n - 1) + fib(n - 2)
}

function formatLeadingZeroNumber(n, digitNum = 2) {
  n = n.toString()
  const needNum = Math.max(digitNum - n.length, 0)
  return new Array(needNum).fill(0).join('') + n
}

function formatDateTime(date, withMs = false) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const ms = date.getMilliseconds()

  let ret = [year, month, day].map(value => formatLeadingZeroNumber(value, 2)).join('-') +
    ' ' + [hour, minute, second].map(value => formatLeadingZeroNumber(value, 2)).join(':')
  if (withMs) {
    ret += '.' + formatLeadingZeroNumber(ms, 3)
  }
  return ret
}

function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i], 10)
    const num2 = parseInt(v2[i], 10)

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}
function prompt(that, promptMsg) {
  that.setData({
    prompt: true,
    promptMsg: promptMsg
  });
  setTimeout(function () {
    that.setData({
      prompt: false,
      promptMsg: ''
    })
  }, 1500);
};
function error(that, errmsg) {
  that.setData({
    error: true,
    errmsg: errmsg
  });
};
function back() {
  wx.navigateBack({
    delta: 1
  })
};
/**
 * 微信登录
 */
function login() {
  return new Promise(function (resolve, reject) {
    return getCode().then(function(res){
      return request(api.WxLogin,{code:res,
          scene:wx.getStorageSync('scene'),
          appOpenid:wx.getStorageSync('appOpenid')||""},"GET")
        .then(res=>{
          console.log(res);
          
          resolve(res);
      }).catch(err=>{
        reject(err);
      })
    }).catch((err) => {
      console.log(err);
      reject(err);
    });
  })
};
/**
 * wx.login
 * 获取code
 */
function getCode() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          resolve(res.code);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
};
/**
 * 获取用户信息
 */
function getUserInfo() {
  return new Promise(function (resolve, reject) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
              console.log(res);
              if (res.errMsg === 'getUserInfo:ok') {
                wx.setStorageSync('userInfo', res.userInfo);
                resolve(res);                
              } else {
                reject(res)
              }
            },
            fail: function (err) {
              console.log(err);
              reject(err);
            }
          })
        }else{
          reject({errcode:-1,errMsg:"用户未进行授权,无法获取权限"});
        }
      }
    })
    
  });
};

/**
 * 授权
 */
function auth(){
  return new Promise(function (resolve, reject) {
    return getCode().then((res) => {      
      return getUserInfo().then(userInfo=>{
        return request(api.WxAuth,JSON.stringify({
          code: res,
          encryptedData: userInfo.encryptedData,
          iv: userInfo.iv,
          signature: userInfo.signature,
          rawData: userInfo.rawData,
          scene:wx.getStorageSync('scene'),
          appOpenid:wx.getStorageSync('appOpenid')
        }),"POST").then(res=>{
          resolve(res);
        }).catch((err) => {
          reject(err);
        })
      }).catch(err=>{
        reject(err);
      });
    }).catch((err) => {
      console.log(err);
      reject(err);
    });
  })
};

/**
 * 封装微信的的request
 * token过期重新获取
 */
function request(url, data = {}, method = "GET") {
  log.info(data);
  wx.showLoading({
    title: '请稍后',
    mask:true
  })
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'token':wx.getStorageSync('token')
      },
      dataType:"json",
      success: function (res) {
        log.info(res);
        wx.hideLoading();
        if (res.statusCode == 200) {
          /**/
          if (res.data.errcode == 401) {
            console.log("重新获取token 然后在进行")
            //需要登录后才可以操作
            return login().then((result) => {
              wx.setStorageSync('token', result.token);
              return request(url,data,method).then(function(res){
                resolve(res);
              });             
            }).catch(function(err){
              console.log(4);
              reject(err);
            });
          } else {
            resolve(res.data);
          }
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        wx.hideLoading();
        reject(err)
        console.log("failed")
      }
    })
  });
};

module.exports = {
  formatTime,
  formatLocation,
  fib,
  formatDateTime,
  compareVersion,
  prompt,
  error,
  back,
  login,
  auth,
  getCode,
  getUserInfo,
  request,
  newTime
}
