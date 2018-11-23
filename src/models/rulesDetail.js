import { getRulesDetail } from '../services/api';
export default {
  namespace: 'rulesDetail',
  state: {},
  effects: {
    *fetch({ payload }, { call, put }) {
      const data = yield call(getRulesDetail, payload)
      yield put({ type: 'fetchOk', payload: data })
        //  console.log('connect成功')
    },
  },

  reducers: {
    fetchOk(state, { payload }) {
      return { ...state, ...payload }
    },
    clear(){
      return {}
    }
  }
}