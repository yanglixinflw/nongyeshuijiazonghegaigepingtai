import request from '../utils/request';
// 开发环境
const envNet = 'http://192.168.30.127:88'
// post通用设置
let postOption = {
  method: 'POST',
  credentials: "include",
  mode: 'cors',
  headers: new Headers({
    'Content-Type': 'application/json',
  }),
}
//设备智能球阀/设备井电/清易墒情/气象
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

//设备墒情历史数据
export function queryMoistureHistory() {
  return request('/api/data/moisture/history', {
    method: 'POST'
  });
}
//新天通球阀title
export function queryBallTitle() {
  return request(`${envNet}/api/DeviceData/columns?deviceTypeId=1`, {
    method: 'GET',
    mode: 'cors'
  })
}
//开创井电title
export function queryWellsTitle() {
  return request(`${envNet}/api/DeviceData/columns?deviceTypeId=2`, {
    method: 'GET',
    mode: 'cors'
  })
}
//清易气象title
export function queryMeteorologyTitle(){
  return request (`${envNet}/api/DeviceData/columns?deviceTypeId=3`,{
    method:'GET',
    mode:'cors'
  })
}
//清易墒情title
export function queryMoistureTitle(){
  return request (`${envNet}/api/DeviceData/columns?deviceTypeId=4`,{
    method:'GET',
    mode:'cors'
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
    body: JSON.stringify(  params
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