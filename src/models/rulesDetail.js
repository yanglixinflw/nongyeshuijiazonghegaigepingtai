import { getRulesDetail } from '../services/api';
export default {
  namespace: 'rulesDetail',//命名空间
  state: {},
  effects: {
    *fetch({ payload }, { call, put }) {
      const data = yield call(getRulesDetail, payload)
      yield put({ type: 'fetchOk', payload: data })
    },
  },//发起一个fetch请求
  reducers: {
    fetchOk(state, { payload }) {
      return { ...state, ...payload }
    },
  }//成功的话返回结果
}