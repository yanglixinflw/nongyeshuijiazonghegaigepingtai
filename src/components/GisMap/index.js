import React, { Component } from 'react';
import styles from './index.less';
import { Input, Button, List } from 'antd';
import { Map, Markers, InfoWindow } from 'react-amap';
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
        icon: 'WIFI'
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
            {
                name: 'MapType',
                options: {
                    visible: false,  // 不设置该属性默认就是 true
                    defaultType: 1,    //底图默认 0位平面2D，1为卫星
                    onCreated(ins) {
                        // console.log(ins);
                    },
                },
            },
            //缩放控件
            // {
            //     name: 'ToolBar',
            //     options: {
            //       visible: true,  // 不设置该属性默认就是 true
            //       onCreated(ins){
            //         // console.log(ins);
            //       },
            //     },
            // },

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
            //信息窗大小
            size: {
                width: 284,
                height: 169
            },
            //信息窗组件是否可用子组件
            isCustom: false,
            // 地图中心点
            center: { longitude: 120.26, latitude: 30.29 },
            //控件插件
            plugins,
            //多个Marker经纬度
            cameraMarkers: homePosition,
            //所有摄像头markers实例
            allCameraMarkers: '',
            //marker是否被点击
            clicked: false,
            //搜索下拉列表数据
            dataList,
            loading: false,
            hasMore: true,
            //搜索关键字
            keyWord:'00'
        }
        //console.log(this.state.markers)
        //地图触发事件
        this.mapEvents = {
            created: (ins)=>{
                console.log(ins)
                console.log(ins.getMapNumber())
                console.log(ins.getLayers())
                console.log(ins.getDefaultLayer())
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
    //搜索
    _searchHandler(e) {
        // console.log(e.target.value)
        this.setState({
            keyWord: e.target.value
        })
        //请求接口从后台拿到数据（dataList）后，_getDataList()
        //选择marker后设置map的center为该marker的position
    }
    _getDataList(dataList) {

    }
    // _renderdataList() {
    //     const { dataList,keyWord } = this.state;
    //     dataList.filter((val, i) => {
    //         var re = new RegExp(keyWord, 'g');
    //         val.name = val.name.replace(re, `<span className=${styles.keyWord}>${keyWord}</span>`);
    //         val.id = val.id.replace(re, `<span className=${styles.keyWord}>${keyWord}</span>`)
    //     })
    //     console.log(dataList)
    //     dataList.map((v, i) => {
    //         return (
    //             <List.Item key={i}>
    //                 <p>{v.name}{v.id}</p>
    //                 <p>{v.address}</p>
    //                 {v.icon ?
    //                     <i></i>
    //                     : null
    //                 }
    //             </List.Item>
    //         )
    //     })
    // }
    render() {
        
        const {
            keyWord,
            dataList,
            plugins, center,
            //useCluster,
            cameraMarkers,
            infoVisible,
            infoOffset, isCustom, size, infoPosition,
        } = this.state;
        let re = new RegExp(keyWord, 'g');
        return (
            <Map
                amapkey={MY_AMAP_KEY}
                //地图控件 插件
                plugins={plugins}
                // 地图中心点设置
                center={center}
                //地图显示的缩放级别
                zoom={16}
                events={this.mapEvents}
            >
                <div className={styles.search}>
                    <Input
                        placeholder='请查询设备编号或设备名称'
                        onPressEnter={(e) => this._searchHandler(e)}
                        onChange={(e) => this._searchHandler(e)}
                    />
                    <div className={styles.dataList}>
                        <List
                            itemLayout='vertical'
                            dataSource={dataList}
                            renderItem={item => (
                                <List.Item>
                                  <List.Item.Meta
                                    description={
                                        item.name
                                    }
                                  />
                                </List.Item>
                              )}
                           
                        />
                    </div>
                </div>
                <div className={styles.btnGroup}>
                    <Button
                        onClick={() => this._cameraHandler()}

                    >
                        <i className={styles.camera}></i>
                        <span>摄像头</span>
                    </Button>
                    <Button onClick={() => this._WatermeterHandler()}>水表</Button>
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
