import React from "react";
import FarmersInfo from '../../components/infoManagement/farmersInfo';
import { connect } from 'dva';
// import { Table } from 'antd'
@connect(({ farmersInfo, loading }) => ({
    farmersInfo,
    loading: loading.models.farmersInfo
}))
export default class extends React.Component{
    // constructor(props){
    //     super(props)
    //     const { dispatch } = props
    //       dispatch({
    //         type:'farmersInfo/fetch'
    //     });
    // }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'farmersInfo/fetch',
            payload:{
                "name": "",
                "mobile": "",
                "roleId": 0,
                "pageIndex": 0,
                "pageSize":10
              }
        });//type来选择请求的接口，payload为传给后台的参数
    }
    render(){
        let { farmersInfo, loading } = this.props;
        // console.log(farmersInfo)
        let arr = Object.keys(farmersInfo);
        // console.log(Object)
        if (arr.length === 0) return farmersInfo = null;
        return (
            <div>
                <FarmersInfo
                    {...this.props}
                />
            </div>
        )
    }
}