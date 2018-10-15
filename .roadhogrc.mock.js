import {  delay } from 'roadhog-api-doc';
import LoginHandler from './mock/login'

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';
const proxy ={
    'POST /api/login':LoginHandler
}
export default (noProxy ? {} : delay(proxy, 1000));
