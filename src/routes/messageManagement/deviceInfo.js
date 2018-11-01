import React,{Fragment }from 'react'
import { connect } from 'dva';
import {Spin} from 'antd'
import DeviceInfo from 'components/infoManagement/deviceInfo'
@connect(({ deviceInformation, loading }) => ({
  deviceInformation,
  // 正在提交
  loading: loading.effects['deviceInformation/getInfo']
}))
export default class extends React.Component {
  constructor(props) {
    super(props)
    const { dispatch } = props
    // 获取安装地列表
    dispatch({
      type: 'deviceInformation/getInstallAddrList',
    })
    // 默认列表请求方式
    dispatch({
      type: 'deviceInformation/getInfo',
      payload: {
        "deviceId": "",
        "name": "",
        "deviceTypeId": "",
        "installAddrId": "",
        "warningRules": "",
        "areaName": "",
        "pageIndex": 0,
        "pageSize": 10
      }
    })   
  }
  render() {
    let { deviceInformation ,loading} = this.props
    let arr = Object.keys(deviceInformation)
    if (arr.length <=1) return deviceInformation = null
    return (
      <Fragment>
        <Spin size='large' spinning={loading}>
        <DeviceInfo
          {...deviceInformation}
        />
        </Spin>
        </Fragment>
    )
  }
}

