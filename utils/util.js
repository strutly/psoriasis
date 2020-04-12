var api = require('api.js');
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
      wx.request({
        url: api.WxLogin,
        method: 'get',
        data:{code:res},
        dataType: 'json',
        success: function (result) {
          if(result.statusCode==200){
            resolve(result.data);
          }else{
            reject(result);
          }              
        }
      })
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
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        console.log(res);
        if (res.errMsg === 'getUserInfo:ok') {
          resolve(res);
        } else {
          reject(res)
        }
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
};

/**
 * 授权
 */
function auth(){
  return new Promise(function (resolve, reject) {
    let code  = null;
    return getCode().then((res) => {
      console.log(res);
      code = res;
      return getUserInfo();
    }).then((userInfo) => {
        wx.request({
          url: api.WxAuth,
          data: JSON.stringify({
            code: code,
            encryptedData: userInfo.encryptedData,
            iv: userInfo.iv,
            signature: userInfo.signature,
            rawData: userInfo.rawData
          }),
          method: 'POST',
          contentType: 'application/json;charset=UTF-8',
          header: {
            'content-type': 'application/json'
          },
          success: function (result) {
            if(result.statusCode==200){
              resolve(result.data);
            }else{
              reject(result);
            }                            
          },fail: function (err) {
            reject(err)
            console.log("failed")
          }
        })
    }).catch((err) => {
      reject(err);
    }).catch((err) => {
      reject(err);
    });
  })
};

/**
 * 封装微信的的request
 * token过期重新获取
 */
function request(url, data = {}, method = "GET") {
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
        if (res.statusCode == 200) {
          /**/
          if (res.data.errcode == 401) {
            console.log("重新获取token 然后在进行")
            //需要登录后才可以操作
            return auth().then((result) => {
              wx.setStorageSync('token', result.token);
              request(url,data,method).then(function(res){
                resolve(res);
              });             
            })
          } else {
            resolve(res.data);
          }
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err)
        console.log("failed")
      }
    })
  });
}

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
  request
}
