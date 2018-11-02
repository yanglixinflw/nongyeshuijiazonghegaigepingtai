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
        });//type来选择请求的接口，payload为传给后台的参数
    }
    render(){
        let { warningRules,loading } = this.props;
        let arr = Object.keys(warningRules);
        if (arr.length ==0) return warningRules = null;
        return(
            <React.Fragment>
                <Spin size='large' spinning={loading}>
                    <WarningRules
                        {...this.props}
                    /> 
                </Spin>  
            </React.Fragment>
        )
    }
}
