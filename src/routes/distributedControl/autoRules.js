import React from "react";
import AutoRules from '../../components/distributedControl/autoRules';
// import { connect } from 'dva';
// import { Spin } from 'antd'
// @connect(({ autoRules, loading }) => ({
//     autoRules,
//     loading: loading.models.autoRules
// }))
export default class extends React.Component{
    componentDidMount() {
        // const { dispatch } = this.props;
        // dispatch({
        //     type: 'autoRules/fetch',
        //     payload:{
   
        //       }
        // });//type来选择请求的接口，payload为传给后台的参数
        // console.log(this.props)
    }
    render(){
        // let { autoRules, loading } = this.props;
        // let arr = Object.keys(autoRules);
        // if (arr.length === 0) return autoRules = null;
        return (
            <React.Fragment>
                {/* <Spin size='large' spinning={loading}> */}
                    <AutoRules
                        // {...this.props}
                    /> 
                {/* </Spin> */}
            </React.Fragment>
        )
    }
}