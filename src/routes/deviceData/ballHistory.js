import React, { Component } from 'react';
import BallHistory from '../../components/DeviceData/ballHistory';
import { connect } from 'dva';
import { Spin } from 'antd';
@connect(({ ballHistory, loading }) => ({
    ballHistory,
    loading: loading.models.ballHistory,
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
            type: 'ballHistory/fetchTitle',
        });
        dispatch({
            type: 'ballHistory/fetch',
            payload:{
                deviceId,
                deviceTypeId:1,
                pageIndex: 0,
                pageSize: 10
            }
        });
        
    }
    render() {
        let { ballHistory, loading } = this.props;
        // console.log(ballHistory)
        let arr = Object.keys(ballHistory);
        if (arr.length <= 1) return ballHistory = null;
        return (
            <div>
                <Spin size='large' spinning={loading}>
                    <BallHistory
                        {...this.props}
                    />
                </Spin>
            </div>
        )

    }
}