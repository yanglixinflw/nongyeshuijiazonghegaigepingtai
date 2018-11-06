import {
    getDeviceInfo,
    getInstallAddrList,
    getDeviceTypeList,
    getRelatedBuilding
} from '../services/api';

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
        },
        *getDeviceTypeList({payload},{call,put}){
            const TypeList =yield call(getDeviceTypeList,payload)
            yield put ({
                type:'fetchDeviceType',
                payload:TypeList
            })
        },
        *getRelatedBuilding({payload},{call,put}){
            const relatedBuilding =yield call(getRelatedBuilding,payload)
            yield put ({
                type:'fetchRelatedBuilding',
                payload:relatedBuilding
            })
        }
    },
    reducers:{
        fetchOk(state,{payload}){
            return {...state,...payload}
        },
        fetchInstallList(state,{payload}){
            state.InstallList=payload
            return {...state}
        },
        fetchDeviceType(state,{payload}){
            state.DeviceTypeList=payload
            return {...state}
        },
        fetchRelatedBuilding(state,{payload}){
            state.relatedBuilding=payload
            return {...state}
        },
        clear(){
            return{}
        }
    }
}