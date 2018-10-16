import request from '../utils/request';
//设备墒情
export function queryMoisture(){
  return request('/api/data/moisture',{
    method:'POST'
  });
}
export function queryLogin(params){
  return request('/api/login',{
    method:'POST',
    body:params
  });
}