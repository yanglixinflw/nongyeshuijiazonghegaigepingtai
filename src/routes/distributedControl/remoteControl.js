import React from "react";
import RemoteControl from '../../components/distributedControl/remoteControl';
// import { connect } from 'dva';
// import { Spin } from 'antd'
// @connect(({ remoteControl, loading }) => ({
//     remoteControl,
//     loading: loading.models.remoteControl
// }))
export default class extends React.Component{
    componentDidMount() {
        // const { dispatch } = this.props;
        // dispatch({
        //     type: 'remoteControl/fetch',
        //     payload:{
   
        //       }
        // });//type来选择请求的接口，payload为传给后台的参数
    }
    render(){
        // let { remoteControl, loading } = this.props;
        // let arr = Object.keys(remoteControl);
        // if (arr.length === 0) return remoteControl = null;
        return (
            <React.Fragment>
                {/* <Spin size='large' spinning={loading}> */}
                    <RemoteControl
                        // {...this.props}
                    /> 
                {/* </Spin> */}
            </React.Fragment>
        )
    }
}