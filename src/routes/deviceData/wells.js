import React, { Component } from 'react';
import Wells from '../../components/DeviceData/wells';
import { connect } from 'dva';
import { Spin } from 'antd'
@connect(({ wells, loading }) => ({
    wells,
    loading: loading.models.wells,
}))
export default class extends Component {
    componentDidMount() {
        const { dispatch } = this.props;
<<<<<<< HEAD
        // console.log(this.props)
=======
>>>>>>> 690a9d949581ddea082307db69f9d302ee90d8c1
        dispatch({
            type: 'wells/fetchTitle',
        });
        dispatch({
            type: 'wells/fetch',
            payload:{
                "deviceTypeId": 2,
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
        let { wells, loading } = this.props;
        let arr = Object.keys(wells);
        if (arr.length <= 1) return wells = null;
        return (
            <div>
                <Spin size='large' spinning={loading}>
                    <Wells
                        {...{ wells }}
                    />
                </Spin>
            </div>
        )

    }
}