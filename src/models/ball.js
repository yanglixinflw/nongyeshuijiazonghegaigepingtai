import { queryBall } from '../services/api';
export default {
    namespace: 'ball',
    state:{},
    effects: {
        *fetch({ payload }, { call, put }) {  // eslint-disable-line
          const data = yield call(queryBall, payload)
          yield put({ type: 'fetchOk', payload: data })
          // console.log('connect成功')
        }
      },
    
      reducers: {
        fetchOk (state, { payload }) {
          // console.log(payload)
          return { ...state, ...payload }
          
        }
      }
}