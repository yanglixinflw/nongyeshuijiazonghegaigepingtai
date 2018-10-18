import React from 'react';
import { connect } from 'dva'
import Login from '../../components/Login'
@connect(({ login, loading }) => ({
  login,
  // 正在提交
  submitting: loading.effects['login/fetchLogin']
}))
export default class extends React.Component {
  constructor(props) {
    super(props)

  }
  submitHandler = (err, value) => {
    // console.log(value)
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
    return (
      <div>
        <Login
          loginFunc={this.submitHandler}
          errorMassage={msg}
          submitting={submitting}
        >
        </Login>
      </div>
    )
  }
}

