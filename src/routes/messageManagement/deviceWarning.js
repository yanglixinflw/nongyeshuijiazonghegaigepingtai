import React,{ Component } from 'react';
import DeviceWarning from 'components/infoManagement/deviceWarning'
import {Spin} from 'antd'
export default class extends Component{
    render(){
        return(
            <div>
                <DeviceWarning></DeviceWarning>
            </div>
        )
    }
}
