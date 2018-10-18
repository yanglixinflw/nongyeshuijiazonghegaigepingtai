import React, {Component} from 'react';
import BreadcrumbView from '../PageHeader/breadcrumb';
import styles from './common.less';
import {Button} from 'antd';
const tableTitle = ['更新时间','温度','湿度','光照','大气压','蒸发量','风向','风速','雨量'];
export default class extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
        <div>
            <div className={styles.header}>
                <Button icon="arrow-left"></Button>
                <BreadcrumbView {...this.props} />
            </div>
            
            气象历史数据
        </div>
        )
    }
}