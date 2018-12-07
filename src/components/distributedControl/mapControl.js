import React, { Component } from 'react';
import { Map, Markers } from 'react-amap';
import styles from './mapControl.less';
import MarkerExterior from '../GisMap/markerExterior';
import MyCustomize from './myCustomize';
import { timeOut } from '../../utils/timeOut';
import { Modal, Radio, message } from 'antd';
const MY_AMAP_KEY = 'cba14bed102c3aa9a34455dfe21c8a6e';
import {ENVNet,postOption} from '../../services/netCofig'
//获取可执行命令
const getCmdListUrl = `${ENVNet}/api/device/control/cmdList`;
//发送指令
const sendCmdUrl = `${ENVNet}/api/device/control/sendCmd`;
//获取设备的状态
const deviceStatusUrl = `${ENVNet}/api/device/getDeviceStatus`
export default class extends Component {
    constructor(props) {
        super(props)
        console.log(props)
        const plugins = [
            // 比例尺
            'Scale',
            //鹰眼
            'OverView',
            // 地图类型切换
            {
                name: 'MapType',
                options: {
                    visible: true,  // 不设置该属性默认就是 true
                    defaultType: 1,    //底图默认 0位平面2D，1为卫星
                    onCreated(ins) {
                        // console.log(ins);
                    },
                },
            },
        ]
        this.state = {
            // 地图中心点
            center: { longitude: 120.26, latitude: 30.29 },
            //控件插件
            plugins,
            //球阀position
            ballPosition:[],
            //marker是否被点击
            clicked: false,
            //球阀开关弹窗可见性
            modalVisible: false,
            //该球阀开或关状态
            statusValue: '',
            //命令列表
            cmdList: [],
            //设备ID
            deviceId: ''
        }
    }
    componentDidMount() {
        let ballPosition = [];
        //将拿到的数据做处理
        const ballData = this.props.mapGis.waterValve.data.data.items;
        ballData.map((v, i) => {
            let position = {};
            position.longitude = v.longitude;
            position.latitude = v.latitude;
            // console.log(v)
            ballPosition.push({
                position,
                deviceTypeId: v.deviceTypeId,
                deviceId: v.deviceId
            })
        })
        this.setState({
            ballPosition,
        })
        //阀门标记触发事件
        this.valveEvents = {
            click: (MapsOption, marker) => {
                //点击某个marker时请求接口获得该球阀的开关信息设置value
                // console.log(marker)
                // console.log(marker.getExtData())
                let deviceTypeId = marker.getExtData().deviceTypeId
                let deviceId = marker.getExtData().deviceId
                this._getCmdList(deviceTypeId,deviceId)
                this.setState({
                    deviceId
                })
            }
        }
    }
    //点击标记时获取指令  //获取当前设备状态
    _getCmdList(deviceTypeId,deviceId) {
        //获取指令
        fetch(getCmdListUrl, {
            ...postOption,
            body: JSON.stringify({
                deviceTypeId
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    //超时判断
                    timeOut(v.ret)
                    if (v.ret == 1) {
                        let cmdList = v.data
                        console.log(cmdList)
                        this.setState({
                            cmdList,
                            modalVisible: true
                        })
                    }
                })
        })
        //获取当前设备状态
        fetch(deviceStatusUrl,{
            ...postOption,
            body:JSON.stringify({
                deviceId
            })
        }).then((res)=>{
            Promise.resolve(res.json())
            .then((v)=>{
                //超时判断
                timeOut(v.ret)
                if(v.ret == 1){
                    // console.log(v)
                    let statusValue = v.data.status
                    statusValue=statusValue==0?'Valve-Close':'Valve-Open';
                    // console.log(statusValue)
                    this.setState({
                        statusValue
                    })
                }
            })
        })
    }
    //阀门标记渲染方法
    renderMarkerLayout(extData) {
        // console.log(extData)
        return <MarkerExterior markers={extData} chosenMarker={false} />
    }
    _onChange(e) {
        this.setState({
            statusValue: e.target.value,
        })
    }
    //取消
    _onCancel() {
        this.setState({
            modalVisible: false
        })
    }
    //确定
    _onOk() {
        //需要获得球阀设置的value值 命令码，请求接口，提示设置成功
        const { deviceId,statusValue } = this.state;
        // console.log(deviceId,statusValue)
        let deviceIds = []
        deviceIds.push(deviceId)
        return fetch(sendCmdUrl, {
            ...postOption,
            body: JSON.stringify({
                deviceIds,
                strCmd: statusValue
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    //超时判断
                    timeOut(v.ret)
                    if (v.ret == 1) {
                        message.success('指令发送成功', 2);
                        this.setState({
                            modalVisible: false
                        })
                    }
                })
        }).catch((err)=>{
            console.log(err)
        })

    }

    render() {
        const {
            plugins, center,
            ballPosition,
            modalVisible,
            //该球阀开或关
            statusValue,
            cmdList
        } = this.state;
        // console.log(statusValue)
        return (
            <div className={styles.mapControl}>
                <Map
                    amapkey={MY_AMAP_KEY}
                    //地图控件 插件
                    plugins={plugins}
                    // 地图中心点设置
                    center={center}
                    //地图显示的缩放级别
                    zoom={16}
                >
                    {/* marker */}
                    <Markers
                        markers={ballPosition}
                        render={(extData) => this.renderMarkerLayout(extData)}
                        events={this.valveEvents}
                    />
                    {/* 自定义地图控件 */}
                    <MyCustomize />
                </Map>
                <Modal
                    className={styles.controlModal}
                    centered={true}
                    visible={modalVisible}
                    title='球阀开关'
                    onCancel={() => this._onCancel()}
                    onOk={() => this._onOk()}
                >
                    <Radio.Group
                        value={statusValue}
                        onChange={(e) => this._onChange(e)}
                    >
                        {cmdList?
                            cmdList.map((v,i)=>{
                                return (
                                    <Radio key={i} value={v.cmd}>{v.displayName}</Radio>   
                                )
                            })
                             
                        :null}
                        {/* <Radio value={1}>开</Radio>
                        <Radio value={2}>关</Radio> */}
                    </Radio.Group>
                </Modal>
            </div>

        )
    }
}