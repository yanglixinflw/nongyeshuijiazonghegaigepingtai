import { getAutoControl } from '../services/api';
export default {
    namespace: 'autoControl',
    state:{},
    effects: {
        *fetch({ payload }, { call, put }) {  
          const data = yield call(getAutoControl, payload)
          yield put({ type: 'fetchOk', payload: data })
        },
      },
    
      reducers: {
        fetchOk (state, { payload }) {
          return { ...state, ...payload }
        },
      }
}