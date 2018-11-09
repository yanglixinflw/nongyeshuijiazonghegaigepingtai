import React, { Component } from 'react';
import styles from './index.less';
import { Input, Button, List, Icon } from 'antd';
import { Map, Markers, InfoWindow } from 'react-amap';
import Geolocation from 'react-amap-plugin-geolocation'
import IwContent from './infoWindow';
import MarkerContent from './marker';
import MyCustomize from './myCustomize';
const MY_AMAP_KEY = 'cba14bed102c3aa9a34455dfe21c8a6e';
const homePosition = [
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
const dataList = [
    {
        name: '宁圩村三组四号水表 ',
        id: '0010200008',
        address: '萧山区-宁围街道=三村二组耕地',
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
            // 地图类型切换
            // {
            //     name: 'MapType',
            //     options: {
            //         visible: false,  // 不设置该属性默认就是 true
            //         defaultType: 1,    //底图默认 0位平面2D，1为卫星
            //         onCreated(ins) {
            //             // console.log(ins);
            //         },
            //     },
            // },
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
            infoVisible: false,
            //信息窗位置，根据点击marker时 赋值
            infoPosition: '',
            //信息窗大小
            size: {
                width: 286,
                height: 168
            },
            //信息窗组件是否可用子组件
            isCustom: false,
            // 地图中心点
            center: { longitude: 116.33719, latitude: 39.942384 },
            //控件插件
            plugins,
            //多个Marker经纬度
            cameraMarkers: homePosition,
            //所有摄像头markers实例
            allCameraMarkers: '',
            //marker是否被点击
            clicked: false,
            //搜索下拉列表数据
            // dataList:null,
            dataList,
            loading: false,
            hasMore: true,
            //搜索关键字
            keyWord: '三组四号',

        }
        //console.log(this.state.markers)
        //地图触发事件
        this.mapEvents = {
            created: (ins) => {
                console.log(ins)
            },
            click: () => {
                this.setState({
                    infoVisible: false
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
                    infoPosition: marker.F.extData.position,
                    infoVisible: true,
                    clicked: true
                })
                //   console.log('MapsOptions:');
                //   console.log(MapsOption);
                //   console.log('marker:');
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
    }
    componentDidMount() {
        this._getDataList(this.state.dataList, this.state.keyWord)
    }
    //搜索结果处理
    _getDataList(dataList, keyWord) {
        let re = new RegExp(keyWord, 'g')
        dataList.filter((v, i) => {
            v.name = v.name.replace(re, `<span class=${styles.keyWordSt}>${keyWord}</span>`)
        })
    }
    //摄像头markers的render方法
    renderMarkerLayout(extData) {
        //判断marker的position是否和map的中心点一致，一致的话即为被选中的marker
        if (
            extData.position.latitude == this.state.center.latitude
            &&
            extData.position.longitude == this.state.center.longitude
        ) {
            return <MarkerContent markers={extData} chosenMarker={true} />
        } else {
            return <MarkerContent markers={extData} chosenMarker={false} />
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
            cameraMarkers,
            infoVisible,
            infoOffset, isCustom, size, infoPosition,
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
                    <Button onClick={() => this._WatervalveHandler()}>水阀</Button>
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
                    markers={cameraMarkers}
                    render={(extData) => this.renderMarkerLayout(extData)}
                    events={this.cameraEvents}
                />
                {/* 自定义地图控件 */}
                <MyCustomize />

            </Map>
        )
    }
}
