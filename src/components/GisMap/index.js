import React,{Component} from 'react';
import { Map } from 'react-amap';
import styles from './index.less';
import {Input} from 'antd';
const MY_AMAP_KEY = 'cba14bed102c3aa9a34455dfe21c8a6e';
export default class extends Component {
    constructor(props){
        super(props)
    }
    //添加折线图
    _addPolyline(){
        const path = [
            new AMap.LngLat(116.368904,39.913423),
            new AMap.LngLat(116.382122,39.901176),
            new AMap.LngLat(116.387271,39.912501),
            new AMap.LngLat(116.398258,39.904600)
        ];
        var polyline = new AMap.Polyline({
            path: path,  
            borderWeight: 2, // 线条宽度，默认为 1
            strokeColor: 'red', // 线条颜色
            lineJoin: 'round' // 折线拐点连接处样式
        });
        // 将折线添加至地图实例
        map.add(polyline);
    }
    render(){
        return(
            <div className={styles.map}>
                <div className={styles.search}>
                    管网编号
                    <Input 
                        placeholder='请查询设备编号或设备名称'
                    />
                </div>
                <Map amapkey={MY_AMAP_KEY}></Map>
            </div>
        )
    }
}