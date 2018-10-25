import React from "react";
import WarningRule from '../../components/infoManagement/warningRule';
import { connect } from 'dva';
import { Spin } from 'antd'
@connect(({ warningRule, loading }) => ({
    warningRule,
    loading: loading.models.warningRule
}))
export default class extends React.Component{
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'warningRule/fetch',
            payload:{
                "pageIndex": 0,
                "pageSize": 10
              }
        });//type来选择请求的接口，payload为传给后台的参数
    }
    render(){
        // let { warningRule, loading } = this.props;
        // console.log(warningRule)
        // let arr = Object.keys(warningRule);
        // if (arr.length >=0) return warningRule = null;
        return (
            <div>
                {/* <Spin size='large' spinning={loading}> */}
                    <WarningRule
                        // {...this.props}
                    />
                {/* </Spin> */}
            </div>
        )
    }
}