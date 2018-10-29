import { queryDeviceHistory } from '../services/api';
export default {
    namespace: 'deviceDataHistory',
    state:{},
    effects: {
        *fetch({ payload }, { call, put }) {  // eslint-disable-line
          const data = yield call(queryDeviceHistory, payload)
          yield put({ type: 'fetchOk', payload: data })
          // console.log('connect成功')
        },
      },
    
      reducers: {
        fetchOk (state, { payload }) {
          // console.log(payload)
          return { ...state, ...payload }
        },
        clear(){
          return 1
        }
      }
}