import React,{Component} from 'react';
import {Button} from 'antd';
import styles from './mapWarning.less';
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
            map,
            //平面地图或卫星影像 1为平面地图 2 为卫星影像
            flatOrSatellite:2
        }
    }
    //地图切换成平面2D
    _flatMap(){
        const {map} = this.state;
        map.plugin(["AMap.MapType"],function(){
            //地图类型切换
            var type= new AMap.MapType({
            defaultType:0,//使用2D地图
            });
            map.addControl(type);
        });
        this.setState({
            flatOrSatellite:1
        })
    }
    //地图切换成卫星
    _satelliteMap(){
        const {map} = this.state;
        map.plugin(["AMap.MapType"],function(){
            //地图类型切换
            var type= new AMap.MapType({
            defaultType:1,//使用2D地图
            });
            map.addControl(type);
        });
        this.setState({
            flatOrSatellite:2
        })
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
    render(){
        const {flatOrSatellite} = this.state
        return (
            <div>
                <div className={styles.btnMapType}>
                    <Button 
                         className={flatOrSatellite == 2?styles.btnsatellite1:styles.btnsatellite2}
                        onClick={()=>this._satelliteMap()}>卫星</Button>
                    <Button 
                        className={flatOrSatellite == 1?styles.btnflat1:styles.btnflat2}
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