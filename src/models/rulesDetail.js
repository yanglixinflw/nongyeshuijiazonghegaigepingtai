import { getValveList } from '../services/api';
export default {
    namespace: 'rulesDetail',
    state:{},
    effects: {
        *fetch({ payload }, { call, put }) {  
          const data = yield call(getValveList, payload)
          yield put({ type: 'fetchOk', payload: data })
        },
      },
    
      reducers: {
        fetchOk (state, { payload }) {
          return { ...state, ...payload }
        },
      }
}