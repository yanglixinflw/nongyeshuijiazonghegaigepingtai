import { queryWarningDetail } from '../services/api';
export default {
    namespace: 'warningDetail',
    state:{},
    effects: {
        *fetch({ payload }, { call, put }) {  // eslint-disable-line
          const data = yield call(queryWarningDetail, payload)
          yield put({ type: 'fetchOk', payload: data })
        //   console.log('connect成功')
        },
      },
      reducers: {
        fetchOk (state, { payload }) {
          return { ...state, ...payload }
        },
      }
}