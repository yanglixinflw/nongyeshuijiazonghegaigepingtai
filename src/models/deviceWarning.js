import { getDeviceWarning } from '../services/api';
export default {
    namespace: 'deviceWarning',
    state:{},
    effects: {
        *fetch({ payload }, { call, put }) {  
          const data = yield call(getDeviceWarning, payload)
          yield put({ type: 'fetchOk', payload: data })
        },
      },
      reducers: {
        fetchOk (state, { payload }) {
          return { ...state, ...payload }
        },
      }
}