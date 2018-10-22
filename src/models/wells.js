import { queryDevice } from '../services/api';
import { queryWellsTitle } from '../services/api';
export default {
    namespace: 'wells',
    state:{},
    effects: {
        *fetch({ payload }, { call, put }) {  // eslint-disable-line
          const data = yield call(queryDevice, payload)
          yield put({ type: 'fetchOk', payload: data })
          // console.log('connect成功')
        },
        *fetchTitle({ payload }, { call, put }) {  // eslint-disable-line
          const Title = yield call(queryWellsTitle, payload)
          yield put({ type: 'fetchTitleOk', payload: Title })
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