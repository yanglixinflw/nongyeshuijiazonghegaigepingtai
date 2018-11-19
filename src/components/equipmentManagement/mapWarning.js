import React, { Component } from 'react';
import { Map, Marker } from 'react-amap';
import styles from './mapWarning.less';
import MyCustomize from './myCustomize';
const MY_AMAP_KEY = 'cba14bed102c3aa9a34455dfe21c8a6e';
export default class extends Component{
    constructor(props){
        super(props)
        // console.log(props)
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
        this.state={
            plugins,
            center:props    
        }
    }
    renderMarker(){
        return (
            <div>123</div>
        )
    }
    render(){
        const {plugins,center} = this.state
        return (
            <div className={styles.mapWarning}>
                <Map
                    amapkey={MY_AMAP_KEY}
                    //地图控件 插件
                    plugins={plugins}
                    // 地图中心点设置
                    center={center}
                    //地图显示的缩放级别
                    zoom={18}
                >
                    {/* marker */}
                    <Marker 
                        position={center} 
                        render={()=>this.renderMarker()}
                    />
                    {/* 自定义地图控件 */}
                    <MyCustomize />
                </Map>
            </div>
        )
    }
}