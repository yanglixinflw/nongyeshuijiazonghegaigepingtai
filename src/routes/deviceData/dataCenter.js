import React, { Component } from 'react';
import Analysis from '../../components/DeviceData/dataAnalysis'
import { connect } from 'dva';
import {timeOut} from '../../utils/timeOut'
import {Spin} from 'antd'
@connect(({ dataAnalysis, loading }) => ({
    dataAnalysis,
    loading: loading.models.dataAnalysis,
}))
export default class extends Component {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'dataAnalysis/fetch',
            payload:{t:new Date().getTime()}
        });
    }
    render() {
        let {dataAnalysis,loading} = this.props;
        timeOut(dataAnalysis.ret)
        // 数据为空时屏蔽掉
        let arr= Object.keys(dataAnalysis);
        if (arr.length=== 0 ) return dataAnalysis=null
        // console.log(dataAnalysis)
        return (
            // 给父级提供高度100% 子才能有100%高度
            <div style={{height:'100%',background:'#08173E'}}>
             <Spin size='large' 
                spinning={loading} 
             >
                <Analysis 
                    {...dataAnalysis}
                />
                </Spin>
            </div>
        )
    }
}