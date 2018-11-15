import { queryDevice,
  queryDeviceTitle,
  getInstallAddrList
} from '../services/api';
export default {
    namespace: 'deviceData',
    state:{
    },
    effects: {
        *fetch({ payload }, { call, put }) {  // eslint-disable-line
          const data = yield call(queryDevice, payload)
          yield put({ type: 'fetchOk', payload: data })
          // console.log('connect成功')
        },
        *fetchTitle({ payload }, { call, put }) {  // eslint-disable-line
          const Title = yield call(queryDeviceTitle, payload)
          yield put({ type: 'fetchTitleOk', payload: Title })
        },
        // 安装地址
        *getInstallAddrList({payload},{call,put}){
          const list =yield call(getInstallAddrList,payload)
          yield put ({
              type:'fetchInstallList',
              payload:list
          })
      },
      },
    
      reducers: {
        fetchOk (state, { payload }) {
          // console.log(payload) 
          return {  ...state,...payload }   
        },
        fetchTitleOk (state, { payload }) {
          state.title=payload
          return { ...state } 
        },
        fetchInstallList(state,{payload}){
          state.InstallList=payload
          return {...state}
        },
        clear(){
          return {}
        }
      }
}