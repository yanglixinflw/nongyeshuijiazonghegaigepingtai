import { getDealRecord } from '../services/api';
export default {
  namespace: 'dealRecord',
  state:{},
  effects: {
    *fetch({ payload }, { call, put }) {
      const data = yield call(getDealRecord, payload)
      yield put({ type: 'fetchOk', payload: data })
    },
  },
  reducers: {
    fetchOk (state, { payload }) {
      return { ...state, ...payload }
    },
  }
}
