import { getOperatingRecord } from '../services/api';
export default {
    namespace: 'operatingRecord',
    state:{},
    effects: {
        *fetch({ payload }, { call, put }) {  
          const data = yield call(getOperatingRecord, payload)
          yield put({ type: 'fetchOk', payload: data })
        },
      },
      reducers: {
        fetchOk (state, { payload }) {
          return { ...state, ...payload }
        },
        clear (){
          return {}
        }
      }
}