import {getDeviceInfo} from '../services/api';

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
            console.log(123)
        }
    },
    reducers:{
        fetchOk(state,{payload}){
            return {...state,...payload}
        }
    }
}