import {getWarningRecords} from '../services/api';
export default {
    namespace: 'warningRecords',
    state:{},
    effects: {
        *fetch({ payload }, { call, put }) {  
          const data = yield call(getWarningRecords, payload)
          yield put({ type: 'fetchOk', payload: data })
        },
      },
      reducers: {
        fetchOk (state, { payload }) {
          return { ...state, ...payload }
        },
      }
}