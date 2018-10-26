import React, { Component } from 'react';
import DeviceData from '../../components/DeviceData/deviceData';
import { connect } from 'dva';
import { Spin } from 'antd';
import { parse } from 'qs';
import {getMenuData} from '../../common/menu'
import { urlToList } from '../../components/_utils/pathTools';
@connect(({ deviceData, loading }) => ({
    deviceData,
    loading: loading.models.deviceData,
}))
export default class extends Component {
    constructor(props) {
        super(props)
        // 初始化
        const deviceTypeId = parse(window.location.href.split(':'))[3]
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceData/fetchTitle',
            payload: {
                deviceTypeId,
            }
        });
        dispatch({
            type: 'deviceData/fetch',
            payload: {
                 deviceTypeId,
                "deviceId": "",
                "name": "",
                "installAddrId": 0,
                "showColumns": [],
                "pageIndex": 0,
                "pageSize": 10
            }
        });
        
        // 获取name
        let pathName=this.props.location.pathname
        const pathSnippets = urlToList(pathName);
        let breadcrumbData = getMenuData().filter(
            (item) => {
            let res = item.children.filter(item => item.path.indexOf(pathSnippets[0])!==-1);
            if(res.length){
                return item
            }
            }
        )
        // 获取到匹配的children
        let childrenName=breadcrumbData[0].children
        // 匹配到name
        let title=childrenName.filter(item=>item.path===pathName)
        // console.log(title[0].name)
        this.state={
            deviceTypeId,
            pageTitle:title[0].name
        }
    }
    componentWillUpdate(nextProps) {
        // 根据不同的设备ID获取不同的数据
        if (this.props.location !== nextProps.location) {
            // 路由变化
            const { dispatch } = this.props;
            const deviceTypeId = parse(window.location.href.split(':'))[3]
            dispatch({
                type: 'deviceData/fetchTitle',
                payload: {
                    "deviceTypeId": deviceTypeId,
                }
            });
            dispatch({
                type: 'deviceData/fetch',
                payload: {
                    "deviceTypeId": deviceTypeId,
                    "deviceId": "",
                    "name": "",
                    "installAddrId": 0,
                    "showColumns": [],
                    "pageIndex": 0,
                    "pageSize": 10
                }
            });
            // 获取name
            let pathName = nextProps.location.pathname
            const pathSnippets = urlToList(pathName);
            let breadcrumbData = getMenuData().filter(
                (item) => {
                    let res = item.children.filter(item => item.path.indexOf(pathSnippets[0]) !== -1);
                    if (res.length) {
                        return item
                    }
                }
            )
            // 获取到匹配的children
            let childrenName = breadcrumbData[0].children
            // console.log(childrenName)
            // 匹配到name
            let title = childrenName.filter(item => item.path === pathName)
            // console.log(title[0].name)
            this.setState({
                deviceTypeId,
                pageTitle:title[0].name
            })
        }
    }
    render() {
        let { deviceData, loading } = this.props;
        let {deviceTypeId,pageTitle}=this.state
        let arr = Object.keys(deviceData);
        if (arr.length <= 1) return deviceData = null;
        return (
            <div>
                <Spin size='large' spinning={loading}>
                    <DeviceData
                    {...{...deviceData,deviceTypeId,pageTitle}}
                    />
                </Spin>
            </div>
        )

    }
}