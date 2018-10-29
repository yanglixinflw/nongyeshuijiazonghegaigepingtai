import { queryLogin } from '../services/api';
import { routerRedux } from 'dva/router';
export default {
    namespace: 'login',
    state: {
        msg:''
    },
    effects: {
        *fetchLogin({ payload }, { call, put }) {
            const response = yield call(queryLogin, payload)
            // 用fetchOk返回值
            yield put({ 
                type: 'fetchOk',
             payload: response })
            // 返回结果为1，则表示登录成功
            if(response.data.ret==1){
                // 跳转到首页
                yield put(routerRedux.replace('/gismap/gismapPage'));
                let yzNumber=Math.floor(Math.random()*100+100)
                // 使用islogin保存登录状态
                localStorage.setItem('welcome',yzNumber)
                // console.log('登录成功--models')
            }else{
                console.log('登录失败')
            }
            
        }
    },
    reducers: {
        fetchOk(state, { payload }) {
            return { ...state, ...payload }
        }
    }
}