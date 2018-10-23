import React, { Component } from 'react';
import MoistureHistory from '../../components/DeviceData/moistureHistory';
import { connect } from 'dva';
import { Spin } from 'antd';
@connect(({ moistureHistory, loading }) => ({
    moistureHistory,
    loading: loading.models.moistureHistory,
}))
export default class extends Component {
    constructor(props){
        super(props)
        this.state={
            deviceId:''
        }
    }
    componentDidMount() {
        let url = window.location.hash;
        const regexHistory = /history:(.+)/gm;
        let deviceId = regexHistory.exec(url)[1];
        // console.log(deviceId)
        const { dispatch } = this.props;
        dispatch({
            type: 'moisturehistory/fetch',
            payload:{
                deviceId,
                deviceTypeId:4,
                pageIndex: 0,
                pageSize: 10
            }
        });
        dispatch({
            type: 'moisturehistory/fetchTitle',
        });
    }
    render() {
        let { moistureHistory, loading } = this.props;
        // console.log(moistureHistory)
        let arr = Object.keys(moistureHistory);
        if (arr.length <= 1) return moistureHistory = null;
        // console.log(loading)
        return (
            <div>
                <Spin size='large' spinning={loading}>
                    <MoistureHistory 
                        {...this.props} 
                    />
                    
                </Spin>
            </div>
        )

    }
}