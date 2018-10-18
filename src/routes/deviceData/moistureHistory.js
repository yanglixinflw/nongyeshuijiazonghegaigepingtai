import React, { Component } from 'react';
import MoistureHistory from '../../components/DeviceData/moistureHistory';
import { connect } from 'dva';
import { Spin } from 'antd';
@connect(({ moisturehistory, loading }) => ({
    moisturehistory,
    loading: loading.models.moisturehistory,
}))
export default class extends Component {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'moisturehistory/fetch',
        });
    }
    render() {
        let { moisturehistory, loading } = this.props;
        // console.log(moisturehistory)
        let arr = Object.keys(moisturehistory);
        if (arr.length === 0) return moisturehistory = null;
        if (typeof (loading) === 'undefined') {
            return loading = null
        }
        // console.log(loading)
        return (
            <div>
                <Spin size='large' spinning={loading}>
                    <MoistureHistory {...this.props} />
                    
                </Spin>
            </div>
        )

    }
}