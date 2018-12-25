import React, { Component, Fragment } from 'react';
import styles from './index.less';
import { Input, Button, List, Spin } from 'antd';
import { Map, Markers, InfoWindow } from 'react-amap';
import Geolocation from 'react-amap-plugin-geolocation'
import IwContent from './infoWindow';
import MarkerExterior from './markerExterior';
import MyCustomize from './myCustomize';
import { timeOut } from '../../utils/timeOut';
import _ from 'lodash';
const MY_AMAP_KEY = 'cba14bed102c3aa9a34455dfe21c8a6e';
import {ENVNet,postOption} from '../../services/netCofig'
//搜索
const searchUrl = `${ENVNet}/api/device/gisDeviceList`;
//获取实时数据
const realTimeDataUrl = `${ENVNet}/api/DeviceData/realtimeData`
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
        const mapLoading = <Fragment>
            <Spin size='large'></Spin>
        </Fragment>
        // console.log(map)
        let center = {};
        center.longitude = props.mapGis.camera.data.data.items[0].longitude;
        center.latitude = props.mapGis.camera.data.data.items[0].latitude;
        this.state = {
            //地图加载时过渡样式
            mapLoading,
            //地图定位插件
            pluginProps,
            //控件插件
            plugins,
            //标记/信息窗可见性
            cameraVisible: true,
            waterMeterVisible: false,
            eleMeterVisible: false,
            waterValveVisible: false,
            //信息窗位置偏移量
            infoOffset: [-3, -20],
            //信息窗可见性
            infoVisible: false,
            //摄像头信息窗位置，根据点击marker时 赋值
            infoPositionCamera: '',
            //水表/电表/水阀信息窗
            infoPositionWaterValve: '',
            //信息窗大小
            size: {
                width: 285,
                height: 169
            },
            //信息窗组件是否可用子组件,false即在系统默认的信息窗体外框中显示content内容
            isCustom: false,
            // 地图中心点
            center,
            // center:{},
            //多个Marker经纬度
            cameraMarkers: "",
            waterMeterMarkers: "",
            eleMeterMarkers: "",
            waterValveMarkers: "",
            //所有摄像头markers实例
            allCameraMarkers: '',
            //所有水表markers实例
            allWaterMeterMarkers: '',
            //所有电表markers实例
            allEleMeterMarkers: '',
            //所有水阀markers实例
            allWaterValveMarkers: '',
            //marker是否被点击
            isClicked: false,
            //搜索下拉列表数据
            dataList: null,
            //搜索关键字
            keyword: '',
            //当前设备类型ID
            deviceTypeId: 5,
            //信息窗展示数据
            infoData: null,
            isActive1: true,
            isActive2: false,
            isActive3: false,
            isActive4: false,

        }
        //console.log(this.state.markers)

    }
    componentDidMount() {
        let { dataList, keyword, } = this.state
        let cameraPosition = [];
        let waterMeterPosition = [];
        let eleMeterPosition = [];
        let waterValvePosition = [];
        let { mapGis } = this.props;
        let camera = mapGis.camera.data.data.items;
        let waterMeter = mapGis.waterMeter.data.data.items;
        let eleMeter = mapGis.eleMeter.data.data.items;
        let waterValve = mapGis.waterValve.data.data.items;
        //将拿到的数据做处理
        camera.map((v, i) => {
            let position = {};
            position.longitude = v.longitude;
            position.latitude = v.latitude;
            // console.log(v)
            cameraPosition.push({
                position,
                deviceTypeId: v.deviceTypeId,
                name: v.name,
                deviceId: v.deviceId,
                photoUrl:v.photoUrl,
            })
        })
        waterMeter.map((v, i) => {
            let position = {};
            position.longitude = v.longitude;
            position.latitude = v.latitude;
            waterMeterPosition.push({
                position,
                deviceTypeId: v.deviceTypeId,
                name: v.name,
                deviceId: v.deviceId
            })
        })
        eleMeter.map((v, i) => {
            let position = {};
            position.longitude = v.longitude;
            position.latitude = v.latitude;
            eleMeterPosition.push({
                position,
                deviceTypeId: v.deviceTypeId,
                name: v.name,
                deviceId: v.deviceId
            })
        })
        waterValve.map((v, i) => {
            let position = {};
            position.longitude = v.longitude;
            position.latitude = v.latitude;
            waterValvePosition.push({
                position,
                deviceTypeId: v.deviceTypeId,
                name: v.name,
                deviceId: v.deviceId
            })
        })
        this.setState({
            cameraMarkers: cameraPosition,
            waterMeterMarkers: waterMeterPosition,
            eleMeterMarkers: eleMeterPosition,
            waterValveMarkers: waterValvePosition,
        })
        if (dataList !== null) {
            this._getDataList(dataList, keyword)
        }
        //地图触发事件
        this.mapEvents = {
            created: (ins) => {
                // console.log(ins)
            },
            click: () => {
                if (this.state.infoVisible == true) {
                    this.setState({
                        infoVisible: false,
                    })
                }

            },
        }
        //摄像头标记点触发事件
        this.cameraEvents = {
            created: (allCameraMarkers) => {
                //   console.log('All Markers Instance Are Below');
                // console.log(MapsOption)
                this.setState({
                    allCameraMarkers
                })
                // console.log(allCameraMarkers)
            },
            click: (MapsOption, marker) => {
                const {allCameraMarkers} = this.state;
                allCameraMarkers.map((v,i)=>{
                    if(v.getExtData().deviceId == marker.getExtData().deviceId ){
                        // console.log(1)
                        v.render(this.renderMarkerChosen)
                    }else{
                        v.render(this.renderMarker)
                    }
                })
                this.setState({
                    infoPositionCamera: marker.getExtData().position,
                    infoVisible: true,
                    isClicked: true
                })
            },
            dragend: (MapsOption, marker) => { /* ... */ },
            mouseover: (MapsOption, marker) => {
                // console.log(marker)
                let deviceId = marker.getExtData().deviceId
                this._getRealTimeData(deviceId)
                this.setState({
                    infoPositionCamera: marker.getExtData().position,
                    infoVisible: true
                })
            },
            mouseout: (MapsOption, marker) => {
                if (this.state.isClicked) {
                    this.setState({
                        infoVisible: true
                    })
                } else {
                    this.setState({
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
            },
            close: () => {
                this.setState({
                    infoVisible: false,
                    isClicked: false
                })
            },
            change: () => {
            },
        }
        //水阀标记点触发事件
        this.WaterValveEvents = {
            created: (allWaterValveMarkers) => {
                this.setState({
                    allWaterValveMarkers
                })
            },
            click: (MapsOption, marker) => {
                const {allWaterValveMarkers} = this.state;
                allWaterValveMarkers.map((v,i)=>{
                    if(v.getExtData().deviceId == marker.getExtData().deviceId ){
                        // console.log(1)
                        v.render(this.renderMarkerChosen)
                    }else{
                        v.render(this.renderMarker)
                    }
                })
                this.setState({
                    infoPositionWaterValve: marker.getExtData().position,
                    infoVisible: true,
                    isClicked: true
                })
            },
            dragend: (MapsOption, marker) => { /* ... */ },
            mouseover: (MapsOption, marker) => {
                // console.log(marker)
                let deviceId = marker.getExtData().deviceId
                this._getRealTimeData(deviceId)
                this.setState({
                    infoPositionWaterValve: marker.getExtData().position,
                    infoVisible: true
                })
            },
            mouseout: (MapsOption, marker) => {
                if (this.state.isClicked) {
                    this.setState({
                        infoVisible: true
                    })
                } else {
                    this.setState({
                        infoVisible: false
                    })
                }
            }
        }
        //水表标记点触发事件
        this.WaterMeterEvents = {
            created: (allWaterMeterMarkers) => {
                //   console.log('All Markers Instance Are Below');
                // console.log(MapsOption)
                this.setState({
                    allWaterMeterMarkers
                })
            },
            click: (MapsOption, marker) => {
                const {allWaterMeterMarkers} = this.state;
                allWaterMeterMarkers.map((v,i)=>{
                    if(v.getExtData().deviceId == marker.getExtData().deviceId ){
                        // console.log(1)
                        v.render(this.renderMarkerChosen)
                    }else{
                        v.render(this.renderMarker)
                    }
                })
                this.setState({
                    infoPositionWaterValve: marker.getExtData().position,
                    infoVisible: true,
                    isClicked: true
                })
            },
            dragend: (MapsOption, marker) => { /* ... */ },
            mouseover: (MapsOption, marker) => {
                let deviceId = marker.getExtData().deviceId
                this._getRealTimeData(deviceId)
                this.setState({
                    infoPositionWaterValve: marker.getExtData().position,
                    infoVisible: true
                })
            },
            mouseout: (MapsOption, marker) => {
                if (this.state.isClicked) {
                    this.setState({
                        infoVisible: true
                    })
                } else {
                    this.setState({
                        infoVisible: false
                    })
                }
            }
        }
        //电表标记点触发事件
        this.eleMeterEvents = {
            created: (allEleMeterMarkers) => {
                //   console.log('All Markers Instance Are Below');
                // console.log(MapsOption)
                this.setState({
                    allEleMeterMarkers
                })
            },
            click: (MapsOption, marker) => {
                const {allEleMeterMarkers} = this.state;
                allEleMeterMarkers.map((v,i)=>{
                    if(v.getExtData().deviceId == marker.getExtData().deviceId ){
                        // console.log(1)
                        v.render(this.renderMarkerChosen)
                    }else{
                        v.render(this.renderMarker)
                    }
                })
                this.setState({
                    infoPositionWaterValve: marker.getExtData().position,
                    infoVisible: true,
                    isClicked: true
                })
            },
            dragend: (MapsOption, marker) => { /* ... */ },
            mouseover: (MapsOption, marker) => {
                let deviceId = marker.getExtData().deviceId
                this._getRealTimeData(deviceId)
                this.setState({
                    infoPositionWaterValve: marker.getExtData().position,
                    infoVisible: true
                })
            },
            mouseout: (MapsOption, marker) => {
                if (this.state.isClicked) {
                    this.setState({
                        infoVisible: true
                    })
                } else {
                    this.setState({
                        infoVisible: false
                    })
                }
            }
        }
    }
    //获取实时数据
    _getRealTimeData(deviceId) {
        // console.log(deviceId)
        return fetch(realTimeDataUrl, {
            ...postOption,
            body: JSON.stringify({
                deviceId,
                showDisplayName: true
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    //超时判断
                    timeOut(v.ret)
                    if (v.ret == 1) {
                        let infoData = v.data;
                        this.setState({
                            infoData,
                        })
                    }
                })
        }).catch((err) => {
            console.log(err)
        })
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
    //标记正常时渲染方法
    renderMarker(extData) {
        return <MarkerExterior markers={extData} chosenMarker={false} />
    }
    //标记被选中时渲染方法
    renderMarkerChosen(extData) {
        return <MarkerExterior markers={extData} chosenMarker={true} />
    }
    //图标记显示/隐藏
    //摄像头
    _cameraHandler() {
        const { allCameraMarkers, allWaterValveMarkers, allWaterMeterMarkers, allEleMeterMarkers } = this.state;
        // console.log(allCameraMarkers)
        this.refs.searchInput.input.value='';
        allCameraMarkers.map((v, i) => {
            if (v.Pg.visible == true) {
                let deviceTypeId = '';
                v.hide();
                this.setState({
                    isActive1: false,
                    deviceTypeId,
                    cameraVisible: false,
                    dataList: null
                })

            } else {
                let deviceTypeId = 5;
                v.show();
                this.setState({
                    isActive1: true,
                    isActive2: false,
                    isActive3: false,
                    isActive4: false,
                    deviceTypeId,
                    cameraVisible: true,
                    waterValveVisible: false,
                    eleMeterVisible: false,
                    waterMeterVisible: false
                }, this._changeHandler)
            }
        })
        allWaterValveMarkers.map((v, i) => {
            v.hide();
        })
        allWaterMeterMarkers.map((v, i) => {
            v.hide()
        })
        allEleMeterMarkers.map((v, i) => {
            v.hide()
        })
    }
    //水表
    _WatermeterHandler() {
        const { allCameraMarkers, allWaterValveMarkers, allWaterMeterMarkers, allEleMeterMarkers } = this.state;
        // console.log(allWaterMeterMarkers)
        this.refs.searchInput.input.value='';
        allWaterMeterMarkers.map((v, i) => {
            if (v.Pg.visible == true) {
                let deviceTypeId = '';
                v.hide();
                this.setState({
                    isActive2: false,
                    deviceTypeId,
                    waterMeterVisible: false,
                    dataList: null
                })
            } else {
                let deviceTypeId = 2;
                v.show();
                this.setState({
                    isActive1: false,
                    isActive2: true,
                    isActive3: false,
                    isActive4: false,
                    deviceTypeId,
                    cameraVisible: false,
                    waterValveVisible: false,
                    eleMeterVisible: false,
                    waterMeterVisible: true
                }, this._changeHandler)
            }
        })
        allCameraMarkers.map((v, i) => {
            v.hide()
        })
        allWaterValveMarkers.map((v, i) => {
            v.hide()
        })
        allEleMeterMarkers.map((v, i) => {
            v.hide()
        })
    }
    //电表
    _ElectricmeterHandler() {
        const { allWaterValveMarkers, allCameraMarkers, allWaterMeterMarkers, allEleMeterMarkers } = this.state;
        this.refs.searchInput.input.value='';
        allEleMeterMarkers.map((v, i) => {
            if (v.Pg.visible == true) {
                let deviceTypeId = '';
                v.hide();
                this.setState({
                    isActive3: false,
                    deviceTypeId,
                    eleMeterVisible: false,
                    dataList: null
                })
            } else {
                let deviceTypeId = 3;
                v.show();
                this.setState({
                    isActive1: false,
                    isActive2: false,
                    isActive3: true,
                    isActive4: false,
                    deviceTypeId,
                    cameraVisible: false,
                    waterMeterVisible: false,
                    waterValveVisible: false,
                    eleMeterVisible: true
                }, this._changeHandler)
            }
        })
        allCameraMarkers.map((v, i) => {
            v.hide()
        })
        allWaterMeterMarkers.map((v, i) => {
            v.hide()
        })
        allWaterValveMarkers.map((v, i) => {
            v.hide()
        })
    }
    //水阀
    _WatervalveHandler() {
        const { allWaterValveMarkers, allCameraMarkers, allWaterMeterMarkers, allEleMeterMarkers } = this.state;
        this.refs.searchInput.input.value='';
        allWaterValveMarkers.map((v, i) => {
            if (v.Pg.visible == true) {
                let deviceTypeId = '';
                v.hide();
                this.setState({
                    isActive4: false,
                    deviceTypeId,
                    waterValveVisible: false,
                    dataList: null
                })
            } else {
                let deviceTypeId = 1;
                v.show();
                this.setState({
                    isActive1: false,
                    isActive2: false,
                    isActive3: false,
                    isActive4: true,
                    deviceTypeId,
                    cameraVisible: false,
                    waterMeterVisible: false,
                    eleMeterVisible: false,
                    waterValveVisible: true
                }, this._changeHandler)
            }
        })
        allCameraMarkers.map((v, i) => {
            v.hide()
        })
        allWaterMeterMarkers.map((v, i) => {
            v.hide()
        })
        allEleMeterMarkers.map((v, i) => {
            v.hide()
        })
    }
    //搜索
    _changeHandler() {
        // console.log(this.refs.searchInput.input.value)
        //判断输入框为空时，dataList也为空
        const { deviceTypeId } = this.state;
        let keyword = this.refs.searchInput.input.value;
        // console.log(keyword)
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
                            // console.log(v)
                            let dataList = v.data.items;
                            this._getDataList(dataList, keyword)
                            this.setState({
                                dataList
                            })
                        } else {
                            this.setState({
                                dataList: []
                            })
                        }
                    })
            })
        } else {
            this.setState({
                dataList: null
            })
        }
    }
    //选择设备后定位
    _chosenHandler(item) {
        const { allCameraMarkers, allWaterMeterMarkers, allEleMeterMarkers, allWaterValveMarkers, infoWindow } = this.state;
        let center = { longitude: item.longitude, latitude: item.latitude };
        this.setState({
            center,
        })
        //摄像头
        allCameraMarkers.map((v, i) => {
            let position = v.getExtData().position;
            if (position.longitude == center.longitude && position.latitude == center.latitude) {
                v.render(this.renderMarkerChosen)
                this.cameraEvents.click('', v)
            } else {
                v.render(this.renderMarker)
            }
        })
        //水表
        allWaterMeterMarkers.map((v, i) => {
            let position = v.getExtData().position;
            if (position.longitude == center.longitude && position.latitude == center.latitude) {
                v.render(this.renderMarkerChosen)
                this.WaterMeterEvents.click('', v)
            } else {
                v.render(this.renderMarker)
            }
        })
        //电表
        allEleMeterMarkers.map((v, i) => {
            let position = v.getExtData().position;
            if (position.longitude == center.longitude && position.latitude == center.latitude) {
                v.render(this.renderMarkerChosen)
                this.eleMeterEvents.click('', v)
            } else {
                v.render(this.renderMarker)
            }
        })
        //水阀
        allWaterValveMarkers.map((v, i) => {
            let position = v.getExtData().position;
            if (position.longitude == center.longitude && position.latitude == center.latitude) {
                v.render(this.renderMarkerChosen)
                this.WaterValveEvents.click('', v)
            } else {
                v.render(this.renderMarker)
            }
        })
    }
    _onFocusHandler(e) {
        // console.log(e)
        if (e.target.value == '') {
            this.setState({
                dataList: []
            })
        }
        // this.setState({
        //     dataList:[]
        // })
    }
    _onBlurHandler(e) {
        // console.log(e)
        if (e.target.value == '') {
            this.setState({
                dataList: null
            })
        }
    }
    render() {
        const {
            mapLoading,
            pluginProps,
            dataList,
            plugins, center,
            //useCluster,
            isActive1, isActive2, isActive3, isActive4,
            cameraVisible, waterMeterVisible, eleMeterVisible, waterValveVisible,
            cameraMarkers, waterMeterMarkers, eleMeterMarkers, waterValveMarkers,
            infoVisible,
            infoOffset, isCustom, size, infoPositionCamera, infoPositionWaterValve,
            infoData,
        } = this.state;
        // console.log(center)
        return (
            <Map
                loading={mapLoading}
                amapkey={MY_AMAP_KEY}
                //地图控件 插件
                plugins={plugins}
                // 地图中心点设置
                center={center}
                //地图显示的缩放级别
                zoom={15}
                events={this.mapEvents}
                version='1.4.11'
                preloadMode={true}
            >
                <Geolocation
                    {...pluginProps}
                />
                <div className={styles.search}>
                    <Input
                        onFocus={(e) => this._onFocusHandler(e)}
                        onBlur={(e) => this._onBlurHandler(e)}
                        placeholder='请查询设备编号或设备名称'
                        // onPressEnter={(e) => this._searchHandler(e)}
                        ref='searchInput'
                        onChange={_.debounce(() => this._changeHandler(), 300)}
                    />
                    {
                        dataList !== null ?
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
                                                {item.isWarning ?
                                                    <i className={styles.warningWarn}></i>
                                                    : null}
                                                <p className={styles.itemAdress}
                                                    dangerouslySetInnerHTML={{ __html: item.installAddr }}
                                                ></p>
                                            </List.Item>
                                        )
                                    }
                                    }
                                />
                            </div>
                            :
                            // <div>暂无数据</div>
                            null
                    }
                </div>
                <div className={styles.btnGroup}>
                    <Button
                        className={isActive1 ? styles.onActive : styles.offActive}
                        onClick={() => this._cameraHandler()}
                    >
                        <i className={styles.camera}></i>
                        <span>摄像头</span>
                    </Button>
                    <Button
                        className={isActive2 ? styles.onActive : styles.offActive}
                        onClick={() => this._WatermeterHandler()}
                    >
                        <i className={styles.waterMeter}></i>
                        <span>水表</span>
                    </Button>
                    <Button
                        className={isActive3 ? styles.onActive : styles.offActive}
                        onClick={() => this._ElectricmeterHandler()}
                    >
                        <i className={styles.eleMeter}></i>
                        <span>电表</span>
                    </Button>
                    <Button
                        className={isActive4 ? styles.onActive : styles.offActive}
                        onClick={() => this._WatervalveHandler()}
                    >
                        <i className={styles.waterValve}></i>
                        <span>水阀</span>
                    </Button>
                </div>
                {/* 摄像头信息窗 高德地图规定同时最多只能显示一个信息窗*/}
                {cameraVisible && cameraMarkers ?
                    <InfoWindow
                        position={infoPositionCamera}
                        visible={infoVisible}
                        offset={infoOffset}
                        isCustom={isCustom}
                        size={size}
                        events={this.windowEvents}
                    >
                        <IwContent
                            deviceInfo={cameraMarkers.filter(item => item.position == infoPositionCamera)}
                        />
                    </InfoWindow>
                    : null
                }
                {/* 摄像头marker */}
                <Markers
                    markers={cameraMarkers}
                    render={(extData) => this.renderMarker(extData)}
                    events={this.cameraEvents}
                />
                {/* 水阀信息窗 高德地图规定同时最多只能显示一个信息窗*/}
                {waterValveVisible && waterValveMarkers && infoData ?
                    <InfoWindow
                        position={infoPositionWaterValve}
                        visible={infoVisible}
                        offset={infoOffset}
                        isCustom={isCustom}
                        size={size}
                        events={this.windowEvents}
                    >
                        <IwContent
                            deviceInfo={waterValveMarkers.filter(item => item.position == infoPositionWaterValve)}
                            {...{ infoData }}
                        />
                    </InfoWindow>
                    : null
                }
                {/* 水阀Marker */}
                <Markers
                    markers={waterValveMarkers}
                    render={(extData) => this.renderMarker(extData)}
                    events={this.WaterValveEvents}
                    visible={waterValveVisible}
                />
                {/* 水表信息窗 高德地图规定同时最多只能显示一个信息窗*/}
                {waterMeterVisible && waterMeterMarkers && infoData ?
                    <InfoWindow
                        position={infoPositionWaterValve}
                        visible={infoVisible}
                        offset={infoOffset}
                        isCustom={isCustom}
                        size={size}
                        events={this.windowEvents}
                    >
                        <IwContent
                            deviceInfo={waterMeterMarkers.filter(item => item.position == infoPositionWaterValve)}
                            {...{ infoData }}
                        />
                    </InfoWindow>
                    : null
                }
                {/* 水表Marker */}
                <Markers
                    markers={waterMeterMarkers}
                    events={this.WaterMeterEvents}
                    render={(extData) => this.renderMarker(extData)}
                    visible={waterMeterVisible}
                />
                {/* 电表信息窗 高德地图规定同时最多只能显示一个信息窗*/}
                {eleMeterVisible && eleMeterMarkers && infoData ?
                    <InfoWindow
                        position={infoPositionWaterValve}
                        visible={infoVisible}
                        offset={infoOffset}
                        isCustom={isCustom}
                        size={size}
                        events={this.windowEvents}
                    >
                        <IwContent
                            deviceInfo={eleMeterMarkers.filter(item => item.position == infoPositionWaterValve)}
                            {...{ infoData }}
                        />
                    </InfoWindow>
                    : null
                }
                {/* 电表Marker */}
                <Markers
                    markers={eleMeterMarkers}
                    visible={eleMeterVisible}
                    render={(extData) => this.renderMarker(extData)}
                    events={this.eleMeterEvents}
                />
                {/* 自定义地图控件 */}
                <MyCustomize />

            </Map>
        )
    }
}
