import React from 'react';
import {connect} from 'dva'
import Login from '../../components/Login'
@connect(({login,loading})=>({
  login,
  // 正在提交
  submitting:loading.effects['login/fetchLogin']
}))
export default class extends React.Component {
  constructor(props){
    super(props)
    
  }
  submitHandler=(err,value)=>{
    // console.log(this.props)
    const {dispatch} =this.props
    // if(!err){
      dispatch({
        type:'login/fetchLogin',
        payload:{
          ...value
        }
      })
    // }
  }
  render() {
    // 返回error信息到页面内
    console.log(this.props.login)
    return (
      <div>
        <Login 
        loginFunc={this.submitHandler}
        errorMassage='123456'
        >
        </Login>
      </div>
    )
  }
}

