import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
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
        this.state = {
            title: [],
            deviceTypeId:null
            
        }
        let deviceTypeId = parse(parse(window.location.href.split(':'))[3].split('/'))[0]
        let historyId = parse(window.location.href.split(':'))[4]
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceDataHistory/fetch',
            payload: {
                deviceId: historyId,
                deviceTypeId,
                pageIndex: 0,
                pageSize: 10
            }
        });
        this._getTitle();
    }
    _getTitle(){
        const { dispatch } = this.props;
        // console.log(dispatch)
        let deviceTypeId = parse(parse(window.location.href.split(':'))[3].split('/'))[0];
        // dispatch({
        //     type: 'deviceDataHistory/fetchTitle',
        //     payload: {
        //         deviceTypeId,
        //     }
        // });
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
        }).catch((err)=>{
            console.log(err)
        })
    }
    render() {
        let { deviceDataHistory, loading } = this.props;
        let { title,deviceTypeId } = this.state
        let arr = Object.keys(deviceDataHistory);
        if (arr.length == 0) return deviceDataHistory = null;
        if (title.length == 0) return title = null;
        // console.log(title)
        return (
            <div>
                <Spin size='large' spinning={loading}>
                    <History
                        {...{ deviceDataHistory, title,deviceTypeId}}
                    />
                </Spin>
            </div>
        )
    }
}
