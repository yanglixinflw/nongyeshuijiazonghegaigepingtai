import React, { Component } from 'react';
import MapWarning from '../../components/equipmentManagement/mapWarning';
import { parse } from 'qs';
import { timeOut } from '../../utils/timeOut';
import {ENVNet,postOption} from '../../services/netCofig'
const dataUrl = `${ENVNet}/api/DeviceWaringRule/eventList`;
export default class extends Component {
    constructor(props){
        super(props)
        this.state ={
            longitude:'',
            latitude:''
        }
    }
    componentDidMount() {
        let deviceId = parse(window.location.href.split(':'))[3];
        // console.log(deviceId)
        return fetch(dataUrl, {
            ...postOption,
            body: JSON.stringify({
                deviceId,
                pageSize: '10'
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    // 判断是否超时
                    timeOut(v.ret)
                    if(v.ret == 1){
                        // console.log(v)
                        let longitude = v.data.items[0].longitude;
                        let latitude = v.data.items[0].latitude;
                        this.setState({
                            longitude,
                            latitude
                        })
                    }
                })
        })
    }
    render() {
        const {longitude,latitude} = this.state;
        if(!longitude || !latitude) {
            return null
        }
        // console.log(longitude,latitude)
        return (
            <div>
                <MapWarning {...{longitude,latitude}}/>
            </div>
        )

    }
}