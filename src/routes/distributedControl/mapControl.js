import React, { Component } from 'react';
import MapControl from '../../components/distributedControl/mapControl';
import { connect } from 'dva';
@connect(({ valveControl, loading }) => ({
    valveControl,
    loading: loading.models.valveControl
}))
export default class extends Component {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'valveControl/fetch',
            payload:{
                "deviceTypeId": 1,
                "pageSize": 200
            }
        })
        dispatch({
            type: 'valveControl/fetchWell',
            payload:{
                "deviceTypeId": 2,
                "pageSize": 200
            }
        })
    }
    render() {
        let { valveControl, loading } = this.props;
        let arr = Object.keys(valveControl);
        if (arr.length <=1) return valveControl = null;
        return (
            <div>
                <MapControl 
                    {...{valveControl}}
                />
            </div>
        )

    }
}