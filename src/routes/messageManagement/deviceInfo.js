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
    // 获取公司列表
    dispatch({
      type: 'deviceInformation/getCompanyList',
    })
    // 获取关联建筑物列表
    dispatch({
      type: 'deviceInformation/getRelatedBuilding',
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
        "relatedBuildingId": "",
        "pageIndex": 0,
        "pageSize": 10
      }
    })
  }
  render() {
    let { deviceInformation ,loading} = this.props
    // console.log(deviceInformation)
    let arr = Object.keys(deviceInformation)
    if (arr.length <=4) return deviceInformation = null
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

