import request from '../utils/request';
import {ENVNet,postOption} from './netCofig'
//设备数据 智能球阀/设备井电/清易气象/清易墒情
export function queryDevice(params){
  return request(`${ENVNet}/api/DeviceData/list`,{
    ...postOption,
    body: JSON.stringify(
      params
    )
  });
}
// 有验证码登录逻辑
export function queryLogin(params) {
  return request(`${ENVNet}/api/Account/login`, {
    ...postOption,
    body: JSON.stringify(
      params
    )
  },'login');
}
// 无验证码登录逻辑
export function queryLoginNoCaptcha(params) {
  return request(`${ENVNet}/api/Account/mobileLogin`, {
    ...postOption,
    body: JSON.stringify(
      params
    )
  },'login');
}
// 设备数据 标题获取
export function queryDeviceTitle(params) {
  return request(`${ENVNet}/api/DeviceData/columns`, {
    ...postOption,
    body: JSON.stringify(
      params
    )
  })
}
// 设备信息获取
export function getDeviceInfo(params) {
  return request(`${ENVNet}/api/Device/list`, {
    ...postOption,
    body: JSON.stringify(
      params
    )
  })
}
//农户信息管理
export function getFarmersInfo(params) {
  return request(`${ENVNet}/api/PeasantMgr/list`, {
    ...postOption,
    body: JSON.stringify(params
      )
    })
  }

//设备历史数据
export function queryDeviceHistory(params){
  return request(`${ENVNet}/api/DeviceData/historyData`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
//用户管理
export function getUserManagement(params){
  return request(`${ENVNet}/api/UserMgr/list`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
// 获取设备安装地列表
export function getInstallAddrList(){
  return request(`${ENVNet}/api/BaseInfo/installAddrList`,{
    method:'GET',
    mode:'cors',
    credentials: "include",
  })
}
//预警规则列表
export function getWarningRules(params){
  return request(`${ENVNet}/api/DeviceWaringRule/ruleList`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
//预警事件记录
export function getWarningRecords(params){
  return request(`${ENVNet}/api/DeviceWaringRule/eventList`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
// 设备类型列表
export function getDeviceTypeList(params){
  return request(`${ENVNet}/api/DeviceType/list`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
// 获取设备关联建筑物列表
export function getRelatedBuilding(params){
  return request(`${ENVNet}/api/Building/list`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
// 获取运营公司列表
export function getCompanyList(){
  return request(`${ENVNet}/api/BaseInfo/companyList`,{
    method:'GET',
    mode:'cors',
    credentials: "include",
  })
}
//获取设备列表（阀门控制页面）
export function getValveList(params){
  return request(`${ENVNet}/api/device/control/list`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
//获取操作记录
export function getOperatingRecord(params){
  return request(`${ENVNet}/api/device/control/operateLogs`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
//获取自动化控制列表
export function getAutoControl(params){
  return request(`${ENVNet}/api/Automatic/list`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
//获取自动化规则列表
export function getAutoRules(params){
  return request(`${ENVNet}/api/Automatic/getRuleSettings`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
//获取计费设施列表
export function getChargingDevice(params){
  return request(`${ENVNet}/fee/chargeFacility/list`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
//获取小组账户列表
export function getGroupAccount(params){
  return request(`${ENVNet}/fee/groupAccount/list`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
// //获取交易记录（消费记录）列表
export function getDealRecord(params){
  return request(`${ENVNet}/fee/transaction/records`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
//获取小组管理
export function getGroupManage(params){
  return request(`${ENVNet}/fee/groupAccount/getGroupMembers`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
// 获取视频监控下拉列表
export function getMonitorSelectList(){
  return request(`${ENVNet}/api/CamerasMonitor/buildings`,{
    ...postOption
  })
}
export function getMonitorList(){
  return request(`${ENVNet}/api/CamerasMonitor/cameras`,{
    ...postOption,
    body:JSON.stringify(
      {
        buildingId:0
      }
    )
  })
}
//设备信息预警机制
export function queryWarningDetail(params){
  return request(`${ENVNet}/api/device/warningRuleList`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
// 获取当前机构中的用户列表
export function getUserList(params){
  return request(`${ENVNet}/api/BaseInfo/userSimpleList?userType=1&keyword=${params}`,{
    method:'GET',
    mode:'cors',
    credentials: "include",
  })
}
// 获取设备参数列表
export function getDeviceParameters(params){
  return request(`${ENVNet}/api/DeviceType/deviceParameters`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
// 获取通知角色列表
export function getRoleList(params){
  return request(`${ENVNet}/api/UserMgr/roleList`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
// 获取设备名称/ID简化列表
export function getSimpleList(params){
  return request(`${ENVNet}/api/device/simpleList`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
// 获取设备id对应的可执行的指令列表
export function getControlList(params){
  return request(`${ENVNet}/api/device/control/deviceCmdList`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
//Gis地图获取设备信息
export function getMapDevice(params){
  return request(`${ENVNet}/api/device/gisDeviceList`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
//获取规则详情
export function getRulesDetail(params){
  return request(`${ENVNet}/api/DeviceWaringRule/ruleDetails`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
