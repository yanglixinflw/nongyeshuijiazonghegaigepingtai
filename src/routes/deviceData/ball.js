import React, { Component } from 'react';
import Ball from '../../components/DeviceData/ball';
import { connect } from 'dva';
import { Spin } from 'antd';
@connect(({ ball, loading }) => ({
    ball,
    loading: loading.models.ball,
}))
export default class extends Component {
    componentDidMount() {
        const { dispatch } = this.props; 
        dispatch({
            type: 'ball/fetchTitle',
        });
        dispatch({
            type: 'ball/fetch',
            payload:{
                "deviceTypeId": 1,
                "deviceId": "",
                "name": "",
                "installAddrId": 0,
                "showColumns": [],
                "pageIndex": 0,
                "pageSize": 10
            }
        });
    }
    render() {
        let { ball, loading } = this.props;
        let arr = Object.keys(ball);
        if (arr.length<= 1) return ball = null;
        // console.log(this.props)
        return (
            <div>
                <Spin size='large' spinning={loading}>
                    <Ball
                        {...{ball}}
                    />
                </Spin>
            </div>
        )

    }
}