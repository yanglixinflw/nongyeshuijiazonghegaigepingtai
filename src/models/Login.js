import { queryLogin } from '../services/api';
import { routerRedux } from 'dva/router';
export default {
    namespace: 'Login',
    state: {},
    effects: {
        *fetchLogin({ payload }, { call, put }) {
            const response = yield call(queryLogin, payload)
            // 改变登录状态统一用changeLoginStatus
            yield put({ type: 'changeLoginStatus', payload: response })
            // 返回结果为1，则表示登录成功
            if(response.ret==='1'){
                
            }
        }
    },
    reducers: {
        fetchOk(state, { payload }) {
            return { ...state, ...payload }
        }
    }
}