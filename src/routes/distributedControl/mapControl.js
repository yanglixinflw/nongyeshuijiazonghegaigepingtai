import React, { Component } from 'react';
import MapControl from '../../components/distributedControl/mapControl';
import { connect } from 'dva';
@connect(({ mapGis, loading }) => ({
    mapGis,
    loading: loading.models.mapGis
  }))
export default class extends Component {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'mapGis/fetchWaterValve',
            payload: {
              deviceTypeId: 1,
              pageSize: 200
            }
        })
    }
    render() {
        let { mapGis, loading } = this.props;
        let arr = Object.keys(mapGis);
        if (arr.length ==0 ) return mapGis = null;
        return (
            <div>
                <MapControl 
                    {...{mapGis}}
                />
            </div>
        )

    }
}