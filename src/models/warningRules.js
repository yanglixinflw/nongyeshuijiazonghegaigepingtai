import { getWarningRules ,getDeviceTypeList} from '../services/api';
export default {
    namespace: 'warningRules',
    state:{},
    effects: {
        *fetch({ payload }, { call, put }) {  
          const data = yield call(getWarningRules, payload)
          yield put({ type: 'fetchOk', payload: data })
        },
        *fetchDeviceTypeList({payload},{call,put}){
          const deviceTypeList = yield call(getDeviceTypeList, payload)
          yield put({ type: 'deviceTypeList', payload: deviceTypeList })
        }
      },
      reducers: {
        fetchOk (state, { payload }) {
          return { ...state, ...payload }
        },
        deviceTypeList(state, { payload }){
          state.deviceTypeList=payload
          return { ...state }
        }
      }
}