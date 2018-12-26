import {dataAnalysis} from '../services/api';

export default {
    namespace : 'dataAnalysis',
    state:{},
    effects: {
        *fetch(payload, { call, put }) {  // eslint-disable-line
          const response = yield call(dataAnalysis,payload)
          yield put({ type: 'fetchOk', payload: response })
        }
      },
    
      reducers: {
        fetchOk (state, { payload }) {
            // console.log(state)
          return { ...state, ...payload }
        }
      }
}