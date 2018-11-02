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
  componentDidMount(){
    const { dispatch } = this.props
    // 清除缓存数据
    dispatch({
      type:'deviceInformation/clear'
    })
    // 获取设备类型列表
    dispatch({
      type:'deviceInformation/getDeviceTypeList'
    })
    // 获取安装地列表
    dispatch({
      type: 'deviceInformation/getInstallAddrList',
    })
    // 默认全部列表请求方式
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
    // console.log(deviceInformation)
    let arr = Object.keys(deviceInformation)
    if (arr.length <=2) return deviceInformation = null
    // console.log(deviceInformation)
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

