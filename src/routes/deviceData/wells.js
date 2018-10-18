import React, { Component } from 'react';
import Wells from '../../components/DeviceData/wells';
import { connect } from 'dva';
import { Spin } from 'antd'
@connect(({ wells, loading }) => ({
    wells,
    loading: loading.models.wells,
}))
export default class extends Component {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'wells/fetch',
        });
    }
    render() {
        let { wells, loading } = this.props
        // console.log(moisture)
        let arr = Object.keys(wells)
        if (arr.length === 0) return wells = null
        return (
            <div>
                <Spin size='large' spinning={loading}>
                    <Wells
                        {...{ wells }}
                    />
                </Spin>
            </div>
        )

    }
}