import { getValveList,getInstallAddrList} from '../services/api';
export default {
  namespace: 'valveControl',
  state: {},
  effects: {
    *fetch({ payload }, { call, put }) {
      const data = yield call(getValveList, payload)
      yield put({ type: 'fetchOk', payload: data })
    },
    *fetchInstallAddr({ payload }, { call, put }) {  
      const data = yield call(getInstallAddrList, payload)
      yield put({ type: 'fetchInstallAddrOk', payload: data })
    },
  },
  reducers: {
    fetchOk(state, { payload }) {
      state.ValveList=payload
      return { ...state }
    },
    fetchInstallAddrOk (state, { payload }) {
      state.InstallAddr=payload
      return { ...state }
    },
    clear(){
      return {}
    }
  }
}