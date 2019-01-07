import React,{Component,Fragment} from 'react';
import DemoPage from '../../../components/Command/displayData/demoPage';
import { Spin } from 'antd';
import { connect } from 'dva';
@connect(({ displayData, loading }) => ({
    displayData,
    loading: loading.models.displayData,
}))
export default class extends Component{
    componentDidMount(){
        const { dispatch } = this.props;
        dispatch({
            type:'displayData/fetchDeviceCount',
            payload:{
                countDevice:true
            }
        })
        let time = new Date();
        dispatch({
            type:'displayData/fetchOperateCount',
            payload:{
                time
            }
        })
    }
    render(){
        let { displayData, loading } = this.props;
        let arr = Object.keys(displayData);
        if (arr.length <= 1) return false;
        // console.log(displayData)
        return (
            <Fragment>
                <Spin size='large' spinning={loading}>
                    <DemoPage
                        {...displayData}
                    >
                    </DemoPage>
                </Spin>
            </Fragment>
        )
    }
}