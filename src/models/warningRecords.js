import {getWarningRecords,getInstallAddrList} from '../services/api';
export default {
    namespace: 'warningRecords',
    state:{},
    effects: {
        //预警事件记录列表
        *fetch({ payload }, { call, put }) {  
          const data = yield call(getWarningRecords, payload)
          yield put({ type: 'fetchOk', payload: data })
        },
        *fetchInstallAddr({ payload }, { call, put }) {  
          const data = yield call(getInstallAddrList, payload)
          yield put({ type: 'fetchInstallAddrOk', payload: data })
        },
      },
      reducers: {
        fetchOk (state, { payload }) {
          state.WarningRecords=payload
          return { ...state }
        },
        fetchInstallAddrOk (state, { payload }) {
          state.InstallAddr=payload
          return { ...state }
        },
      }
}