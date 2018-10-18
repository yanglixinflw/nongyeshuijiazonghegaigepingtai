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
            type: 'meteorology/fetch',
        });
    }
    render() {
        let { meteorology ,loading} = this.props
        let arr = Object.keys(meteorology)
        if (arr.length === 0) return meteorology = null
        if(typeof(loading)==='undefined'){
            return loading=null
        }
        // console.log(loading)
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