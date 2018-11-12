import React, { Component } from 'react';
import styles from './index.less';
import { Input, Button, List, Icon } from 'antd';
import { Map, Markers, InfoWindow } from 'react-amap';
import Geolocation from 'react-amap-plugin-geolocation'
import IwContentCamera from './infoWindowCamera';
import IwContentWaterV from './infoWindowWaterV';
import Camera from './markerCamera';
import WaterValve from './markerWaterV';
import MyCustomize from './myCustomize';
const MY_AMAP_KEY = 'cba14bed102c3aa9a34455dfe21c8a6e';
const cameraPosition = [
    { position: { longitude: 120.27, latitude: 30.27 }, isWarningMsg: true },
    { position: { longitude: 130.26, latitude: 35.27 } },
    { position: { longitude: 123.27, latitude: 34.26 } },
    { position: { longitude: 128.26, latitude: 41.28 } },
    { position: { longitude: 124.27, latitude: 39.28 } },
    { position: { longitude: 122.28, latitude: 35.27 } },
    { position: { longitude: 124.27, latitude: 37.29 } },
    { position: { longitude: 130.29, latitude: 36.27 } },
    { position: { longitude: 132.26, latitude: 33.29 } },
    { position: { longitude: 127.27, latitude: 32.17 } },
]
const waterValvePosition = [
    { position: { longitude: 126.27, latitude: 35.27 }, isWarningMsg: true },
    { position: { longitude: 125.26, latitude: 34.27 } },
    { position: { longitude: 123.27, latitude: 33.26 } },
    { position: { longitude: 124.26, latitude: 32.28 } },
    { position: { longitude: 128.27, latitude: 35.28 } },
    { position: { longitude: 130.28, latitude: 36.27 } },
    { position: { longitude: 129.27, latitude: 32.29 } },
    { position: { longitude: 132.29, latitude: 33.27 } },
    { position: { longitude: 121.26, latitude: 38.29 } },
    { position: { longitude: 132.27, latitude: 37.17 } },
]
const dataList = [
    {
        name: '水表 ',
        id: '0010200008',
        address: '三村二组耕地',
        icon: 'wifi'
    },
    {
        name: '宁圩村三组四号水表 ',
        id: '0010200008',
        address: '萧山区-宁围街道=三村二组耕地'
    },
    {
        name: '宁圩村三组四号水表 ',
        id: '0010200008',
        address: '萧山区-宁围街道=三村二组耕地'
    },
    {
        name: '宁圩村三组四号水表 ',
        id: '0010200008',
        address: '萧山区-宁围街道=三村二组耕地'
    },
    {
        name: '宁圩村三组四号水表 ',
        id: '0010200008',
        address: '萧山区-宁围街道=三村二组耕地'
    },
    {
        name: '宁圩村三组四号水表 ',
        id: '0010200008',
        address: '萧山区-宁围街道=三村二组耕地'
    }
]
export default class extends Component {
    constructor(props) {
        super(props)
        const plugins = [
            // 比例尺
            'Scale',
            //鹰眼
            'OverView',
        ]
        const pluginProps = {
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            showButton: false,        //显示定位按钮，默认：true
            showMarker: false,        //定位成功后在定位到的位置显示点标记，默认：true
            // showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: false,     //定位成功后将定位到的位置作为地图中心点，默认：true
            // zoomToAccuracy:true,//定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：f
            extensions: 'all'
        }
        // console.log(map)
        this.state = {
            pluginProps,
            //标记可见性
            markerVisible: true,
            //信息窗位置偏移量
            infoOffset: [0, -21],
            //信息窗可见性
            infoVisibleCamera: false,
            infoVisibleWaterValve: false,
            //摄像头信息窗位置，根据点击marker时 赋值
            infoPositionCamera: '',
            infoPositionWaterValve: '',
            //信息窗大小
            size: {
                width: 285,
                height: 169
            },
            //信息窗组件是否可用子组件,false即在系统默认的信息窗体外框中显示content内容
            isCustom: false,
            // 地图中心点
            center: { longitude: 116.33719, latitude: 39.942384 },
            //控件插件
            plugins,
            //多个Marker经纬度
            cameraMarkers: cameraPosition,
            waterValveMarkers:waterValvePosition,
            //所有摄像头markers实例
            allCameraMarkers: '',
            //所有水阀markers实例
            allWaterValveMarkers:'',
            //marker是否被点击
            isClicked: false,
            //搜索下拉列表数据
            // dataList:null,
            dataList,
            //搜索关键字
            keyWord: '三组四号',

        }
        //console.log(this.state.markers)
        //地图触发事件
        this.mapEvents = {
            created: (ins) => {
                // console.log(ins)
            },
            click: () => {
                this.setState({
                    infoVisibleCamera: false,
                    infoVisibleWaterValve:false,
                })
            }
        }
        //摄像头标记点触发事件
        this.cameraEvents = {
            created: (allCameraMarkers) => {
                //   console.log('All Markers Instance Are Below');
                // console.log(MapsOption)
                this.setState({
                    allCameraMarkers
                })
            },
            click: (MapsOption, marker) => {
                this.setState({
                    infoVisibleWaterValve: false,
                    infoPositionCamera: marker.F.extData.position,
                    infoVisibleCamera: true,
                    isClicked: true
                })
            },
            dragend: (MapsOption, marker) => { /* ... */ },
            mouseover: (MapsOption, marker) => {
                this.setState({
                    infoVisibleWaterValve: false,
                    infoPositionCamera: marker.F.extData.position,
                    infoVisibleCamera: true
                })
            },
            mouseout: (MapsOption, marker) => {
                if (this.state.isClicked) {
                    this.setState({
                        infoVisibleCamera: true
                    })
                } else {
                    this.setState({
                        infoVisibleCamera: false
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
                    infoVisibleCamera:false,
                    infoVisibleWaterValve: false,
                    isClicked: false
                })
            },
            change: () => {
                // console.log('InfoWindow prop changed')
            },
        }
        //水阀标记点触发事件
        this.WaterValveEvents = {
            created: (allWaterValveMarkers) => {
                //   console.log('All Markers Instance Are Below');
                // console.log(MapsOption)
                this.setState({
                    allWaterValveMarkers
                })
            },
            click: (MapsOption, marker) => {
                this.setState({
                    infoVisibleCamera:false,
                    infoPositionWaterValve: marker.F.extData.position,
                    infoVisibleWaterValve: true,
                    isClicked: true
                })
            },
            dragend: (MapsOption, marker) => { /* ... */ },
            mouseover: (MapsOption, marker) => {
                this.setState({
                    infoVisibleCamera:false,
                    infoPositionWaterValve: marker.F.extData.position,
                    infoVisibleWaterValve: true
                })
            },
            mouseout: (MapsOption, marker) => {
                if (this.state.isClicked) {
                    this.setState({
                        infoVisibleWaterValve: true
                    })
                } else {
                    this.setState({
                        infoVisibleWaterValve: false
                    })
                }

            }
        }
    }
    componentDidMount() {
        if(dataList){
            this._getDataList(this.state.dataList, this.state.keyWord)
        }
        
    }
    //搜索结果处理
    _getDataList(dataList, keyWord) {
        if(dataList){
            let re = new RegExp(keyWord, 'g')
            dataList.filter((v, i) => {
                v.name = v.name.replace(re, `<span class=${styles.keyWordSt}>${keyWord}</span>`)
            })
        }
        
    }
    //摄像头markers的render方法
    renderCamerMarker(extData) {
        //判断marker的position是否和map的中心点一致，一致的话即为被选中的marker
        if (
            extData.position.latitude == this.state.center.latitude
            &&
            extData.position.longitude == this.state.center.longitude
        ) {
            return <Camera markers={extData} chosenMarker={true} />
        } else {
            return <Camera markers={extData} chosenMarker={false} />
        }
    }
    //水阀markers的render方法
    renderWaterValveMarker(extData) {
        //判断marker的position是否和map的中心点一致，一致的话即为被选中的marker
        if (
            extData.position.latitude == this.state.center.latitude
            &&
            extData.position.longitude == this.state.center.longitude
        ) {
            return <WaterValve markers={extData} chosenMarker={true} />
        } else {
            return <WaterValve markers={extData} chosenMarker={false} />
        }
    }
    //图标记显示/隐藏
    _cameraHandler() {
        const { allCameraMarkers } = this.state;
        allCameraMarkers.map((v, i) => {
            if (v.Pg.visible == true) {
                v.hide();
            } else {
                v.show()
            }
        })
        //    console.log(allCameraMarkers)
    }
    _WatermeterHandler(e) {
        console.log('水表', e)
    }
    _ElectricmeterHandler() {
        console.log('电表')
    }
    _WatervalveHandler() {
        console.log('水阀')
    }
    //搜索
    _searchHandler(e) {
        // console.log(e.target.value)
        this.setState({
            keyWord: e.target.value
        })
        //请求接口从后台拿到数据（dataList）后，_getDataList()
        //选择marker后设置map的center为该marker的position
    }
    render() {
        const {
            pluginProps,
            dataList,
            plugins, center,
            //useCluster,
            cameraMarkers,waterValveMarkers,
            infoVisibleCamera,infoVisibleWaterValve,
            infoOffset, isCustom, size, infoPositionCamera,infoPositionWaterValve,
        } = this.state;

        // console.log(dataList)
        return (
            <Map
                amapkey={MY_AMAP_KEY}
                //地图控件 插件
                plugins={plugins}
                // 地图中心点设置
                center={center}
                //地图显示的缩放级别
                zoom={15}
                events={this.mapEvents}
            >
                <Geolocation
                    {...pluginProps}
                />
                <div className={styles.search}>
                    <Input
                        placeholder='请查询设备编号或设备名称'
                        onPressEnter={(e) => this._searchHandler(e)}
                        onChange={(e) => this._searchHandler(e)}
                    />
                    {
                        dataList ?
                            <div className={styles.dataList}>
                                <List
                                    itemLayout="vertical"
                                    dataSource={dataList}
                                    renderItem={(item) => {
                                        return (
                                            <List.Item
                                            >
                                                <p className={styles.itemName}
                                                    dangerouslySetInnerHTML={{ __html: item.name }}>
                                                </p>
                                                <p className={styles.itemName}
                                                    dangerouslySetInnerHTML={{ __html: item.id }}
                                                ></p>
                                                <Icon type={item.icon} />
                                                <p className={styles.itemAdress}
                                                    dangerouslySetInnerHTML={{ __html: item.address }}
                                                ></p>
                                            </List.Item>)
                                    }
                                    }
                                />
                            </div>
                            : null
                    }
                </div>
                <div className={styles.btnGroup}>
                    <Button
                        autoFocus
                        onClick={() => this._cameraHandler()}
                    >
                        <i className={styles.camera}></i>
                        <span>摄像头</span>
                    </Button>
                    <Button onClick={(e) => this._WatermeterHandler(e)}>水表</Button>
                    <Button onClick={() => this._ElectricmeterHandler()}>电表</Button>
                    <Button onClick={() => this._WatervalveHandler()}>
                        <i className={styles.waterValve}></i>
                        <span>水阀</span>
                    </Button>
                </div>
                {/* 摄像头信息窗 高德地图规定同时最多只能显示一个信息窗*/}
                <InfoWindow
                    position={infoPositionCamera}
                    visible={infoVisibleCamera}
                    offset={infoOffset}
                    isCustom={isCustom}
                    size={size}
                    events={this.windowEvents}
                >
                    <IwContentCamera />
                </InfoWindow>
                {/* 摄像头marker */}
                <Markers
                    markers={cameraMarkers}
                    render={(extData) => this.renderCamerMarker(extData)}
                    events={this.cameraEvents}
                />
                {/* 水阀信息窗 高德地图规定同时最多只能显示一个信息窗*/}
                <InfoWindow
                    position={infoPositionWaterValve}
                    visible={infoVisibleWaterValve}
                    offset={infoOffset}
                    isCustom={isCustom}
                    size={size}
                    events={this.windowEvents}
                >
                    <IwContentWaterV isWarningMsg={waterValveMarkers}/>
                </InfoWindow>
                {/* 水阀Marker */}
                <Markers 
                    markers={waterValveMarkers}
                    render={(extData) => this.renderWaterValveMarker(extData)}
                    events={this.WaterValveEvents}
                />
                {/* 自定义地图控件 */}
                <MyCustomize />

            </Map>
        )
    }
}
