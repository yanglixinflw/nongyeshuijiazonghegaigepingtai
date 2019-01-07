import {getMapDevice} from '../services/api'
export default {
    namespace: 'mapGis',
    state:{},
    effects: {
        *fetchCamera({ payload }, { call, put }) {  
          const data = yield call(getMapDevice, payload)
          yield put({ type: 'fetchCameraOk', payload: data })
        },
        *fetchWaterMeter({ payload }, { call, put }) {  
          const data = yield call(getMapDevice, payload)
          yield put({ type: 'fetcWMhOk', payload: data })
        },
        *fetchElectricMeter({ payload }, { call, put }) {  
          const data = yield call(getMapDevice, payload)
          yield put({ type: 'fetchEMOk', payload: data })
        },
        *fetchWaterValve({ payload }, { call, put }) {  
          const data = yield call(getMapDevice, payload)
          yield put({ type: 'fetchWVOk', payload: data })
        },
        *fetchDemoDevice({ payload }, { call, put }) {  
          const data = yield call(getMapDevice, payload)
          yield put({ type: 'fetchDDOk', payload: data })
        },
      },
    
      reducers: {
        fetchCameraOk (state, { payload }) {
          state.camera = payload
          return { ...state }
        },
        fetcWMhOk (state, { payload }){
          state.waterMeter = payload
          return { ...state }
        },
        fetchEMOk (state, { payload }){
          state.eleMeter = payload
          return { ...state }
        },
        fetchWVOk (state, { payload }){
          state.waterValve = payload
          return { ...state }
        },
        fetchDDOk (state, { payload }){
          state.demoDevice = payload
          return { ...state }
        },
      }
}