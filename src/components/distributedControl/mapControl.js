import React, { Component } from 'react';
import { Map, Markers } from 'react-amap';
import styles from './mapControl.less';
import MyCustomize from './myCustomize';
import {Modal, Radio} from 'antd';
const MY_AMAP_KEY = 'cba14bed102c3aa9a34455dfe21c8a6e';
const valvePosition = [
    { position: { longitude: 120.27, latitude: 30.27 }, isWarningMsg: true },
    { position: { longitude: 120.26, latitude: 30.27 } },
    { position: { longitude: 120.27, latitude: 30.26 } },
    { position: { longitude: 120.26, latitude: 30.28 } },
    { position: { longitude: 120.27, latitude: 30.28 } },
    { position: { longitude: 120.28, latitude: 30.27 } },
    { position: { longitude: 120.27, latitude: 30.29 } },
    { position: { longitude: 120.29, latitude: 30.27 } },
    { position: { longitude: 120.26, latitude: 30.29 } },
    { position: { longitude: 120.27, latitude: 30.17 } },
]
export default class extends Component {
    constructor(props) {
        super(props)
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
            //阀门position
            valvePosition,
            //marker是否被点击
            clicked: false,
            //球阀开关弹窗可见性
            modalVisible:false,
            //该球阀开或关
            value:1,

        }
        //阀门标记触发事件
        this.valveEvents = {
            click:(MapsOption,marker)=>{
                //点击某个marker时请求接口获得该球阀的开关信息设置value
                this.setState({
                    modalVisible:true
                })
            }
        }
    }
    //阀门标记渲染方法
    renderMarkerLayout(extData) {

    }
    _onChange(e){
        this.setState({
            value: e.target.value,
        })
    }
    //取消
    _onCancel(){
        this.setState({
            modalVisible:false
        })
    }
    //确定
    _onOk(){
        //需要获得球阀设置的value值，请求接口，提示设置成功
        this.setState({
            modalVisible:false
        })
    }
    
    render() {
        const {
            plugins, center,
            valvePosition,
            modalVisible,
            //该球阀开或关
            value
        } = this.state;
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
                        markers={valvePosition}
                        //render={(extData) => this.renderMarkerLayout(extData)}
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
                    onCancel={()=>this._onCancel()}
                    onOk={()=>this._onOk()}
                >
                    <Radio.Group 
                        value={value} 
                        onChange={(e)=>this._onChange(e)}
                    >
                        <Radio value={1}>开</Radio>
                        <Radio value={2}>关</Radio>
                    </Radio.Group>
                </Modal>
            </div>

        )
    }
}