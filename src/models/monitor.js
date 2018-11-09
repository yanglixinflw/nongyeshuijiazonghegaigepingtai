import { getMonitorSelectList ,getMonitorList} from '../services/api';
export default {
    namespace: 'monitor',
    state:{

    },
    effects: {
        *fetchSelect({ payload }, { call, put }) {  // eslint-disable-line
          const res = yield call(getMonitorSelectList, payload)
          yield put({ type: 'fetchSelectOk', payload: res })
          // console.log('connect成功')
        },
        *fetchMonitor({ payload }, { call, put }) {  // eslint-disable-line
          const monitorList = yield call(getMonitorList, payload)
          yield put({ type: 'fetchMonitorOk', payload: monitorList })
          // console.log('connect成功')
          // debugger
        },
      },
    
      reducers: {
        fetchSelectOk (state, { payload }) {
          // console.log(payload)
          return { ...state, ...payload }
        },
        fetchMonitorOk(state, { payload }){
          state.monitorList=payload
          return {...state}
        },
        clear(){
          return {}
        }
      }
}