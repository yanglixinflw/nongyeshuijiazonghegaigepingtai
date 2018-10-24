import {getDeviceInfo,getInstallAddrList} from '../services/api';

export default {
    namespace:'deviceInformation',
    state:{

    },
    effects:{
        *getInfo({payload},{call,put}){
            const res =yield call(getDeviceInfo,payload)
            yield put ({
                type:'fetchOk',
                payload:res
            })
        },
        *getInstallAddrList({payload},{call,put}){
            const list =yield call(getInstallAddrList,payload)
            yield put ({
                type:'fetchInstallList',
                payload:list
            })
        }
    },
    reducers:{
        fetchOk(state,{payload}){
            return {...state,...payload}
        },
        fetchInstallList(state,{payload}){
            state={
                list:payload
            }
            return {...state}
        }
    }
}