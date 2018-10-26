import React,{Component} from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { parse } from 'qs';
import History from '../../components/DeviceData/deviceDataHistory'
@connect(({ deviceDataHistory, loading }) => ({
    deviceDataHistory,
    loading: loading.models.deviceDataHistory,
}))
export default class extends Component{
    constructor(props){
        super(props)
        let deviceTypeId=parse(parse(window.location.href.split(':'))[3].split('/'))[0]
        let historyId=parse(window.location.href.split(':'))[4]
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceDataHistory/fetchTitle',
            payload: {
                deviceTypeId,
            }
        });
        dispatch({
            type: 'deviceDataHistory/fetch',
            payload:{
                deviceId:historyId,
                deviceTypeId,
                pageIndex: 0,
                pageSize: 10
            }
        });
    }
    render(){
        let { deviceDataHistory, loading } = this.props;
        let arr = Object.keys(deviceDataHistory);
        if (arr.length <= 1) return deviceDataHistory = null;
        // console.log(deviceDataHistory)
        return(
            <div>
                <Spin size='large' spinning={loading}>
                    <History
                    {...deviceDataHistory}
                    />
                </Spin>
            </div>
        )
    }
}
