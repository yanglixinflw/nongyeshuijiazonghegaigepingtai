import React, { Component } from 'react';
import Moisture from '../../components/DeviceData/moisture';
import { connect } from 'dva';
@connect(({ Moisture, loading }) => ({
    Moisture,
    loading: loading.models.Moisture,
}))
export default class extends Component {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'Moisture/fetch',
        });
        // console.log(...{Moisture})
    }
    render() {
        // let { Moisture ,loading} = this.props
        // console.log(Moisture)
        return (
            <div>
                <Moisture {...{Moisture}}/>
            </div>
        )

    }
}