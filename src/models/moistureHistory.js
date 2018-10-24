import { queryDeviceHistory } from '../services/api';
import { queryMoistureTitle } from '../services/api';
export default {
    namespace: 'moistureHistory',
    state:{},
    effects: {
        *fetch({ payload }, { call, put }) {  // eslint-disable-line
          const data = yield call(queryDeviceHistory, payload)
          yield put({ type: 'fetchOk', payload: data })
          // console.log('connect成功')
        },
        *fetchTitle({ payload }, { call, put }) {  // eslint-disable-line
          const Title = yield call(queryMoistureTitle, payload)
          yield put({ type: 'fetchTitleOk', payload: Title })
          // console.log('connect成功')
        }
      },
      reducers: {
        fetchOk (state, { payload }) {
          // console.log(payload)
          return { ...state, ...payload }
          
        },
        fetchTitleOk (state, { payload }) {
          state={
            'title':payload
          }
          return { ...state } 
        }
      }
}