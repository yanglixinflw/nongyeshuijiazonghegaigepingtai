import React,{ Component } from 'react';
import WarningRecords from '../../components/equipmentManagement/warningRecords'
import { connect } from 'dva';
import {Spin} from 'antd'
@connect(({ warningRecords, loading }) => ({
    warningRecords,
    loading: loading.models.warningRecords
}))
export default class extends Component{
    componentDidMount() {
        const { dispatch } = this.props;
        //请求数据
        dispatch({
            type: 'warningRecords/fetch',
            payload:{
                "pageIndex": 0,
                "pageSize": 10
              }
        });
        dispatch({
            type: 'warningRecords/fetchInstallAddr',
            payload:{}
        });
    }
    render(){
        let { warningRecords,loading } = this.props;
        // console.log(warningRecords)
        let arr = Object.keys(warningRecords);
        if (arr.length <=1) return warningRecords = null;
        return(
            <React.Fragment>
                <Spin size='large' spinning={loading}>
                    <WarningRecords
                        {...this.props}
                    /> 
                </Spin>  
            </React.Fragment>
        )
    }
}
