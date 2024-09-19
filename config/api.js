//var domain = "http://3e247r1102.zicp.vip";
var domain = "https://tty.tsing-care.com";
//var domain = "http://localhost";
//const domain = "https://ljdev.ai-care.com.cn";
module.exports = {
  
  WxLogin: domain + '/wxs/rest/code2Session',//登录接口
  WxAuth: domain + '/wxs/rest/sign',//授权接口
  
  DoctorInfo:domain + '/wxs/doctor/detail',//医生个人信息修改
  DoctorInfoEdit:domain + '/wxs/doctor/form',//医生个人信息修改
  EvaluationProcess:domain +'/wxs/doctor/process',//处理自测信息
  DoctorEvaluationDetail: domain + '/wxs/doctor/evaluation_detail/',//处理详情
  EvaluationBind: domain + '/wxs/doctor/bind',//医生绑定二维码
  DoctorList: domain + '/wxs/doctor/list',//医生获取我的测评列表
  MyPatient:domain+'/wxs/doctor/my_patient',//我的病人
  
  EvaluationForm: domain+'/wxs/evaluation/form',//提交测试信息
  EvaluationResult: domain+'/wxs/evaluation/result/',//获取检测结果
  EvaluationReply: domain+'/wxs/evaluation/reply/',//提交病情记录与反馈

  MobForm:domain+'/wxs/mob/form',//暴徒新增
  MobDetail:domain + '/wxs/mob/detail/',//暴徒详细
  MobAll:domain+'/wxs/mob/all',//所有暴徒

  PersonalEvaluationDetail:domain+'/wxs/evaluation/detail/',//个人获取测评详细
  PersonalEvaluationList:domain+'/wxs/evaluation/list',//个人获取测评列表

  InformationForm:domain+'/wxs/information/form',//个人信息提交
  InformationDetail:domain+'/wxs/information/detail',//获取个人信息

  Spread:domain+ '/wxs/doctor/spread', //医生分享二维码生成

  Websocket:domain.replace('http','ws') + '/websocket/',//websocket

  ChatInitData:domain + "/wxs/chat/init/", //获取聊天处理器主面板列表信息

  ChatFriends:domain + "/wxs/chat/friends/", //根据类型获取好友列表

  ChatByDid:domain + "/wxs/chat/by/", //根据医生id获得该医生的对话id
  ChatByIid:domain + "/wxs/chat/by/information/", //根据用户id获得该病人的对话id

  SendChatMessage:domain + "/wxs/chat/send/", //根据用户id获得该病人的对话id
  SpreadStatistics:domain + "/wxs/doctor/statistics",//推广数据
  UploadPic:domain + "/api/file/qiniu",//上传图片到七牛
  PhoneNumber:domain+"/wxs/rest/phoneNumber",
};