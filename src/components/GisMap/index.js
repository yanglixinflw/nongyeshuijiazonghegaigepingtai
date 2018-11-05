import React, { Component } from 'react';
import styles from './index.less';
import { Input, Button } from 'antd';
import { Map, Markers, InfoWindow, Polyline } from 'react-amap';
import IwContent from './infoWindow';
import MarkerContent from './marker';
import MyCustomize from './myCustomize';
import classnames from 'classnames';
const MY_AMAP_KEY = 'cba14bed102c3aa9a34455dfe21c8a6e';
const homePosition = [
    { position: { longitude: 120.27, latitude: 30.27 },isWarningMsg:true },
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
const linePosition = [
    { longitude: 121.27, latitude: 31.27 },
    { longitude: 123.27, latitude: 33.27 },

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
                  visible: false,  // 不设置该属性默认就是 true
                  defaultType:1,    //底图默认 0位平面2D，1为卫星
                  onCreated(ins){
                    // console.log(ins);
                  },
                },
            },
            //缩放控件
            {
                name: 'ToolBar',
                options: {
                  visible: true,  // 不设置该属性默认就是 true
                  onCreated(ins){
                    // console.log(ins);
                  },
                },
            },
            
        ]

        // console.log(map)
        this.state = {
            //标记可见性
            markerVisible: true,
            //信息窗位置偏移量
            infoOffset: [0, -21],
            //信息窗可见性
            infoVisible: false,
            //信息窗位置，根据点击marker时 赋值
            infoPosition: '',
            size: {
                width: 284,
                height: 169
            },
            isCustom: false,
            // 地图中心点
            center: { longitude: 120.27, latitude: 30.17 },
            //控件插件
            plugins,
            //多个Marker
            homeMarkers: homePosition,
            allHomeMarkers: '',
            clicked: false,
            //折线path
            linePath: linePosition,
            lineVisible:true,
        }
        //console.log(this.state.markers)
        //标记点触发事件
        this.markersEvents = {
            created: (allHomeMarkers) => {
                //   console.log('All Markers Instance Are Below');
                // console.log(MapsOption)
                this.setState({
                    allHomeMarkers
                })
            },
            click: (MapsOption, marker) => {
                this.setState({
                    infoPosition: marker.F.extData.position,
                    infoVisible: true,
                    clicked: true
                })
                //   console.log('MapsOptions:');
                //   console.log(MapsOption);
                //   console.log('marker:');
                 
                marker.render=()=>{
                    return(
                        <div className={styles.focused}>
                            <div className={styles.focusedAnimation}></div>
                        </div>
                    )
                    
                }
                console.log(marker.render());
            },
            dragend: (MapsOption, marker) => { /* ... */ },
            mouseover: (MapsOption, marker) => {
                this.setState({
                    infoPosition: marker.F.extData.position,
                    infoVisible: true
                })
            },
            mouseout: (MapsOption, marker) => {
                if (this.state.clicked) {
                    this.setState({
                        infoPosition: marker.F.extData.position,
                        infoVisible: true
                    })
                } else {
                    this.setState({
                        infoPosition: marker.F.extData.position,
                        infoVisible: false
                    })
                }

            }
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
                    infoVisible: false,
                    clicked: false
                })
            },
            change: () => {
                // console.log('InfoWindow prop changed')
            },
        }
        //折线触发事件
        this.lineEvents = {
            created: (ins) => { 
                // console.log(ins) 
            },
            show: () => { 
                // console.log('line show') 
            },
            hide: () => { 
                console.log('line hide') 
            },
            click: () => { 
                console.log('line clicked') 
            },
        }
    }
    //markers的render方法
    renderMarkerLayout(extData) {
        // console.log(extData)
        return <MarkerContent markers={extData}/>
    
    }
    //图标记显示/隐藏
    _cameraHandler() {
        const { allHomeMarkers } = this.state;
        allHomeMarkers.map((v, i) => {
            if (v.Pg.visible == true) {
                v.hide();
            } else {
                v.show()
            }
        })
        //    console.log(allHomeMarkers)
    }
    //折线显示/隐藏
    _lineHandler(){
        this.setState({
            lineVisible:!this.state.lineVisible
        })
    }
    //搜索
    _searchHandler(e){
        // console.log(e.target.value)
        //从后台拿到数据后动态插入
    }
    render() {
        const {
            plugins, center,
            //useCluster,
            homeMarkers,
            infoVisible,
            infoOffset, isCustom, size, infoPosition,
            linePath,lineVisible
        } = this.state;
        return (
            <Map
                amapkey={MY_AMAP_KEY}
                //地图控件 插件
                plugins={plugins}
                // 地图中心点设置
                center={center}
                //地图显示的缩放级别
                zoom={16}
            >
                <div className={styles.search}>
                    <Input
                        placeholder='请查询设备编号或设备名称'
                        onPressEnter={(e)=>this._searchHandler(e)}
                        onChange={(e)=>this._searchHandler(e)}
                    />
                </div>
                <div className={styles.btnGroup}>
                    <Button onClick={() => this._cameraHandler()}>
                        <i className={styles.camera}></i>
                        <span>摄像头</span>
                    </Button>
                    <Button onClick={() => this._lineHandler()}>水表</Button>
                    <Button>电表</Button>
                    <Button>水阀</Button>
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
                    markers={homeMarkers}
                    render={this.renderMarkerLayout}
                    events={this.markersEvents}
                />
                {/* 折线 */}
                <Polyline
                    path={linePath}
                    events={this.lineEvents}
                    visible={lineVisible}
                    // draggable={this.state.draggable}
                />
                <MyCustomize />

            </Map>
        )
    }
}
