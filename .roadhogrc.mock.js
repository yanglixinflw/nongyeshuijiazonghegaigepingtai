import {  delay } from 'roadhog-api-doc';
import LoginHandler from './mock/login';
import Moisture from './mock/moisture';
import Wells from './mock/wells';
import Meteorology from './mock/meteorology';
import Ball from './mock/ball';
// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';
const proxy ={
    'POST /api/login':LoginHandler,
    'POST /api/data/moisture':Moisture,
    'POST /api/data/wells':Wells,
    'POST /api/data/meteorology':Meteorology,
    'POST /api/data/ball':Ball,
}
export default (noProxy ? {} : delay(proxy, 1000));
