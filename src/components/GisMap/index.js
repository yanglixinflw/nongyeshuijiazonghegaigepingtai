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
import { timeOut } from '../../utils/timeOut';
const MY_AMAP_KEY = 'cba14bed102c3aa9a34455dfe21c8a6e';
// 开发环境
const envNet = 'http://192.168.30.127:88';
//生产环境
// const envNet = '';
//搜索
const searchUrl = `${envNet}/api/device/gisDeviceList`;
// post通用设置
let postOption = {
    method: 'POST',
    credentials: "include",
    mode: 'cors',
    headers: new Headers({
        'Content-Type': 'application/json',
    }),
};
export default class extends Component {
    constructor(props) {
        super(props)
        // console.log(props)
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
            waterValveVisible: false,
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
            cameraMarkers: "",
            waterValveMarkers: "",
            //所有摄像头markers实例
            allCameraMarkers: '',
            //所有水阀markers实例
            allWaterValveMarkers: '',
            //marker是否被点击
            isClicked: false,
            //搜索下拉列表数据
            dataList: [],
            //搜索关键字
            keyword: '',
            //当前设备类型ID
            deviceTypeId: 1

        }
        //console.log(this.state.markers)
        //地图触发事件
        this.mapEvents = {
            created: (ins) => {
                // console.log(ins)
            },
            click: () => {
                if (this.state.infoVisibleCamera == true || this.state.infoVisibleWaterValve == true) {
                    this.setState({
                        infoVisibleCamera: false,
                        infoVisibleWaterValve: false,
                    })
                }

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
                    infoPositionCamera: marker.F.extData.position,
                    infoVisibleCamera: true,
                    isClicked: true
                })
            },
            dragend: (MapsOption, marker) => { /* ... */ },
            mouseover: (MapsOption, marker) => {
                // console.log(marker)
                this.setState({
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
                    infoVisibleCamera: false,
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
                    infoPositionWaterValve: marker.F.extData.position,
                    infoVisibleWaterValve: true,
                    isClicked: true
                })
            },
            dragend: (MapsOption, marker) => { /* ... */ },
            mouseover: (MapsOption, marker) => {
                this.setState({
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
        let { dataList,keyword } = this.state
        let cameraPosition = [];
        let waterMeterPosition = [];
        let eleMeterPosition = [];
        let waterValvePosition = [];
        let { mapGis } = this.props;
        let camera = mapGis.camera.data.data.items;
        let waterMeter = mapGis.waterMeter.data.data.items;
        let eleMeter = mapGis.eleMeter.data.data.items;
        let waterValve = mapGis.waterValve.data.data.items;
        camera.map((v, i) => {
            let position = {};
            position.longitude = v.longitude;
            position.latitude = v.latitude;
            cameraPosition.push({
                position,
                deviceTypeId: v.deviceTypeId
            })
        })
        waterMeter.map((v, i) => {
            let position = {};
            position.longitude = v.longitude;
            position.latitude = v.latitude;
            waterMeterPosition.push({
                position,
                deviceTypeId: v.deviceTypeId
            })
        })
        eleMeter.map((v, i) => {
            let position = {};
            position.longitude = v.longitude;
            position.latitude = v.latitude;
            eleMeterPosition.push({
                position,
                deviceTypeId: v.deviceTypeId
            })
        })
        waterValve.map((v, i) => {
            let position = {};
            position.longitude = v.longitude;
            position.latitude = v.latitude;
            waterValvePosition.push({
                position,
                deviceTypeId: v.deviceTypeId
            })
        })
        this.setState({
            cameraMarkers: cameraPosition,
            waterValveMarkers: waterValvePosition,
        })
        if (dataList.length !== 0) {
            this._getDataList(dataList,keyword)
        }

    }
    //搜索结果高亮处理
    _getDataList(dataList, keyword) {
        if (dataList) {
            let re = new RegExp(keyword, 'g')
            dataList.filter((v, i) => {
                v.name = v.name.replace(re, `<span class=${styles.keyWordSt}>${keyword}</span>`)
                v.deviceId = v.deviceId.replace(re, `<span class=${styles.keyWordSt}>${keyword}</span>`)
            })
        }

    }
    //摄像头markers的render方法
    renderCamerMarker(extData) {
        //判断marker的position是否和map的中心点一致，一致的话即为被选中的marker
        // console.log(extData)
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
    //摄像头
    _cameraHandler() {
        const { allCameraMarkers,allWaterValveMarkers } = this.state;
        // console.log(allCameraMarkers)
        allCameraMarkers.map((v, i) => {
            if (v.Pg.visible == true) {
                let deviceTypeId = '';
                v.hide();
                this.setState({
                    deviceTypeId
                })
            } else {
                let deviceTypeId = 1;
                v.show();
                this.setState({
                    deviceTypeId,
                })
            }
        })
        allWaterValveMarkers.map((v,i)=>{
            v.hide();
        })
        // console.log(this.state.deviceTypeId)

    }
    //水表
    _WatermeterHandler(e) {
        console.log('水表', e)
    }
    //电表
    _ElectricmeterHandler() {
        console.log('电表')
    }
    //水阀
    _WatervalveHandler() {
        const { allWaterValveMarkers,allCameraMarkers} = this.state;
        allWaterValveMarkers.map((v, i) => {
            if (v.Pg.visible == true) {
                let deviceTypeId = '';
                v.hide();
                this.setState({
                    deviceTypeId
                })
            } else {
                let deviceTypeId = 4;
                v.show();
                this.setState({
                    deviceTypeId
                })
            }
        })
        allCameraMarkers.map((v,i)=>{
            v.hide()
        })

        
        // console.log(this.state.deviceTypeId)
    }
    //搜索
    _searchHandler(e) {
        // console.log(e.target.value)
        const { deviceTypeId } = this.state;
        let keyword = e.target.value;
        //console.log(keyword)
        if (keyword !== '') {
            return fetch(searchUrl, {
                ...postOption,
                body: JSON.stringify({
                    keyword,
                    deviceTypeId,
                    pageSize: '10'
                })
            }).then((res) => {
                Promise.resolve(res.json())
                    .then((v) => {
                        //判断是否超时
                        timeOut(v.ret)
                        if (v.ret == 1) {
                            let dataList = v.data.items;
                            this.setState({
                                dataList
                            })
                            this._getDataList(dataList, keyword)
                        } else {
                            this.setState({
                                dataList: []
                            })
                        }
                    })
            })
        }else {
            this.setState({
                dataList:[]
            })
        }
    }
    //选择设备后定位
    _chosenHandler(item) {
        // console.log(item)
        let center = { longitude: item.longitude, latitude: item.latitude };
        this.setState({
            center
        })

    }
    render() {
        const {
            pluginProps,
            dataList,
            plugins, center,
            //useCluster,
            waterValveVisible,
            cameraMarkers, waterValveMarkers,
            infoVisibleCamera, infoVisibleWaterValve,
            infoOffset, isCustom, size, infoPositionCamera, infoPositionWaterValve,
        } = this.state;
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
                    // onChange={(e) => this._searchHandler(e)}
                    />
                    {
                        dataList.length != 0 ?
                            <div className={styles.dataList}>
                                <List
                                    itemLayout="vertical"
                                    dataSource={dataList}
                                    renderItem={(item) => {
                                        return (
                                            <List.Item
                                                onClick={() => this._chosenHandler(item)}
                                            >
                                                <p className={styles.itemName}
                                                    dangerouslySetInnerHTML={{ __html: item.name }}>
                                                </p>
                                                <p className={styles.deviceId}
                                                    dangerouslySetInnerHTML={{ __html: item.deviceId }}
                                                ></p>
                                                <Icon type={item.icon} />
                                                <p className={styles.itemAdress}
                                                    dangerouslySetInnerHTML={{ __html: item.installAddr }}
                                                ></p>
                                            </List.Item>
                                        )
                                    }
                                    }
                                />
                            </div>
                            : null
                    }
                </div>
                <div className={styles.btnGroup}>
                    <Button
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
                {waterValveMarkers ?
                    <InfoWindow
                        position={infoPositionWaterValve}
                        visible={infoVisibleWaterValve}
                        offset={infoOffset}
                        isCustom={isCustom}
                        size={size}
                        events={this.windowEvents}
                    >
                        <IwContentWaterV isWarningMsg={waterValveMarkers.filter(item => item.position == infoPositionWaterValve)} />
                    </InfoWindow>
                    : null
                }

                {/* 水阀Marker */}
                <Markers
                    markers={waterValveMarkers}
                    render={(extData) => this.renderWaterValveMarker(extData)}
                    events={this.WaterValveEvents}
                    visible={waterValveVisible}
                />
                {/* 自定义地图控件 */}
                <MyCustomize />

            </Map>
        )
    }
}
