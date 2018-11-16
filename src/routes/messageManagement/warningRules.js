import React,{ Component } from 'react';
import WarningRules from '../../components/infoManagement/warningRules'
import { connect } from 'dva';
import {Spin} from 'antd'
@connect(({ warningRules, loading }) => ({
    warningRules,
    loading: loading.models.warningRules
}))
export default class extends Component{
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'warningRules/fetch',
            payload:{
                "pageIndex": 0,
                "pageSize": 10
              }
        });
        // 获取设备列表
        dispatch({
            type:'warningRules/fetchDeviceTypeList'
        })
    }
    render(){
        let { warningRules,loading ,dispatch} = this.props;
        let arr = Object.keys(warningRules);
        if (arr.length <2) return warningRules = null;
        // console.log(this.props)
        return(
            <React.Fragment>
                <Spin size='large' spinning={loading}>
                    <WarningRules
                        {...{warningRules,dispatch}}
                    /> 
                </Spin>  
            </React.Fragment>
        )
    }
}
