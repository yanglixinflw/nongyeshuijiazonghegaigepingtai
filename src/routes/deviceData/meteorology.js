import React, { Component } from 'react';
import Meteorology from '../../components/DeviceData/meteorology';
import { connect } from 'dva';
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
        // console.log(meteorology)
        let arr = Object.keys(meteorology)
        if (arr.length === 0) return meteorology = null
        return (
            <div>
                <Meteorology 
                    {...{meteorology}}
                />
                {/* 123456 */}
            </div>
        )

    }
}