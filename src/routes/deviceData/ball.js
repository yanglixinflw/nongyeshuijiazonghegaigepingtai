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
            type: 'ball/fetch',
        });
    }
    render() {
        let { ball, loading } = this.props;
        let arr = Object.keys(ball);
        if (arr.length === 0) return ball = null;
        return (
            <div>
                <Spin size='large' spinning={loading}>
                    <Ball
                        {...{ ball }}
                    />
                </Spin>
            </div>
        )

    }
}