import React from "react";
import AutoRules from '../../components/distributedControl/autoRules';
import { connect } from 'dva';
import { Spin } from 'antd';
import { parse } from 'qs';
import BreadcrumbView from '../../components/PageHeader/breadcrumb';
@connect(({ autoRules, loading }) => ({
    autoRules,
    loading: loading.models.autoRules
}))
export default class extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            ruleId: ''
        }
    }
    componentDidMount() {
        let ruleId = parse(window.location.href.split(':'))[3];
        const { dispatch } = this.props;
        dispatch({
            type:'autoRules/clear'
        })
        dispatch({
            type: 'autoRules/fetch',
            payload:{
                ruleId
              }
        });//type来选择请求的接口，payload为传给后台的参数
        this.setState({
            ruleId
        })
    }
    render(){
        let { autoRules, loading } = this.props;
        let { ruleId } = this.state;
        // console.log(autoRules)
        let arr = Object.keys(autoRules);
        if (arr.length === 0) return autoRules = null;
        return (
            <React.Fragment>
                <Spin size='large' spinning={loading}>
                    <BreadcrumbView
                        {...this.props}
                    />
                    <AutoRules
                        {...{autoRules,ruleId }}
                    /> 
                </Spin>
            </React.Fragment>
        )
    }
}