import { getGroupAccount } from '../services/api';
export default {
    namespace: 'groupAccount',
    state:{},
    effects: {
        *fetch({ payload }, { call, put }) {  
          const data = yield call(getGroupAccount, payload)
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