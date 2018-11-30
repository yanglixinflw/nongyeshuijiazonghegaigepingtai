import { getAutoRules } from '../services/api';
export default {
    namespace: 'autoRules',
    state:{},
    effects: {
        *fetch({ payload }, { call, put }) {  
          const data = yield call(getAutoRules, payload)
          yield put({ type: 'fetchOk', payload: data })
        },
      },
      reducers: {
        fetchOk (state, { payload }) {
          return { ...state, ...payload }
        },
        clear(){
          return {}
        }
      }
}