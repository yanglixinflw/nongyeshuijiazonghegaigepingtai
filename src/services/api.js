import request from '../utils/request';
//设备墒情
export function queryMoisture(){
  return request('/api/data/moisture',{
    method:'POST'
  });
}
export function queryLogin(){
  return request('/api/login');
}