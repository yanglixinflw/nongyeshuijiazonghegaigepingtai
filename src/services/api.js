import request from '../utils/request';
export function queryMoisture(){
  return request('/api/data/moisture');
}
export function queryLogin(){
  return request('/api/login');
}