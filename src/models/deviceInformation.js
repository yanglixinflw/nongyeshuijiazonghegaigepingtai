import {
    getDeviceInfo,
    getInstallAddrList,
    getDeviceTypeList,
    getRelatedBuilding,
    getCompanyList
} from '../services/api';

export default {
    namespace:'deviceInformation',
    state:{
    },
    effects:{
        // 列表信息
        *getInfo({payload},{call,put}){
            const res =yield call(getDeviceInfo,payload)
            yield put ({
                type:'fetchOk',
                payload:res
            })
        },
        // 安装地址
        *getInstallAddrList({payload},{call,put}){
            const list =yield call(getInstallAddrList,payload)
            yield put ({
                type:'fetchInstallList',
                payload:list
            })
        },
        // 设备类型
        *getDeviceTypeList({payload},{call,put}){
            const TypeList =yield call(getDeviceTypeList,payload)
            yield put ({
                type:'fetchDeviceType',
                payload:TypeList
            })
        },
        // 关联建筑物
        *getRelatedBuilding({payload},{call,put}){
            const relatedBuilding =yield call(getRelatedBuilding,payload)
            yield put ({
                type:'fetchRelatedBuilding',
                payload:relatedBuilding
            })
        },
        // 公司列表
        *getCompanyList({payload},{call,put}){
            const companyList=yield call(getCompanyList,payload)
            yield put ({
                type:'fetchCompanyList',
                payload:companyList
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
            state.RelatedBuilding=payload
            return {...state}
        },
        fetchCompanyList(state,{payload}){
            state.CompanyList=payload
            return {...state}
        },
        clear(){
            return{}
        }
    }
}