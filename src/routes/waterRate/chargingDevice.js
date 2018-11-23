import React from "react";
import ChargingDevice from '../../components/waterRate/chargingDevice';
import { connect } from 'dva';
import { Spin } from 'antd'
// @connect(({ chargingDevice, loading }) => ({
//     chargingDevice,
//     loading: loading.models.chargingDevice
// }))
export default class extends React.Component{
    // componentDidMount() {
    //     const { dispatch } = this.props;
    //     dispatch({
    //         type: 'chargingDevice/fetch',
    //         payload:{
    //             "pageIndex": 0,
    //             "pageSize": 10
    //         }
    //     });//type来选择请求的接口，payload为传给后台的参数
    // }
    render(){
        // let { chargingDevice, loading } = this.props;
        // let arr = Object.keys(chargingDevice);
        // if (arr.length === 0) return chargingDevice = null;
        return (
            <React.Fragment>
                {/* <Spin size='large' spinning={loading}> */}
                    <ChargingDevice
                        {...this.props}
                    /> 
                {/* </Spin> */}
            </React.Fragment>
        )
    }
}