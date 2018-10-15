import {  delay } from 'roadhog-api-doc';
import LoginHandler from './mock/login';
import Moisture from './mock/moisture';
// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';
const proxy ={
    'POST /api/login':LoginHandler,
    'POST /api/data/moisture':Moisture
}
export default (noProxy ? {} : delay(proxy, 1000));
