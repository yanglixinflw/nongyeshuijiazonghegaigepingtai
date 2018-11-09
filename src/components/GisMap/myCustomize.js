import React,{Component} from 'react';
import {Button} from 'antd';
import styles from './index.less';
import classnames from 'classnames';
export default class extends Component{
    constructor(props){
        super(props)
        const map = props.__map__;
        if (!map) {
            console.log('组件必须作为 Map 的子组件使用');
            return;
          }
        // console.log(map);
        this.state = {
            map
        }
    }
    
    componentDidMount(){
        this._addImage();
        this._satelliteMap()
    }
    //地图切换成平面2D
    _flatMap(){
        const {map} = this.state;
        map.plugin(["AMap.MapType"],function(){
            //地图类型切换
            // debugger
            let type= new AMap.MapType({
            defaultType:0,//使用2D地图
            });
            map.addControl(type);
        });
        let imageLayer = new AMap.ImageLayer({
            url: 'http://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/dongwuyuan.jpg',
            bounds: new AMap.Bounds(
                [116.327911, 39.939229],
                [116.342659, 39.946275]
            ),
            opacity:1,
            zIndex:100,
            zooms: [15, 18],
            visible:true,
            map:map
        });
        map.add(imageLayer);
    }
    //地图切换成卫星
    _satelliteMap(){
        const {map} = this.state;
        map.plugin(["AMap.MapType"],function(){
            //地图类型切换
            let type= new AMap.MapType({
            defaultType:1,//使用2D地图
            });
            map.addControl(type);
        });
        let imageLayer = new AMap.ImageLayer({
            url: 'http://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/dongwuyuan.jpg',
            bounds: new AMap.Bounds(
                [116.327911, 39.939229],
                [116.342659, 39.946275]
            ),
            opacity:1,
            zIndex:100,
            zooms: [15, 18],
            visible:true,
            map:map
        });
        // debugger
        map.add(imageLayer);
    }
    //地图放大
    _zoomIn(){
        const {map} = this.state;
        map.zoomIn();
    }
    //地图缩小
    _zoomOut(){
        const {map} = this.state;
        map.zoomOut();
    }
    //
    _addImage(){
        const {map} = this.state;
        // console.log(map)
        let imageLayer = new AMap.ImageLayer({
            url: 'http://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/dongwuyuan.jpg',
            bounds: new AMap.Bounds(
                [116.327911, 39.939229],
                [116.342659, 39.946275]
            ),
            opacity:1,
            zIndex:100,
            zooms: [15, 18],
            visible:true,
            map:map
        });
        // debugger
        map.add(imageLayer);
        // console.log(imageLayer.getMap())
        
    }
    render(){
        return (
            <div>
                <div className={styles.btnMapType}>
                    <Button 
                        autoFocus
                        className={styles.btnsatellite}
                        onClick={()=>this._satelliteMap()}>卫星</Button>
                    <Button 
                        className={styles.btnflat}
                        onClick={()=>this._flatMap()}>地图</Button>
                    
                </div>
                <div className={styles.btnMapZoom}>
                    <Button 
                        className={styles.btnPlus}
                        onClick={()=>this._zoomIn()}
                    >
                        <i className={classnames('dyhsicon', 'dyhs-ditufangda', `${styles.plusIcon}`)}></i>
                    </Button>
                    <Button 
                        className={styles.btnLess}
                        onClick={()=>this._zoomOut()}
                    >
                        <i className={classnames('dyhsicon', 'dyhs-ditusuoxiao', `${styles.lessIcon}`)}></i>
                    </Button>
                </div>
            </div>
        )
    }
}