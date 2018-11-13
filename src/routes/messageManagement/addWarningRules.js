import React,{ Component } from 'react';
import AddWarningRules from '../../components/infoManagement/addWarningRules'
// import { connect } from 'dva';
// import {Spin} from 'antd'
// @connect(({ addWarningRules, loading }) => ({
//     addWarningRules,
//     loading: loading.models.addWarningRules
// }))
export default class extends Component{
    componentDidMount() {
    //     const { dispatch } = this.props;
    //     dispatch({
    //         type: 'addWarningRules/fetch',
    //         payload:{
    //             "pageIndex": 0,
    //             "pageSize": 10
    //           }
    //     });//type来选择请求的接口，payload为传给后台的参数
    }
    render(){
        // let { addWarningRules,loading } = this.props;
        // let arr = Object.keys(addWarningRules);
        // if (arr.length ==0) return addWarningRules = null;
        return(
            <React.Fragment>
                {/* <Spin size='large' spinning={loading}> */}
                    <AddWarningRules
                        // {...this.props}
                    /> 
                {/* </Spin>   */}
            </React.Fragment>
        )
    }
}
