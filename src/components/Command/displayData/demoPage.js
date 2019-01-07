import React, { Component, Fragment } from 'react';
import styles from './demoPage.less';
import { Row, Col } from 'antd';
import classnames from 'classnames'
import DemoCharts1 from './demoCharts1'
import DemoCharts2 from './demoCharts2'
import DemoCharts3 from './demoCharts3'
import DemoCharts4 from './demoCharts4'
import DemoCharts5 from './demoCharts5'
import DemoCharts6 from './demoCharts6'
export default class extends Component {
    constructor(props){
        super(props)
        // console.log(props)
        const {deviceCount,operateCount} = props;
        this.state = {
            //设备数量
            deviceCount,
            //设备操作次数
            operateCount,
        }
    }
    render() {
        const {deviceCount,operateCount} = this.state;
        return (
            <Fragment>
                <div className={styles.header}>
                    <span>|</span>运行监控
                </div>
                <section>
                <Row type="flex" justify="space-between">
                    <Col xs={24} sm={12} md={12} lg={12} xl={6} className={styles.card}><DemoCharts1 /></Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={6} className={styles.card}><DemoCharts2 {...deviceCount} /></Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={6} className={styles.card}><DemoCharts3 /></Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={6} className={styles.card}><DemoCharts4 /></Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={16} className={styles.card}><DemoCharts5 /></Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={8} className={styles.card}><DemoCharts6 {...operateCount}/></Col>
                </Row>
                </section>
                <section>

                    {/* <div className={classnames(`${styles.card}`, `${styles.card1}`)}>
                        <DemoCharts1 />
                    </div>
                    <div className={styles.card}>
                        <DemoCharts2 />
                    </div>
                    <div className={styles.card}>
                        <DemoCharts3 />
                    </div>
                    <div className={styles.card}>
                        <DemoCharts4 />
                    </div> */}
                    {/* <div className={styles.card}>
                        <DemoCharts5 />
                    </div>
                    <div className={styles.card}>
                        <DemoCharts6 />
                    </div> */}
                    {/* <DemoCharts6></DemoCharts6> */}
                </section>
            </Fragment>
        )
    }
}