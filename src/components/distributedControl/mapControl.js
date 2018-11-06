import React, { Component } from 'react';
import { Map } from 'react-amap';
import styles from './mapControl.less';
const MY_AMAP_KEY = 'cba14bed102c3aa9a34455dfe21c8a6e';
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
            // //信息窗位置偏移量
            // infoOffset: [0, -21],
            // //信息窗可见性
            // infoVisible: false,
            // //信息窗位置，根据点击marker时 赋值
            // infoPosition: '',
            // size: {
            //     width: 284,
            //     height: 169
            // },
            // isCustom: false,

        }
    }
    render() {
        const {
            plugins, center,
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

                </Map>
            </div>

        )
    }
}