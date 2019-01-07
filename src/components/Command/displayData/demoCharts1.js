import React,{Component,Fragment} from 'react';
import styles from './demoCharts1.less';
import {Card} from 'antd'
export default class extends Component{
    render(){
        return(
            <Fragment>
                <div className={styles.firstCard}>
                    <Card
                    title="水量统计"
                    >
                        <header>
                            宁围灌区
                        </header>
                        <div className={styles.seaction}>
                            <div className={styles.data1}>
                                <div className={styles.title}>2m³</div>
                                <div className={styles.content}>本年</div>
                            </div>
                            <div className={styles.data2}>
                                <div className={styles.title}>2m³</div>
                                <div className={styles.content}>本月</div>
                            </div>
                            <div className={styles.data3}>
                                <div className={styles.title}>0m³</div>
                                <div className={styles.content}>本周</div>
                            </div>
                        </div>
                    </Card>
                </div>
            </Fragment>
        )
    }
}