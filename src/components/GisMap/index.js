import React, { Component } from 'react';
import styles from './index.less';
import { Input, Button } from 'antd';
import { Map,Marker, InfoWindow,Markers} from 'react-amap';
import IwContent from './infoWindow';
import MarkerContent from './marker';
import MarkerHome from './markerHome';
const MY_AMAP_KEY = 'cba14bed102c3aa9a34455dfe21c8a6e';
const randomPosition = () => ({
    longitude: 100 + Math.random() * 20,
    latitude: 30 + Math.random() * 20
  })
  
const homePosition=[
    {position:{ longitude: 120.27 , latitude: 30.27 }},
    {position:{ longitude: 120.26 , latitude: 30.27 }},
    {position:{ longitude: 120.27 , latitude: 30.26 }},
    {position:{ longitude: 120.26 , latitude: 30.28 }},
    {position:{ longitude: 120.27 , latitude: 30.28 }},
    {position:{ longitude: 120.28 , latitude: 30.27 }},
    {position:{ longitude: 120.27 , latitude: 30.29 }},
    {position:{ longitude: 120.29 , latitude: 30.27 }},
    {position:{ longitude: 120.26 , latitude: 30.29 }},
    {position:{ longitude: 120.29 , latitude: 30.26 }},
]
// console.log(randomPosition())
const randomMarker = (len) => (
    Array(len).fill(true).map((e, idx) => ({
      position: randomPosition()
    }))
  );
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
            // 'ControlBar', // v1.1.0 新增
            // {
            //   name: 'MapType',
            //   options: {
            //     visible: true,  // 不设置该属性默认就是 true
            //     onCreated(ins){
            //       // console.log(ins);
            //     },
            //   },
            // }
        ]
        
        // console.log(map)
        this.state = {
            //标记可见性
            markerVisible:true,
            //信息窗位置
            infoPosition:[
                { longitude: 120.27 , latitude: 30.17 },
                { longitude: 120.26 , latitude: 30.17 }
            ],
            //信息窗位置偏移量
            infoOffset:[0,-31],
            //信息窗可见性
            infoVisible:false,
            infoVisible1:false,
            infoVisible2:false,
            size: {
                width: 230,
                height: 230,
            },
            isCustom:false,
            // 地图中心点
            center:{longitude: 120.27 , latitude: 30.17},
            //控件插件
            plugins,
            //多个Marker
            markers: homePosition,
            //useCluster: true,
            
        }
        //console.log(this.state.markers)
        this.markersEvents = {
            created:(allMarkers) => { 
            //   console.log('All Markers Instance Are Below');
            //   console.log(allMarkers);
            },
            click: (MapsOption, marker) => {
                this.setState({
                    infoVisible:true
                })
            //   console.log('MapsOptions:');
            //   console.log(MapsOption);
            //   console.log('marker:');
            //   console.log(marker);
            },
            dragend: (MapsOption, marker) => { /* ... */ }
        }
        this.windowEvents = {
            created: (infoWindow) => {
                console.log(infoWindow)
            },
            open: () => {
                // console.log('InfoWindow opened')
            },
            close: () => {
                // console.log('InfoWindow closed')
                this.setState({
                    infoVisible:false
                })
            },
            change: () => {
                // console.log('InfoWindow prop changed')
            },
        }
        this.windowEvents1 = {
            created: (infoWindow) => {
                // console.log(infoWindow)
            },
            open: () => {
                // console.log('InfoWindow opened')
            },
            close: () => {
                // console.log('InfoWindow closed')
                this.setState({
                    infoVisible1:false
                })
            },
            change: () => {
                // console.log('InfoWindow prop changed')
            },
        }
        this.windowEvents2 = {
            created: (infoWindow) => {
                // console.log(infoWindow)
            },
            open: () => {
                // console.log('InfoWindow opened')
            },
            close: () => {
                // console.log('InfoWindow closed')
                this.setState({
                    infoVisible2:false
                })
            },
            change: () => {
                // console.log('InfoWindow prop changed')
            },
        }

    }
    //markers的render方法
    renderMarkerLayout(extData){
        // if (extData.myIndex === 3){
        //   return false;
        // }
        // console.log(extData)
        return <MarkerContent type='home'/>
    }
    render() {
        const {
            plugins,center,
            //useCluster,
            markers,
            infoVisible,
            infoPosition,infoVisible1,infoVisible2,infoOffset,isCustom,size,
            
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
                    <Button>管网信息</Button>
                    <Button>管道</Button>
                    <Button>泵站</Button>
                    <Button>蓄水池</Button>
                    <Button>闸阀井</Button>
                </div>
                {/* 信息窗 */}
                <div className={styles.infoWindow}>

                </div>
                {markers.map((v,i)=>{
                    // console.log(v.position)
                    return (<InfoWindow
                        key={i}
                        position={v.position}
                        visible={infoVisible}
                        offset={infoOffset}
                        isCustom={isCustom}
                        size={size}
                        events={this.windowEvents}
                    > 
                        <IwContent />
                    </InfoWindow> 
                    )   
                })}
                <InfoWindow 
                    position={infoPosition[0]} 
                    events={this.windowEvents1}
                    visible={infoVisible1}
                    offset={infoOffset}
                    isCustom={isCustom}
                    size={size}
                >
                    <IwContent />
                </InfoWindow>
                <InfoWindow 
                    position={infoPosition[1]} 
                    events={this.windowEvents2}
                    visible={infoVisible2}
                    offset={infoOffset}
                    isCustom={isCustom}
                    size={size}
                >
                    <IwContent />
                </InfoWindow>
                <Markers 
                    markers={markers}
                    render={this.renderMarkerLayout}
                    // useCluster={useCluster}
                    events={this.markersEvents}
                />
                

            </Map>
        )
    }
}
