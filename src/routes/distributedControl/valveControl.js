import React from "react";
import ValveControl from '../../components/distributedControl/valveControl';
import { connect } from 'dva';
import { Spin } from 'antd'
import {ENVNet,postOption} from '../../services/netCofig'
@connect(({ valveControl, loading }) => ({
    valveControl,
    loading: loading.models.valveControl
}))
export default class extends React.Component{
    constructor(props) {
        super(props)
        this.state={
            deviceTypeIds:[]
        }
    }
    componentDidMount() {
        const { dispatch } = this.props;
        //返回可操作的设备型号列表
        const getDeviceTypeList=`${ENVNet}/api/device/control/deviceTypeList`
        dispatch({
            type:'valveControl/clear'
        })
        fetch(getDeviceTypeList,{
            ...postOption,
            body:JSON.stringify({
                countDevice:true
            })
        }).then(res=>{
            Promise.resolve(res.json())
            .then(v=>{
                if(v.ret==1){
                    var deviceTypeIds=v.data
                    dispatch({
                        type: 'valveControl/fetch',
                        payload:{
                            "deviceTypeId": deviceTypeIds[0].deviceTypeId,
                            "pageIndex": 0,
                            "pageSize": 10
                        }
                    });
                    this.setState({
                        deviceTypeIds
                    })
                }
            })
        })
        dispatch({
            type: 'valveControl/fetchInstallAddr',
            payload:{}
        });
    }
    render(){
        let { valveControl, loading } = this.props;
        let {deviceTypeIds}=this.state
        if(deviceTypeIds.length==0){
            return deviceTypeIds=null
        }
        let arr = Object.keys(valveControl);
        if (arr.length <=1) return valveControl = null;
        return (
            <React.Fragment>
                <Spin size='large' spinning={loading}>
                    <ValveControl
                        {...{valveControl,deviceTypeIds}}
                    /> 
                </Spin>
            </React.Fragment>
        )
    }
}