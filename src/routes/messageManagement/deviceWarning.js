import React,{ Component } from 'react';
import DeviceWarning from '../../components/infoManagement/deviceWarning'
import { connect } from 'dva';
import {Spin} from 'antd'
@connect(({ deviceWarning, loading }) => ({
    deviceWarning,
    loading: loading.models.deviceWarning
}))
export default class extends Component{
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceWarning/fetch',
            payload:{
                "pageIndex": 0,
                "pageSize": 10
              }
        });//type来选择请求的接口，payload为传给后台的参数
    }
    render(){
        let { deviceWarning } = this.props;
        console.log(deviceWarning)
        // let arr = Object.keys(deviceWarning);
        // console.log(Object)
        // if (arr.length >=0) return deviceWarning = null;
        return(
            <div>
                <DeviceWarning/>   
            </div>
        )
    }
}
