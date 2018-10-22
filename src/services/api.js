import request from '../utils/request';
// 开发环境
const envNet='http://192.168.30.127:88'
// post通用设置
let postOption={
  method: 'POST',
  credentials: "include",
  mode: 'cors',
  headers: new Headers({
    'Content-Type': 'application/json',
  }),
}
//设备墒情
export function queryMoisture(){
  return request('/api/data/moisture',{
    method:'POST'
  });
}
//设备井电
// export function queryWells(){
//   return request('/api/data/wells',{
//     method:'POST'
//   });
// }
//设备气象
export function queryMeteorology(){
  return request('/api/data/meteorology',{
    method:'POST'
  });
}
//设备气象历史数据
export function queryMeteorologyHistory(){
  return request('/api/data/meteorology/history',{
    method:'POST'
  });
}
//设备智能球阀/设备井电
export function queryDevice(params){
  return request(`${envNet}/api/DeviceData/list`,{
    method:'POST',
    mode: 'cors',
    headers : new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(
      params
    )
  });
}
//设备智能球阀历史数据
export function queryBallHistory(){
  return request('/api/data/ball/history',{
    method:'POST'
  });
}
// 登录逻辑
export function queryLogin(params) {
  return request(`${envNet}/api/Account/login`, {
    ...postOption,
    body:JSON.stringify(
      params
    )
  });
}
//设备井电历史数据
export function queryWellsHistory(){
  return request('/api/data/wells/history',{
    method:'POST'
  });
}
//设备墒情历史数据
export function queryMoistureHistory(){
  return request('/api/data/moisture/history',{
    method:'POST'
  });
}
//新天通球阀title
export function queryBallTitle(){
  return request (`${envNet}/api/DeviceData/columns?deviceTypeId=1`,{
    method:'GET',
    mode:'cors'
  })
}
//开创井电title
export function queryWellsTitle(){
  return request (`${envNet}/api/DeviceData/columns?deviceTypeId=2`,{
    method:'GET',
    mode:'cors'
  })
}
// 设备信息获取
export function getDeviceInfo(){
  return request(`${envNet}/api/Device/list`,{

  })
}