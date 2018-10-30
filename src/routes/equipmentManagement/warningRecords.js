import React,{ Component } from 'react';
import WarningRecords from '../../components/equipmentManagement/warningRecords'
import { connect } from 'dva';
import {Spin} from 'antd'
@connect(({ warningRecords, loading }) => ({
    warningRecords,
    loading: loading.models.warningRecords
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
        let { warningRecords,loading } = this.props;
        let arr = Object.keys(warningRecords);
        if (arr.length ==0) return warningRecords = null;
        return(
            <React.Fragment>
                <Spin size='large' spinning={loading}>
                    <WarningRecords
                        {...this.props}
                    /> 
                </Spin>  
            </React.Fragment>
        )
    }
}
