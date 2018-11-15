import React from "react";
import OperatingRecord from '../../components/distributedControl/operatingRecord';
import { connect } from 'dva';
import { Spin } from 'antd'
@connect(({ operatingRecord, loading }) => ({
    operatingRecord,
    loading: loading.models.operatingRecord
}))
export default class extends React.Component{
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'operatingRecord/fetch',
            payload:{
                // "deviceTypeId": 1,
                // "pageIndex": 0,
                // "pageSize": 10
            }
        });//type来选择请求的接口，payload为传给后台的参数
    }
    render(){
        let { operatingRecord, loading } = this.props;
        // console.log(operatingRecord)
        let arr = Object.keys(operatingRecord);
        if (arr.length <=0) return operatingRecord = null;
        return (
            <React.Fragment>
                <Spin size='large' spinning={loading}>
                    <OperatingRecord
                        {...{operatingRecord}}
                    /> 
                </Spin>
            </React.Fragment>
        )
    }
}