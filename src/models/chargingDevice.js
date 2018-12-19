import { getChargingDevice,getInstallAddrList} from '../services/api';
export default {
    namespace: 'chargingDevice',
    state:{},
    effects: {
        *fetch({ payload }, { call, put }) {  
          const data = yield call(getChargingDevice, payload)
          yield put({ type: 'fetchOk', payload: data })
        },
        *fetchInstallAddr({ payload }, { call, put }) {  
          const data = yield call(getInstallAddrList, payload)
          yield put({ type: 'fetchInstallAddrOk', payload: data })
        },
      },
      reducers: {
        fetchOk (state, { payload }) {
          state.ChargingDevice=payload
          return { ...state }
        },
        fetchInstallAddrOk (state, { payload }) {
          state.InstallAddr=payload
          return { ...state }
        },
      }
}