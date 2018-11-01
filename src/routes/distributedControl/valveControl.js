import React from "react";
import ValveControl from '../../components/distributedControl/valveControl';
// import { connect } from 'dva';
// import { Spin } from 'antd'
// @connect(({ valveControl, loading }) => ({
//     valveControl,
//     loading: loading.models.valveControl
// }))
export default class extends React.Component{
    componentDidMount() {
        // const { dispatch } = this.props;
        // dispatch({
        //     type: 'valveControl/fetch',
        //     payload:{
   
        //       }
        // });//type来选择请求的接口，payload为传给后台的参数
    }
    render(){
        // let { valveControl, loading } = this.props;
        // let arr = Object.keys(valveControl);
        // if (arr.length === 0) return valveControl = null;
        return (
            <React.Fragment>
                {/* <Spin size='large' spinning={loading}> */}
                    <ValveControl
                        // {...this.props}
                    /> 
                {/* </Spin> */}
            </React.Fragment>
        )
    }
}