import React, { Component } from 'react';
import Moisture from '../../components/DeviceData/moisture';
import { connect } from 'dva';
@connect(({ moisture, loading }) => ({
    moisture,
    loading: loading.models.moisture,
}))
export default class extends Component {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'moisture/fetch',
        });
    }
    render() {
        let { moisture ,loading} = this.props
        // console.log(moisture)
        let arr = Object.keys(moisture)
        if (arr.length === 0) return moisture = null
        return (
            <div>
                <Moisture {...{moisture}}/>
                {/* 123456 */}
            </div>
        )

    }
}