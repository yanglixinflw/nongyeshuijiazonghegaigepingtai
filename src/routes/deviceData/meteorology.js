import React, { Component } from 'react';
import Meteorology from '../../components/DeviceData/meteorology';
import { connect } from 'dva';
import {Spin} from 'antd';
@connect(({ meteorology, loading }) => ({
    meteorology,
    loading: loading.models.meteorology,
}))
export default class extends Component {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'meteorology/fetchTitle',
        });
        dispatch({
            type: 'meteorology/fetch',
            payload:{
                "deviceTypeId": 3,
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
        let { meteorology ,loading} = this.props
        let arr = Object.keys(meteorology)
        if (arr.length <= 1) return meteorology = null
        return (
            <div>
                <Spin size='large' spinning={loading}>
                    <Meteorology 
                        {...{meteorology}}
                    />
                    {/* 123456 */}
                </Spin>
            </div>
        )

    }
}