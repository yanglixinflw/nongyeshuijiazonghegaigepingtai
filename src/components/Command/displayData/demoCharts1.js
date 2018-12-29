import React,{Component,Fragment} from 'react';
import styles from './demoCharts1.less';
import {Card} from 'antd'
export default class extends Component{
    render(){
        return(
            <Fragment>
                <div className={styles.firstCard}>
                    <Card
                    title="XXXX"
                    >
                        <header>
                            xxx
                        </header>
                        <div className={styles.seaction}>
                            <div className={styles.data1}>
                                <div className={styles.title}>XXXX</div>
                                <div className={styles.content}>xxxxxx</div>
                            </div>
                            <div className={styles.data2}>
                                <div className={styles.title}>XXXX</div>
                                <div className={styles.content}>xxxxxx</div>
                            </div>
                            <div className={styles.data3}>
                                <div className={styles.title}>XXXX</div>
                                <div className={styles.content}>xxxxxx</div>
                            </div>
                        </div>
                    </Card>
                </div>
            </Fragment>
        )
    }
}