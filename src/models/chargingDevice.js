import { getChargingDevice } from '../services/api';
export default {
    namespace: 'chargingDevice',
    state:{},
    effects: {
        *fetch({ payload }, { call, put }) {  
          const data = yield call(getChargingDevice, payload)
          yield put({ type: 'fetchOk', payload: data })
        },
      },
      reducers: {
        fetchOk (state, { payload }) {
          return { ...state, ...payload }
        },
      }
}