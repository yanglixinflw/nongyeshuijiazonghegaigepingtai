import { getWarningRule } from '../services/api';
export default {
    namespace: 'warningRule',
    state:{},
    effects: {
        *fetch({ payload }, { call, put }) {  
          const data = yield call(getWarningRule, payload)
          yield put({ type: 'fetchOk', payload: data })
        },
      },
    
      reducers: {
        fetchOk (state, { payload }) {
          return { ...state, ...payload }
        },
      }
}