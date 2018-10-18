import React, { Component } from 'react';
import BallHistory from '../../components/DeviceData/ballHistory';
import { connect } from 'dva';
import { Spin } from 'antd';
@connect(({ ballhistory, loading }) => ({
    ballhistory,
    loading: loading.models.ballhistory,
}))
export default class extends Component {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'ballhistory/fetch',
        });
    }
    render() {
        let { ballhistory, loading } = this.props;
        let arr = Object.keys(ballhistory);
        if (arr.length === 0) return ballhistory = null;
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