import React, { Component } from 'react';
import MeteorologyHistory from '../../components/DeviceData/meteorologyHistory';
import { connect } from 'dva';
import { Spin } from 'antd';
@connect(({ meteorologyHistory, loading }) => ({
    meteorologyHistory,
    loading: loading.models.meteorologyHistory,
}))
export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            deviceId: ''
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
            type: 'meteorologyHistory/fetch',
            payload: {
                deviceId,
                deviceTypeId: 3,
                pageIndex: 0,
                pageSize: 10
            }
        });
        dispatch({
            type: 'meteorologyHistory/fetchTitle',
        });
    }
    render() {
        let { meteorologyHistory, loading } = this.props
        // console.log(meteorologyhistory)
        let arr = Object.keys(meteorologyHistory)
        if (arr.length <= 1) return meteorologyHistory = null
        return (
            <div>
                <Spin size='large' spinning={loading}>
                    <MeteorologyHistory
                        {...this.props}
                    />
                </Spin>
            </div>
        )

    }
}