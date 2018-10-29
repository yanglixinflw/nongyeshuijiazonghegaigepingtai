import React,{ Component } from 'react';
// import DeviceWarning from '../../components/infoManagement/deviceWarning'
import { connect } from 'dva';
import {Spin} from 'antd'
@connect(({ warningRecord, loading }) => ({
    warningRecord,
    loading: loading.models.warningRecord
}))
export default class extends Component{
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'warningRecords/fetch',
            payload:{
                "waringType": 1,
                "warningStatus": 1,
                "deviceId": "",
                "installAddr": "",
                "pageIndex": 0,
                "pageSize": 10
              }
        });//type来选择请求的接口，payload为传给后台的参数
    }
    render(){
        // let { warningRecord,loading } = this.props;
        // let arr = Object.keys(warningRecord);
        // if (arr.length ==0) return warningRecord = null;
        return(
            <div>
                123
                {/* <Spin size='large' spinning={loading}>
                    <DeviceWarning
                        {...this.props}
                    /> 
                </Spin>   */}
            </div>
        )
    }
}
