import React, { Component } from 'react';
import Ball from '../../components/DeviceData/ball';
import { connect } from 'dva';
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
        let { ball ,loading} = this.props
        // console.log(ball)
        let arr = Object.keys(ball)
        if (arr.length === 0) return ball = null
        return (
            <div>
                <Ball 
                    {...{ball}}
                />
            </div>
        )

    }
}