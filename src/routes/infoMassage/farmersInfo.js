import React,{component} from "react";
import Wells from '../../components/infoMassage/farmersInfo';
import { connect } from 'dva';
import { Table } from 'antd'
// @connect(({ famersInfo, loading }) => ({
//     wells,
//     loading: loading.models.famersInfos,
// }))
export default class extends component{
    componentDidMount(){
        const {dispatch}=this.props
        console.log(this.props)
    };//组件生命周期
    
}