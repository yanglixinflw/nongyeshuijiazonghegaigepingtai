import request from '../utils/request';
export function queryMoisture(){
  return request('/api/data/moisture',{
    method:'POST',
  });
}
export function queryLogin(params){
  return request('/api/login',{
    method:'POST',
    body:params
  });
}