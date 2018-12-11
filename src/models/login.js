import { queryLogin ,queryLoginNoCaptcha} from '../services/api';
import { routerRedux } from 'dva/router';
export default {
    namespace: 'login',
    state: {
        errTime:''
    },
    effects: {
        *fetchLogin({ payload }, { call, put }) {
            const response = yield call(queryLogin, payload)
            // 用fetchOk返回值
            yield put({ 
                type: 'fetchOk',
             payload: response })
            // 返回结果为1，则表示登录成功
            if(response.data.ret==1){
                // console.log(response)
                // 跳转到首页
                yield put(routerRedux.replace('/gismap/gismapPage'));
                let yzNumber=Math.floor(Math.random()*100+100)
                // 使用islogin保存登录状态
                localStorage.setItem('welcome',yzNumber)
                // 设置用户名
                localStorage.setItem('userName',response.data.data.loginName)
                // 登录后设置无验证码
                localStorage.setItem('firstLogin',false)
                // 保存屏幕数
                localStorage.setItem('monitorNum',9)
                // console.log('登录成功--models')
            }else{
                console.log('登录失败')
            }
            
        },
        *LoginNoCaptcha({ payload,callback }, { call, put }) {
            const response = yield call(queryLoginNoCaptcha, payload)
            // 用fetchOk返回值
            yield put({ 
                type: 'noCaptchaOk',
             payload: response })
            // 返回结果为1，则表示登录成功
            if(response.data.ret==1){
                // console.log(response)
                // 跳转到首页
                yield put(routerRedux.replace('/gismap/gismapPage'));
                let yzNumber=Math.floor(Math.random()*100+100)
                // 使用islogin保存登录状态
                localStorage.setItem('welcome',yzNumber)
                // 设置用户名
                localStorage.setItem('userName',response.data.data.loginName)
                // 保存屏幕数
                localStorage.setItem('monitorNum',9)
            }else{
                callback()
            }
            
        }
    },
    reducers: {
        fetchOk(state, { payload }) {
            return { ...state, ...payload }
        },
        noCaptchaOk(state, { payload }) {
            return { ...state, ...payload }
        }
    }
}