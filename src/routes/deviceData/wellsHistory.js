import React, { Component } from 'react';
import WellsHistory from '../../components/DeviceData/wellsHistory';
import { connect } from 'dva';
import { Spin } from 'antd';
@connect(({ wellsHistory, loading }) => ({
    wellsHistory,
    loading: loading.models.wellsHistory,
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
        this.setState({
            deviceId,
        })
        const { dispatch } = this.props;
        dispatch({
            type: 'wellsHistory/fetch',
            payload:{
                deviceId,
                deviceTypeId:2,
                pageIndex: 0,
                pageSize: 10
            }
        });
        dispatch({
            type: 'wellsHistory/fetchTitle',
        });
    }
    render() {
        let { wellsHistory, loading } = this.props;
        let arr = Object.keys(wellsHistory);
        if (arr.length <= 1) return wellsHistory = null;
        // console.log(wellsHistory)
        return (
            <div>
                <Spin size='large' spinning={loading}>
                    <WellsHistory
                        {...this.props}
                    />
                </Spin>
            </div>
        )

    }
}