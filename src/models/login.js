import { queryLogin } from '../services/api';
import { routerRedux } from 'dva/router';
export default {
    namespace: 'login',
    state: {},
    effects: {
        *fetchLogin({ payload }, { call, put }) {
            const response = yield call(queryLogin, payload)
            // 用fetchOk返回值
            yield put({ 
                type: 'fetchOk',
             payload: response })
            // 返回结果为1，则表示登录成功
            if(response.ret==='1'){
                console.log('登录成功')
            }else{
                console.log(response)
            }
            
        }
    },
    reducers: {
        fetchOk(state, { payload }) {
            return { ...state, ...payload }
        }
    }
}