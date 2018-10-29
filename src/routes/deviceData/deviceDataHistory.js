import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Button } from 'antd';
import BreadcrumbView from '../../components/PageHeader/breadcrumb';
import { parse } from 'qs';
import History from '../../components/DeviceData/deviceDataHistory';
// 开发环境
const envNet = 'http://192.168.30.127:88';
//请求title url
const getTitle = `${envNet}/api/DeviceData/columns`;
// post通用设置
let postOption = {
    method: 'POST',
    credentials: "include",
    mode: 'cors',
    headers: new Headers({
        'Content-Type': 'application/json',
    }),
};
@connect(({ deviceDataHistory, loading }) => ({
    deviceDataHistory,
    loading: loading.models.deviceDataHistory,
}))
export default class extends Component {
    constructor(props) {
        super(props)
        this.state={
            title:[]
        }
    }
    componentDidMount() {
        let deviceTypeId = parse(parse(window.location.href.split(':'))[3].split('/'))[0]
        let historyId = parse(window.location.href.split(':'))[4]
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceDataHistory/clear',
        })
        dispatch({
            type: 'deviceDataHistory/fetch',
            payload: {
                deviceId: historyId,
                deviceTypeId,
                pageIndex: 0,
                pageSize: 10
            }
        });
        this.setState({
            deviceTypeId
        }) 
        this._getTitle(deviceTypeId);
    }
    _getTitle(deviceTypeId) {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceDataHistory/clear',
        })
        return fetch(getTitle, {
            ...postOption,
            body: JSON.stringify({
                deviceTypeId,
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    if (v.ret == 1) {
                        // console.log(v)
                        this.setState({
                            title: v.data,
                            deviceTypeId
                        })
                    }
                })
        }).catch((err) => {
            console.log(err)
        })
    }
    render() {
        // console.log(this.props)
        let { deviceDataHistory, loading } = this.props;
        let { deviceTypeId,title } = this.state
        let arr = Object.keys(deviceDataHistory);
        if (arr.length == 0) return deviceDataHistory = null;
        if (title.length == 0) return title = null;
        return (
            <div>
                <Spin size='large' spinning={loading}>
                    <BreadcrumbView
                        {...this.props}
                    />
                    <History
                        {...{ deviceDataHistory, title, deviceTypeId }}
                    />
                </Spin>
            </div>
        )
    }
}
