import { Component ,Fragment} from 'react';
import VideoMonitor from '../../components/Command/monitor'
import {Spin} from 'antd'
import { connect } from 'dva';
@connect(({ monitor, loading }) => ({
    monitor,
    loading: loading.models.monitor,
}))
export default class extends Component{
    componentDidMount(){
        const { dispatch } = this.props;
        dispatch({
            type: 'monitor/fetch',
        });
    }
    render(){
        let { monitor, loading } = this.props;
        console.log(monitor)
        return(
            <Fragment> 
                <Spin size='large' spinning={loading}>
                <VideoMonitor></VideoMonitor>
                </Spin>
            </Fragment>
        )
    }
}
