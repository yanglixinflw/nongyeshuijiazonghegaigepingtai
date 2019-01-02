import React from "react";
import GroupManage from '../../components/waterRate/groupManage';
import { connect } from 'dva';
import { Spin } from 'antd'
import { parse } from 'qs';
@connect(({ groupManage, loading }) => ({
    groupManage,
    loading: loading.models.groupManage
}))
export default class extends React.Component{
    componentDidMount() {
        let userId = parse(window.location.href.split(':'))[3];
        const { dispatch } = this.props;
        dispatch({
            type:'groupManage/clear'
        })
        dispatch({
            type: 'groupManage/fetchGroup',
            payload:{
                "groupUserId":userId
            }
        })
        dispatch({
            type: 'groupManage/fetchFarmer',
            payload:{
                "pageIndex": 0,
                "pageSize": 10
            }
        });
    }
    render(){
        let { groupManage, loading } = this.props;
        let arr = Object.keys(groupManage);
        if (arr.length <=1) return groupManage= null;
        return (
            <React.Fragment>
                <Spin size='large' spinning={loading}>
                    <GroupManage
                        {...this.props}
                    /> 
                </Spin>
            </React.Fragment>
        )
    }
}