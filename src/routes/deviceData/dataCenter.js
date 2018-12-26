import React, { Component } from 'react';
import Analysis from '../../components/DeviceData/dataAnalysis'
// import { connect } from 'dva';
// import {timeOut} from '../../utils/timeOut'
import {Spin} from 'antd'
// @connect(({ showinfo, loading }) => ({
//     showinfo,
//     loading: loading.models.showinfo,
// }))
export default class extends Component {
    // componentDidMount() {
    //     const { dispatch } = this.props;
    //     dispatch({
    //         type: 'showinfo/fetch',
    //         payload:{t:new Date().getTime()}
    //     });
    // }
    render() {
        // let {showinfo,loading} = this.props;
        // timeOut(showinfo.ret)
        // 数据为空时屏蔽掉
        // let arr= Object.keys(showinfo);
        // if (arr.length=== 0 ) return showinfo=null
        
        return (
            // 给父级提供高度100% 子才能有100%高度
            <div style={{height:'100%',background:'#08173E'}}>
             <Spin size='large' 
            //  spinning={loading} 
             >
                <Analysis 
                // {...showinfo}
                />
                </Spin>
            </div>
        )
    }
}