import React, { Component } from 'react';
import styles from './index.less';
import { Input, Button, List,} from 'antd';
import { Map, Markers, InfoWindow } from 'react-amap';
import Geolocation from 'react-amap-plugin-geolocation'
import IwContent from './infoWindow';
import MarkerExterior from './markerExterior';
import MyCustomize from './myCustomize';
import { timeOut } from '../../utils/timeOut';
const MY_AMAP_KEY = 'cba14bed102c3aa9a34455dfe21c8a6e';
// 开发环境
const envNet = 'http://192.168.30.127:88';
//生产环境
// const envNet = '';
//搜索
const searchUrl = `${envNet}/api/device/gisDeviceList`;
//获取实时数据
const realTimeDataUrl = `${envNet}/api/DeviceData/realtimeData`
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
            //标记/信息窗可见性
            cameraVisible: true,
            waterMeterVisible: false,
            eleMeterVisible: false,
            waterValveVisible: false,
            //信息窗位置偏移量
            infoOffset: [-3, -20],
            //信息窗可见性
            infoVisibleCamera: false,
            infoVisibleWaterValve: false,
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
            center: { longitude: 121.4719, latitude: 31.1907 },
            // center:{},
            //控件插件
            plugins,
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
            dataList: [],
            //搜索关键字
            keyword: '',
            //当前设备类型ID
            deviceTypeId: 5,
            //信息窗展示数据
            infoData:null

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
                deviceId: v.deviceId
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
        if (dataList.length !== 0) {
            this._getDataList(dataList, keyword)
        }
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
                this.setState({
                    infoPositionCamera: marker.getExtData().position,
                    infoVisibleCamera: true,
                    isClicked: true
                })
            },
            dragend: (MapsOption, marker) => { /* ... */ },
            mouseover: (MapsOption, marker) => {
                // console.log(marker)
                let deviceId =  marker.getExtData().deviceId
                this._getRealTimeData(deviceId)
                this.setState({
                    infoPositionCamera: marker.getExtData().position,
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
            },
            close: () => {
                this.setState({
                    infoVisibleCamera: false,
                    infoVisibleWaterValve: false,
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
                this.setState({
                    infoPositionWaterValve: marker.getExtData().position,
                    infoVisibleWaterValve: true,
                    isClicked: true
                })
            },
            dragend: (MapsOption, marker) => { /* ... */ },
            mouseover: (MapsOption, marker) => {
                let deviceId =  marker.getExtData().deviceId
                this._getRealTimeData(deviceId)
                this.setState({
                    infoPositionWaterValve: marker.getExtData().position,
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
                this.setState({
                    infoPositionWaterValve: marker.getExtData().position,
                    infoVisibleWaterValve: true,
                    isClicked: true
                })
            },
            dragend: (MapsOption, marker) => { /* ... */ },
            mouseover: (MapsOption, marker) => {
                let deviceId =  marker.getExtData().deviceId
                this._getRealTimeData(deviceId)
                this.setState({
                    infoPositionWaterValve: marker.getExtData().position,
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
                this.setState({
                    infoPositionWaterValve: marker.getExtData().position,
                    infoVisibleWaterValve: true,
                    isClicked: true
                })
            },
            dragend: (MapsOption, marker) => { /* ... */ },
            mouseover: (MapsOption, marker) => {
                let deviceId =  marker.getExtData().deviceId
                this._getRealTimeData(deviceId)
                this.setState({
                    infoPositionWaterValve: marker.getExtData().position,
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
    //获取实时数据
    _getRealTimeData(deviceId){
        // console.log(deviceId)
        return fetch(realTimeDataUrl,{
            ...postOption,
            body:JSON.stringify({
                deviceId,
                showDisplayName:true
            })
        }).then((res)=>{
            Promise.resolve(res.json())
            .then((v)=>{
                //超时判断
                timeOut(v.ret)
                if(v.ret == 1){
                    let infoData = v.data;
                    // console.log(infoData)
                    // infoData.map((v,i)=>{
                    //     console.log(i,v)
                    // })
                    
                    this.setState({
                        infoData,
                    })
                }
            })
        }).catch((err)=>{
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
        allCameraMarkers.map((v, i) => {
            if (v.Pg.visible == true) {
                let deviceTypeId = '';
                v.hide();
                this.setState({
                    deviceTypeId,
                    cameraVisible: false
                })
            } else {
                let deviceTypeId = 5;
                v.show();
                this.setState({
                    deviceTypeId,
                    cameraVisible: true,
                    waterValveVisible: false,
                    eleMeterVisible: false,
                    waterMeterVisible: false
                })
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
        allWaterMeterMarkers.map((v, i) => {
            if (v.Pg.visible == true) {
                let deviceTypeId = '';
                v.hide();
                this.setState({
                    deviceTypeId,
                    waterMeterVisible: false
                })
            } else {
                let deviceTypeId = 2;
                v.show();
                this.setState({
                    deviceTypeId,
                    cameraVisible: false,
                    waterValveVisible: false,
                    eleMeterVisible: false,
                    waterMeterVisible: true
                })
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
        allEleMeterMarkers.map((v, i) => {
            if (v.Pg.visible == true) {
                let deviceTypeId = '';
                v.hide();
                this.setState({
                    deviceTypeId,
                    eleMeterVisible: false,
                })
            } else {
                let deviceTypeId = 3;
                v.show();
                this.setState({
                    deviceTypeId,
                    cameraVisible: false,
                    waterMeterVisible: false,
                    waterValveVisible: false,
                    eleMeterVisible: true
                })
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
        allWaterValveMarkers.map((v, i) => {
            if (v.Pg.visible == true) {
                let deviceTypeId = '';
                v.hide();
                this.setState({
                    deviceTypeId,
                    waterValveVisible: false
                })
            } else {
                let deviceTypeId = 1;
                v.show();
                this.setState({
                    deviceTypeId,
                    cameraVisible: false,
                    waterMeterVisible: false,
                    eleMeterVisible: false,
                    waterValveVisible: true
                })
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
                dataList: []
            })
        }
    }
    //选择设备后定位
    _chosenHandler(item) {
        const { allCameraMarkers, allWaterMeterMarkers, allEleMeterMarkers, allWaterValveMarkers } = this.state;
        let center = { longitude: item.longitude, latitude: item.latitude };
        this.setState({
            center
        })
        //摄像头
        allCameraMarkers.map((v, i) => {
            let position = v.getPosition()
            if (position.lng == center.longitude && position.lat == center.latitude) {
                v.render(this.renderMarkerChosen)
            } else {
                v.render(this.renderMarker)
            }
        })
        //水表
        allWaterMeterMarkers.map((v, i) => {
            let position = v.getPosition()
            if (position.lng == center.longitude && position.lat == center.latitude) {
                v.render(this.renderMarkerChosen)
            } else {
                v.render(this.renderMarker)
            }
        })
        //电表
        allEleMeterMarkers.map((v, i) => {
            let position = v.getPosition()
            if (position.lng == center.longitude && position.lat == center.latitude) {
                v.render(this.renderMarkerChosen)
            } else {
                v.render(this.renderMarker)
            }
        })
        //水阀
        allWaterValveMarkers.map((v, i) => {
            let position = v.getPosition()
            if (position.lng == center.longitude && position.lat == center.latitude) {
                v.render(this.renderMarkerChosen)
            } else {
                v.render(this.renderMarker)
            }
        })
    }
    render() {
        const {
            pluginProps,
            dataList,
            plugins, center,
            //useCluster,
            cameraVisible, waterMeterVisible, eleMeterVisible, waterValveVisible,
            cameraMarkers, waterMeterMarkers, eleMeterMarkers, waterValveMarkers,
            infoVisibleCamera, infoVisibleWaterValve,
            infoOffset, isCustom, size, infoPositionCamera, infoPositionWaterValve,
            infoData,
        } = this.state;
        // console.log(center)
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
                        dataList.length !== 0 ?
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
                    <Button
                        onClick={() => this._WatermeterHandler()}
                    >
                        <i className={styles.waterMeter}></i>
                        <span>水表</span>
                    </Button>
                    <Button
                        onClick={() => this._ElectricmeterHandler()}
                    >
                        <i className={styles.eleMeter}></i>
                        <span>电表</span>
                    </Button>
                    <Button onClick={() => this._WatervalveHandler()}>
                        <i className={styles.waterValve}></i>
                        <span>水阀</span>
                    </Button>
                </div>
                {/* 摄像头信息窗 高德地图规定同时最多只能显示一个信息窗*/}
                {cameraVisible && cameraMarkers ?
                    <InfoWindow
                        position={infoPositionCamera}
                        visible={infoVisibleCamera}
                        offset={infoOffset}
                        isCustom={isCustom}
                        size={size}
                        events={this.windowEvents}
                    >
                        <IwContent
                            info={cameraMarkers.filter(item => item.position == infoPositionCamera)}
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
                        visible={infoVisibleWaterValve}
                        offset={infoOffset}
                        isCustom={isCustom}
                        size={size}
                        events={this.windowEvents}
                    >
                        <IwContent
                            info={waterValveMarkers.filter(item => item.position == infoPositionWaterValve)}
                            {...{infoData}}
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
                        visible={infoVisibleWaterValve}
                        offset={infoOffset}
                        isCustom={isCustom}
                        size={size}
                        events={this.windowEvents}
                    >
                        <IwContent 
                            info={waterMeterMarkers.filter(item => item.position == infoPositionWaterValve)} 
                            {...{infoData}}
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
                        visible={infoVisibleWaterValve}
                        offset={infoOffset}
                        isCustom={isCustom}
                        size={size}
                        events={this.windowEvents}
                    >
                        <IwContent 
                            info={eleMeterMarkers.filter(item => item.position == infoPositionWaterValve)} 
                            {...{infoData}}
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
