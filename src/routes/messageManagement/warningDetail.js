import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import BreadcrumbView from '../../components/PageHeader/breadcrumb';
import WarningDetail from '../../components/infoManagement/warningDetail';
import { parse } from 'qs';
@connect(({ warningDetail, loading }) => ({
    warningDetail,
    loading: loading.models.warningDetail,
}))
export default class extends Component {
    constructor(props){
        super(props)
        // console.log(props)
        this.state = {
            deviceId:''
        }
    }
    componentDidMount() {
        let deviceId = parse(window.location.href.split(':'))[3];
        // console.log(deviceId)
        const { dispatch } = this.props;
        dispatch({
            type:'warningDetail/clear'
        })
        dispatch({
            type: 'warningDetail/fetch',
            payload: {
                deviceId,
            }
        });
        this.setState({
            deviceId
        })
    }
    render() {
        let { warningDetail, loading } = this.props;
        let {deviceId} = this.state;
        let arr = Object.keys(warningDetail);
        if (arr.length == 0) return warningDetail = null;
        // console.log(this.props)
        return (
            <Fragment>
                <Spin size='large' spinning={loading}>
                    <BreadcrumbView
                        {...this.props}
                    />
                    <WarningDetail {...{warningDetail,deviceId}}/>
                </Spin>
            </Fragment>
        )
    }
}