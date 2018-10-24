import React from "react";
import UserManagement from '../../components/systemManagement/userManagement';
import { connect } from 'dva';
import {Spin} from 'antd'
// @connect(({ userManagement, loading }) => ({
//     userManagement,
//     loading: loading.models.userManagement
// }))
export default class extends React.Component{
    // componentDidMount() {
    //     const { dispatch } = this.props;
    //     dispatch({
    //         type: 'userManagement/fetch',
    //         payload:{
    //             "name": "",
    //             "mobile": "",
    //             "roleId": 0,
    //             "pageIndex": 0,
    //             "pageSize": 10
    //           }
    //     });//type来选择请求的接口，payload为传给后台的参数
    // }
    render(){
        // let { userManagement, loading } = this.props;
        // // console.log(userManagement)
        // let arr = Object.keys(userManagement);
        // if (arr.length ===0 ) return userManagement = null;
        return (
            <div>
                {/* <Spin size='large' spinning={loading}> */}
                    <UserManagement
                        // {...this.props}
                    />
                {/* </Spin> */}
            </div>
        )
    }
}