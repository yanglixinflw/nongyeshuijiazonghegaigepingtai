import React, { Component } from 'react';
import WellsHistory from '../../components/DeviceData/wellsHistory';
import { connect } from 'dva';
import { Spin } from 'antd';
@connect(({ wellshistory, loading }) => ({
    wellshistory,
    loading: loading.models.wellshistory,
}))
export default class extends Component {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'wellshistory/fetch',
        });
    }
    render() {
        let { wellshistory, loading } = this.props;
        let arr = Object.keys(wellshistory);
        if (arr.length === 0) return wellshistory = null;
        // console.log(wellshistory)
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