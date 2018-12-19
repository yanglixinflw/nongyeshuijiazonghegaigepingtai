import { getGroupManage,getFarmersInfo } from '../services/api';
export default {
    namespace: 'groupManage',
    state:{},
    effects: {
        *fetchGroup({ payload }, { call, put }) {  
          const data = yield call(getGroupManage, payload)
          yield put({ type: 'fetchGroupOk', payload: data })
        },
        *fetchFarmer({ payload }, { call, put }) {  
          const data = yield call(getFarmersInfo, payload)
          yield put({ type: 'fetchFarmerOk', payload: data })
        },
    },
    reducers: {
      fetchGroupOk (state, { payload }) {
          state.groupManage = payload
          return { ...state } 
        },
        fetchFarmerOk (state, { payload }) {
          state.farmersInfo = payload
          return { ...state }
        },
    }
}