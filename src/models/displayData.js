import { getDeviceCount , getDeviceOperateCount} from '../services/api';
export default {
    namespace: 'displayData',
    state:{},
    effects: {
        *fetchDeviceCount({ payload }, { call, put }) {  
          const data = yield call(getDeviceCount, payload)
          yield put({ type: 'fetchDeviceCountOk', payload: data })
        },
        *fetchOperateCount({ payload }, { call, put }) {  
          const data = yield call(getDeviceOperateCount, payload)
          yield put({ type: 'fetchOperateCountOk', payload: data })
        },
      },
      reducers: {
        fetchDeviceCountOk (state, { payload }) {
            state.deviceCount = payload
            return { ...state }
        },
        fetchOperateCountOk(state, { payload }) {
          state.operateCount = payload
          return { ...state }
      },
        clear(){
          return {}
        }
      }
}