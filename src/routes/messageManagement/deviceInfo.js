import React from 'react'
import { connect } from 'dva';

@connect(({ deviceInformation, loading }) => ({
  deviceInformation,
  // 正在提交
  loading: loading.effects['deviceInformation/getInfo']
}))
export default class extends React.Component {
    constructor(props){
      super(props)
      const { dispatch } = props
      dispatch({
        type: 'deviceInformation/getInfo',
      })
    }
    render() {
      console.log(this.props)
      return (
        <div>
          123
        </div>
      )
    }
  }
  
  