import React from "react";
import GroupAccount from '../../components/waterRate/groupAccount';
import { connect } from 'dva';
import { Spin } from 'antd'
@connect(({ groupAccount, loading }) => ({
    groupAccount,
    loading: loading.models.groupAccount
}))
export default class extends React.Component{
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type:'groupAccount/clear'
        })
        dispatch({
            type: 'groupAccount/fetch',
            payload:{

              }
        });//type来选择请求的接口，payload为传给后台的参数
    }
    render(){
        let { groupAccount, loading } = this.props;
        let arr = Object.keys(groupAccount);
        if (arr.length === 0) return groupAccount = null;
        return (
            <React.Fragment>
                <Spin size='large' spinning={loading}>
                    <GroupAccount
                        {...this.props}
                    /> 
                </Spin>
            </React.Fragment>
        )
    }
}