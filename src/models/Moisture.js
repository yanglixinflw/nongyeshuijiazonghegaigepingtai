import { queryMoisture } from '../services/api';
export default {
    namespace: 'moisture',
    state:{},
    effects: {
        *fetch({ payload }, { call, put }) {  // eslint-disable-line
          const data = yield call(queryMoisture, payload)
          yield put({ type: 'fetchOk', payload: data })
          // console.log('connect成功')
        }
      },
      reducers: {
        fetchOk (state, { payload }) {
            // console.log(state)
          return { ...state, ...payload }
        }
      }
}