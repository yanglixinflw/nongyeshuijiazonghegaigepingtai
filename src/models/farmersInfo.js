import { getFarmersInfo } from '../services/api';
// import { queryInfoMessageTitle } from '../services/api';
export default {
    namespace: 'farmersInfo',
    state:{},
    effects: {
        *fetch({ payload }, { call, put }) {  // eslint-disable-line
          const data = yield call(getFarmersInfo, payload)
          yield put({ type: 'fetchOk', payload: data })
          // console.log('connect成功')
        },
        // *fetchTitle({ payload }, { call, put }) {  // eslint-disable-line
        //   const Title = yield call(queryInfoMessageTitle, payload)
        //   yield put({ type: 'fetchTitleOk', payload: Title })
        // }
      },
    
      reducers: {
        fetchOk (state, { payload }) {
          return { ...state, ...payload }
        },
        // fetchTitleOk (state, { payload }) {
        //   state={
        //     'title':payload
        //   }
        //   return { ...state } 
        // }
      }
}