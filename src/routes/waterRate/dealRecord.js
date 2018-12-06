import React from "react";
import DealRecord from '../../components/waterRate/dealRecord';
import { connect } from 'dva';
import { Spin } from 'antd'
import {parse} from 'qs';
@connect(({ dealRecord, loading }) => ({
    dealRecord,
    loading: loading.models.dealRecord
}))
export default class extends React.Component{
    componentDidMount() {
        let feeUserId = parse(window.location.href.split(':'))[3];
        const { dispatch } = this.props;
        dispatch({
            type: 'dealRecord/fetch',
            payload:{
                feeUserId,
                "pageIndex": 0,
                "pageSize": 10
            }
        });//type来选择请求的接口，payload为传给后台的参数
    }
    render(){
        let { dealRecord, loading } = this.props;
        let arr = Object.keys(dealRecord);
        if (arr.length === 0) return dealRecord= null;
        return (
            <React.Fragment>
                 <Spin size='large' spinning={loading}>
                    <DealRecord
                        {...this.props}
                    /> 
                 </Spin>
            </React.Fragment>
        )
    }
}
