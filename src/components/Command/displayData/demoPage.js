import React, { Component, Fragment } from 'react';
import styles from './demoPage.less';
import DemoCharts1 from './demoCharts1'
import DemoCharts2 from './demoCharts2'
import DemoCharts3 from './demoCharts3'
import DemoCharts4 from './demoCharts4'
import DemoCharts5 from './demoCharts5'
import DemoCharts6 from './demoCharts6'
export default class extends Component {
    render() {
        return (
            <Fragment>
                <div className={styles.header}>
                    <span>|</span>数据结算
                </div>
                <section>
                    <div className={styles.card}>
                    <DemoCharts1/>
                    </div>
                    <div className={styles.card}>
                    <DemoCharts2/>
                    </div>
                    <div className={styles.card}>
                    <DemoCharts3/>
                    </div>
                    <div className={styles.card}>
                    <DemoCharts4/>
                    </div>
                    <div className={styles.card}>
                    <DemoCharts5/>
                    </div>
                    <div className={styles.card}>
                    <DemoCharts6/>
                    </div>
                    {/* <DemoCharts6></DemoCharts6> */}
                </section>
            </Fragment>
        )
    }
}