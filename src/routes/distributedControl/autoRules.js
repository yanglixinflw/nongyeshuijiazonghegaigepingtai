import React from "react";
import AutoRules from '../../components/distributedControl/autoRules';
import { connect } from 'dva';
import { Spin } from 'antd';
import { parse } from 'qs';
@connect(({ autoRules, loading }) => ({
    autoRules,
    loading: loading.models.autoRules
}))
export default class extends React.Component{
    componentDidMount() {
        let ruleId = parse(window.location.href.split(':'))[3];
        const { dispatch } = this.props;
        dispatch({
            type: 'autoRules/fetch',
            payload:{
                ruleId
              }
        });//type来选择请求的接口，payload为传给后台的参数
    }
    render(){
        let { autoRules, loading } = this.props;
        // console.log(autoRules)
        let arr = Object.keys(autoRules);
        if (arr.length === 0) return autoRules = null;
        return (
            <React.Fragment>
                <Spin size='large' spinning={loading}>
                    <AutoRules
                        {...this.props}
                    /> 
                </Spin>
            </React.Fragment>
        )
    }
}