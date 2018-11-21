import request from '../utils/request';
// 开发环境
const envNet = 'http://192.168.30.127:88'
// 生产环境
// const envNet=''
// post通用设置
let postOption = {
  method: 'POST',
  credentials: "include",
  mode: 'cors',
  headers: new Headers({
    'Content-Type': 'application/json',
  }),
}
//设备数据 智能球阀/设备井电/清易气象/清易墒情
export function queryDevice(params){
  return request(`${envNet}/api/DeviceData/list`,{
    ...postOption,
    body: JSON.stringify(
      params
    )
  });
}
// 登录逻辑
export function queryLogin(params) {
  return request(`${envNet}/api/Account/login`, {
    ...postOption,
    body: JSON.stringify(
      params
    )
  });
}
// 设备数据 标题获取
export function queryDeviceTitle(params) {
  return request(`${envNet}/api/DeviceData/columns`, {
    ...postOption,
    body: JSON.stringify(
      params
    )
  })
}
// 设备信息获取
export function getDeviceInfo(params) {
  return request(`${envNet}/api/Device/list`, {
    ...postOption,
    body: JSON.stringify(
      params
    )
  })
}
//农户信息管理
export function getFarmersInfo(params) {
  return request(`${envNet}/api/PeasantMgr/list`, {
    ...postOption,
    body: JSON.stringify(params
      )
    })
  }

//设备历史数据
export function queryDeviceHistory(params){
  return request(`${envNet}/api/DeviceData/historyData`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
//用户管理
export function getUserManagement(params){
  return request(`${envNet}/api/UserMgr/list`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
// 获取设备安装地列表
export function getInstallAddrList(){
  return request(`${envNet}/api/BaseInfo/installAddrList`,{
    method:'GET',
    mode:'cors',
    credentials: "include",
  })
}
//预警规则列表
export function getWarningRules(params){
  return request(`${envNet}/api/DeviceWaringRule/ruleList`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
//预警事件记录
export function getWarningRecords(params){
  return request(`${envNet}/api/DeviceWaringRule/eventList`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
// 设备类型列表
export function getDeviceTypeList(params){
  return request(`${envNet}/api/DeviceType/list`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
// 获取设备关联建筑物列表
export function getRelatedBuilding(params){
  return request(`${envNet}/api/Building/list`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
// 获取运营公司列表
export function getCompanyList(){
  return request(`${envNet}/api/BaseInfo/companyList`,{
    method:'GET',
    mode:'cors',
    credentials: "include",
  })
}
//获取设备列表（阀门控制页面）
export function getValveList(params){
  return request(`${envNet}/api/device/control/list`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
//获取操作记录
export function getOperatingRecord(params){
  return request(`${envNet}/api/device/control/operateLogs`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
//获取自动化控制列表
export function getAutoControl(params){
  return request(`${envNet}/api/Automatic/list`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
// 获取视频监控下拉列表
export function getMonitorSelectList(){
  return request(`${envNet}/api/CamerasMonitor/buildings`,{
    ...postOption
  })
}
export function getMonitorList(){
  return request(`${envNet}/api/CamerasMonitor/cameras`,{
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
  return request(`${envNet}/api/device/warningRuleList`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
// 获取当前机构中的用户列表
export function getUserList(params){
  return request(`${envNet}/api/BaseInfo/userSimpleList?userType=1&keyword=${params}`,{
    method:'GET',
    mode:'cors',
    credentials: "include",
  })
}
// 获取设备参数列表
export function getDeviceParameters(params){
  return request(`${envNet}/api/DeviceType/deviceParameters`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
// 获取通知角色列表
export function getRoleList(params){
  return request(`${envNet}/api/UserMgr/roleList`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
// 获取设备名称/ID简化列表
export function getSimpleList(params){
  return request(`${envNet}/api/device/simpleList`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
// 获取设备id对应的可执行的指令列表
export function getControlList(params){
  return request(`${envNet}/api/device/control/deviceCmdList`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
//Gis地图获取设备信息
export function getMapDevice(params){
  return request(`${envNet}/api/device/gisDeviceList`,{
    ...postOption,
    body:JSON.stringify(
      params
    )
  })
}
