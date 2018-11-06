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