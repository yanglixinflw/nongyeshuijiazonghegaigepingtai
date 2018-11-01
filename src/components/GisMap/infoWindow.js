import React,{ Component} from 'react';
import styles from './index.less';
import {Card,Icon} from 'antd';
export default class extends Component{
    constructor(props){
        super(props)
        //console.log(props)
        // const map = props.__map__;
        
        // console.log(map)
    }
    render(){
        return (
            <div className={styles.infoWindow}> 
                <Card 
                    title="XXXXXX建筑物名称"
                    extra={<Icon type='video-camera' />}
                >
                    <p>Card content</p>
                    <p>Card content</p>
                    <p>Card content</p>
                </Card>
            </div>
        )
    }
}