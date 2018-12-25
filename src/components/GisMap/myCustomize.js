import React, { Component } from 'react';
import { Button } from 'antd';
import styles from './index.less';
import classnames from 'classnames';
export default class extends Component {
    constructor(props) {
        super(props)
        const map = props.__map__;
        if (!map) {
            console.log('组件必须作为 Map 的子组件使用');
            return;
        }
        // console.log(map);
        this.state = {
            map,
            //平面地图或卫星影像 1为平面地图 2 为卫星影像
            flatOrSatellite:2
        }
    }

    componentDidMount() {
        this._satelliteMap();
       
    }
    //地图切换成平面2D
    _flatMap() {
        const { map } = this.state;
        map.plugin(["AMap.MapType"], function () {
            //地图类型切换
            // debugger
            let type = new AMap.MapType({
                defaultType: 0,//使用2D地图
            });
            map.addControl(type);
        });
        //添加图层
        // this._addImage();
        //添加文本
        // this._addText();
        this.setState({
            flatOrSatellite:1
        })
    }
    //地图切换成卫星
    _satelliteMap() {
        const { map } = this.state;
        map.plugin(["AMap.MapType"], function () {
            //地图类型切换
            let type = new AMap.MapType({
                defaultType: 1,//使用2D地图
            });
            map.addControl(type);
        });
        //添加图层
        // this._addImage();
        //添加文本
        // this._addText();
        //添加矩形覆盖层
        // this._addRectangle()
        this.setState({
            flatOrSatellite:2
        })
    }
    //地图放大
    _zoomIn() {
        const { map } = this.state;
        map.zoomIn();
    }
    //地图缩小
    _zoomOut() {
        const { map } = this.state;
        map.zoomOut();
    }
    //添加图片图层
    _addImage() {
        const { map } = this.state;
        // console.log(map)
        let imageLayer = new AMap.ImageLayer({
            url: 'http://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/dongwuyuan.jpg',
            bounds: new AMap.Bounds(
                [116.327911, 39.939229],
                [116.342659, 39.946275]
            ),
            opacity: 1,
            zIndex: 100,
            zooms: [15, 18],
            visible: true,
            map: map
        });
        map.add(imageLayer);
    }
    //添加纯文本标记
    _addText(){
        const {map} = this.state;
        let txt = new AMap.Text({
            text:'233323',
            textAlign:'center', // 'left' 'right', 'center',
            verticalAlign:'middle', //middle 、bottom
            // draggable:true,
            cursor:'pointer',
            // angle:10,
            style:{
                'padding': '.75rem 1.25rem',
                'margin-bottom': '1rem',
                'border-radius': '.25rem',
                'background-color': 'rgba(0,0,0,0)',
                'width': '15rem',
                'border-width': 0,
                'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
                'text-align': 'center',
                'font-size': '20px',
                'color': 'white'
            },
            position: [116.396923,39.918203],
            zooms:[13,19],
        });
    
        txt.setMap(map);
        
    }
    //添加矩形覆盖层
    _addRectangle(){
        const {map} = this.state;
        var southWest = new AMap.LngLat(116.356449, 39.900809)  //西南角 左下角
        var northEast = new AMap.LngLat(116.417901, 39.935560)  //东北角 右上角
        var bounds = new AMap.Bounds(southWest, northEast)
        let rectangle = new AMap.Rectangle({
            bounds: bounds,
            strokeColor:'red',
            strokeWeight: 6,
            strokeOpacity:0.5,
            strokeDasharray: [30,10],
            // strokeStyle还支持 solid
            strokeStyle: 'dashed',
            fillColor:'blue',
            fillOpacity:0.5,
            cursor:'pointer',
            zIndex:50,
        })
    
        rectangle.setMap(map)
    }
    render() {
        const {flatOrSatellite} = this.state;
        return (
            <div>
                <div className={styles.btnMapType}>
                    <Button
                        className={flatOrSatellite == 2?styles.btnsatellite1:styles.btnsatellite2}
                        onClick={() => this._satelliteMap()}>卫星</Button>
                    <Button
                        className={flatOrSatellite == 1?styles.btnflat1:styles.btnflat2}
                        onClick={() => this._flatMap()}>地图</Button>

                </div>
                <div className={styles.btnMapZoom}>
                    <Button
                        className={styles.btnPlus}
                        onClick={() => this._zoomIn()}
                    >
                        <i className={classnames('dyhsicon', 'dyhs-ditufangda', `${styles.plusIcon}`)}></i>
                    </Button>
                    <Button
                        className={styles.btnLess}
                        onClick={() => this._zoomOut()}
                    >
                        <i className={classnames('dyhsicon', 'dyhs-ditusuoxiao', `${styles.lessIcon}`)}></i>
                    </Button>
                </div>
            </div>
        )
    }
}