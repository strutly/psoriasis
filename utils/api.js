//var domain = "http://17240k68p1.51mypc.cn";


module.exports = {
  WxLogin: domain + '/wxs/rest/code2Session',//登录接口
  WxAuth: domain + '/wxs/rest/sign',//授权接口
  
  DoctorInfo:domain + '/wxs/doctor/detail',//医生个人信息修改
  DoctorInfoEdit:domain + '/wxs/doctor/form?unionid=',//医生个人信息修改
  EvaluationProcess:domain +'/wxs/doctor/process?unionid=',//处理自测信息
  DoctorEvaluationDetail: domain + '/wxs/doctor/evaluation_detail/',//处理详情
  EvaluationBind: domain + '/wxs/doctor/bind',//医生绑定二维码
  DoctorList: domain + '/wxs/doctor/list',//医生获取我的测评列表
  MyPatient:domain+'/wxs/doctor/my_patient',//我的病人
  
  EvaluationForm: domain+'/wxs/evaluation/form',//提交测试信息
  EvaluationResult: domain+'/wxs/evaluation/result/',//获取检测结果

  MobForm:domain+'/wxs/mob/form',//暴徒新增
  MobDetail:domain + '/wxs/mob/detail/',//暴徒详细
  MobAll:domain+'/wxs/mob/all',//所有暴徒

  PersonalEvaluationDetail:domain+'/wxs/evaluation/detail/',//个人获取测评详细
  PersonalEvaluationList:domain+'/wxs/evaluation/list',//个人获取测评列表

  InformationForm:domain+'/wxs/information/form',//个人信息提交
  InformationDetail:domain+'/wxs/information/detail',//获取个人信息
};