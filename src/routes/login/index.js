import React,{Fragment} from 'react';
import { connect } from 'dva'
import Login from '../../components/Login'
import request from './../../utils/request';
import {ENVNet} from '../../services/netCofig'
import { routerRedux } from 'dva/router';
@connect(({ login, loading }) => ({
  login,
  // 正在提交
  submitting: loading.effects['login/fetchLogin']
}))
export default class extends React.Component {
  constructor(props) {
    super(props)
    let data=this.getCAPTCHA()
    Promise.resolve(data).then((v)=>{
      // 将codeId储存
      this.setState({
        codeId:v.data.data.codeId,
        url:`${ENVNet}${v.data.data.url}`
      })
    })
  }
  componentDidMount(){
    const {dispatch}=this.props
    // 验证是否已登录
    let loginOrNot = localStorage.getItem('welcome')
    if (loginOrNot >= 100) {
      // 进入主页
      dispatch(routerRedux.push('/'));
    } 
  }
  // 获取验证码
  getCAPTCHA(){
    return request(`${ENVNet}/api/Account/captchaInfo`,{
      method:'GET',
      mode:'cors',
    },'login')
  }
  // 点击刷新二维码
  reloadCAPTCHA=()=>{
    let data=this.getCAPTCHA()
    Promise.resolve(data).then((v)=>{
      // 将codeId储存
      this.setState({
        codeId:v.data.data.codeId,
        url:`${ENVNet}${v.data.data.url}`
      })
    })
  }

  submitHandler = (err, value) => {
    const {codeId}= this.state
    // 传递验证码id
    value.verifyCodeId=codeId
    // console.log(value)
    // 添加codeId字段
    const { dispatch } = this.props
    // 先本地验证，无错误时提交验证用户密码
    if(!err){
    dispatch({
      type: 'login/fetchLogin',
      payload: {
        ...value
      }
    })
    }
  }
  render() {
    // 返回error信息到页面内
    let  { login ,submitting} = this.props
    let {msg}=login
    let arr =Object.keys(login)
    if(arr.length==2){
      msg=login.data.msg
    }
    if(this.state==null){
      return null
    }
    return (
      <Fragment>
        <Login
          loginFunc={this.submitHandler}
          errorMessage={msg}
          submitting={submitting}
          CAPTCHA={this.state}
          reloadCAPTCHA={this.reloadCAPTCHA}
        >
        </Login>
      </Fragment>
    )
  }
}

