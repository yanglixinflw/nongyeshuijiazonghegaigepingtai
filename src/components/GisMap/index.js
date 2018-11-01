import React, { Component } from 'react';
import styles from './index.less';
import { Input, Button } from 'antd';
import { Map, Markers, InfoWindow } from 'react-amap';
import IwContent from './infoWindow';
import MarkerContent from './marker';
const MY_AMAP_KEY = 'cba14bed102c3aa9a34455dfe21c8a6e';
const homePosition = [
    { position: { longitude: 120.27, latitude: 30.27 } },
    { position: { longitude: 120.26, latitude: 30.27 } },
    { position: { longitude: 120.27, latitude: 30.26 } },
    { position: { longitude: 120.26, latitude: 30.28 } },
    { position: { longitude: 120.27, latitude: 30.28 } },
    { position: { longitude: 120.28, latitude: 30.27 } },
    { position: { longitude: 120.27, latitude: 30.29 } },
    { position: { longitude: 120.29, latitude: 30.27 } },
    { position: { longitude: 120.26, latitude: 30.29 } },
    { position: { longitude: 120.29, latitude: 30.26 } },
]
export default class extends Component {
    constructor(props) {
        super(props)
        const plugins = [
            // 地图类型切换
            'MapType',
            // 比例尺
            'Scale',
            //鹰眼
            'OverView',
            //缩放控件
            'ToolBar',
        ]

        // console.log(map)
        this.state = {
            //标记可见性
            markerVisible: true,
            //信息窗位置偏移量
            infoOffset: [0, -31],
            //信息窗可见性
            infoVisible: false,
            //信息窗位置，根据点击marker时 赋值
            infoPosition:'',
            size: {
                width: 230,
                height: 230,
            },
            isCustom: false,
            // 地图中心点
            center: { longitude: 120.27, latitude: 30.17 },
            //控件插件
            plugins,
            //多个Marker
            markers: homePosition,
        }
        //console.log(this.state.markers)
        //标记点触发事件
        this.markersEvents = {
            created: (allMarkers) => {
                //   console.log('All Markers Instance Are Below');
                // console.log(allMarkers);
            },
            click: (MapsOption, marker) => {
                // console.log(marker)
                this.setState({
                    infoPosition:marker.F.extData.position,
                    infoVisible: true
                })
                //   console.log('MapsOptions:');
                //   console.log(MapsOption);
                //   console.log('marker:');
                //   console.log(marker);
            },
            dragend: (MapsOption, marker) => { /* ... */ }
        }
        //信息窗触发事件
        this.windowEvents = {
            created: (infoWindow) => {
                // console.log(infoWindow)
            },
            open: () => {
                // console.log('InfoWindow opened')
            },
            close: () => {
                // console.log('InfoWindow closed')
                this.setState({
                    infoVisible: false
                })
            },
            change: () => {
                // console.log('InfoWindow prop changed')
            },
        }
    }
    //markers的render方法
    renderMarkerLayout(extData) {
        // if (extData.myIndex === 3){
        //   return false;
        // }
        // console.log(extData)
        return <MarkerContent type='home' />
    }
    _homeHandler(){
        
        this.setState({
            markerVisible:!this.state.markerVisible
        })
        //console.log(this.state.markerVisible)
    }
    render() {
        const {
            plugins, center,
            //useCluster,
            markers,markerVisible,
            infoVisible,
            infoOffset, isCustom, size,infoPosition
        } = this.state;
        return (
            <Map
                amapkey={MY_AMAP_KEY}
                //地图控件 插件
                plugins={plugins}
                // 地图中心点设置
                center={center}
                //地图显示的缩放级别
                zoom={4}
            >
                <div className={styles.search}>
                    管网编号
                    <Input
                        placeholder='请查询设备编号或设备名称'
                    />
                </div>
                <div className={styles.btnGroup}>
                    <Button onClick={()=>this._homeHandler()}>管网信息</Button>
                    <Button>管道</Button>
                    <Button>泵站</Button>
                    <Button>蓄水池</Button>
                    <Button>闸阀井</Button>
                </div>
                {/* 信息窗 */}
                <InfoWindow
                    position={infoPosition}
                    visible={infoVisible}
                    offset={infoOffset}
                    isCustom={isCustom}
                    size={size}
                    events={this.windowEvents}
                >
                    <IwContent />
                </InfoWindow>
                {/* marker */}
                <Markers
                    markers={markers}
                    render={this.renderMarkerLayout}
                    events={this.markersEvents}
                    visible={markerVisible}
                />


            </Map>
        )
    }
}
