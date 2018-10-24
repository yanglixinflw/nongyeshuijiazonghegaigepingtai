import { getFarmersInfo } from '../services/api';
export default {
    namespace: 'farmersInfo',
    state:{},
    effects: {
        *fetch({ payload }, { call, put }) {  
          const data = yield call(getFarmersInfo, payload)
          yield put({ type: 'fetchOk', payload: data })
        },
      },
    
      reducers: {
        fetchOk (state, { payload }) {
          return { ...state, ...payload }
        },
      }
}