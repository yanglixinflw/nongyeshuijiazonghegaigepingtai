import React, { Component } from 'react';
import Moisture from '../../components/DeviceData/moisture';
import { connect } from 'dva';
@connect(({ moisture, loading }) => ({
    moisture,
    loading: loading.models.Moisture,
}))
export default class extends Component {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'moisture/fetch',
        });
        // console.log(moisture)
    }
    render() {
        let { moisture ,loading} = this.props
        console.log(moisture)
        return (
            <div>
                <Moisture {...{moisture}}/>
            </div>
        )

    }
}