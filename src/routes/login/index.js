import React from 'react';
import {connect} from 'dva'
import Login from '../../components/Login'
export default class extends React.Component {
  constructor(props){
    super(props)
    console.log(props)
  }
  submitHandler(err,value){
    console.log(value)
  }
  render() {
    // 返回error信息到页面内
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

