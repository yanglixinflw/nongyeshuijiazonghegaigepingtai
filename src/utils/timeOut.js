import { routerRedux } from 'dva/router';
import store from '../index';
import { message } from 'antd';
// 全局提示样式
message.config({
    top: 400,
  });
export function timeOut(v){
    if(typeof(store)==='undefined'){
        return
    }else{
        const { dispatch } = store;
        // 未登录直接跳转登录页面
    if(localStorage.getItem('welcome')===null){
        message.error('长时间未操作已超时，请重新登录',4)
        localStorage.clear()
        dispatch(routerRedux.push(`/login`))
    }
    //  请求超时跳转用户登录页面
    if(v===-9){
        message.error('长时间未操作已超时，请重新登录',4)
        localStorage.clear()
        dispatch(routerRedux.push(`/login`))
        location.reload()   
    }
    }
}
