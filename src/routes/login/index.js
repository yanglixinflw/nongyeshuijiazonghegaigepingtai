import React from 'react';
import { connect } from 'dva'
import Login from '../../components/Login'
import request from './../../utils/request';
// 开发环境
const envNet = 'http://192.168.30.127:88'

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
        url:`${envNet}${v.data.data.url}`
      })
    })
  }
  // 获取验证码
  getCAPTCHA(){
    return request(`${envNet}/api/Account/captchaInfo`,{
      method:'GET',
      mode:'cors',
    })
  }
  // 点击刷新二维码
  reloadCAPTCHA=()=>{
    let data=this.getCAPTCHA()
    Promise.resolve(data).then((v)=>{
      // 将codeId储存
      this.setState({
        codeId:v.data.data.codeId,
        url:`${envNet}${v.data.data.url}`
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
      <div>
        <Login
          loginFunc={this.submitHandler}
          errorMassage={msg}
          submitting={submitting}
          CAPTCHA={this.state}
          reloadCAPTCHA={this.reloadCAPTCHA}
        >
        </Login>
      </div>
    )
  }
}

