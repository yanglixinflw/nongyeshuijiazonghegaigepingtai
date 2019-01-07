import React, { Component } from 'react';
import styles from './dataAnalysis.less';
import { Row, Col } from 'antd';
import ElectricTable from './electric';
import WaterTable from './water';
import UnderGround from './underGround';
import WatchInfo from './watchInfo';
export default class extends Component {
    constructor(props) {
        super(props)
        const { ...whatever } = this.props
        const { data } = whatever.data
        // console.log(data.Usage.WaterYearTotal.toFixed(2))
        const percent = data.Usage.RegisterRate == null ? '0' : data.Usage.RegisterRate * 100
        this.state = {
            //接入情况
            usage: data.Usage,
            //电量
            powerChart: data.PowerChart,
            //水量
            waterChart: data.WaterChart,
            //墒情
            shangQing: data.ShangQing,
            //风情表
            windChart: data.WindChart,
            //气象表
            weatherChart: data.WeatherChart,
            percent,
            //groundSit
        };
    }
    render() {
        const {
            usage,
            powerChart,
            waterChart,
            shangQing,
            weatherChart,
            windChart,
            percent,
        } = this.state
        return (
            <div style={{background:'#151836'}}>
                <div className={styles.header}>
                    灌区环境监控平台
                </div>
                <Row className={styles.section}>
                    <Col className={styles.left} lg={24} xl={8}>
                        <div className={styles.leftTop}>
                            <img style={{ position: 'relative', left: '6%' }} src={require("../../assets/jt.png")} />
                            <span className={styles.title}>接入情况</span>
                        </div>
                        <div className={styles.leftCenter}>
                            <div className={styles.waterAnalysis}>
                                <div>
                                    <div className={styles.wATitle}>
                                        <span></span> 用水分析
                                    </div>
                                    <div className={styles.wAafter}>2018年度</div>
                                </div>
                                <div className={styles.wAData}>
                                    <div>
                                        <div className={styles.yellowdata}>{usage.WaterMonthTotal.toFixed(2)}m³</div>
                                        {/* <div className={styles.yellowdata}>1111m³</div> */}
                                        <div className={styles.dataName}>本月用水</div>
                                    </div>
                                    <div>
                                        <div className={styles.yellowdata}>{usage.WaterYearTotal.toFixed(2)}m³</div>
                                        {/* <div className={styles.yellowdata}>123m³</div> */}
                                        <div className={styles.dataName}>本年用水</div>
                                    </div>
                                </div>
                            </div>
                            {/* 中间线 */}
                            <div className={styles.wALine}>
                            </div>
                            <div className={styles.waterAnalysis}>
                                <div>
                                    <div className={styles.wATitle}>
                                        <span></span>  灌溉农户
                        </div>
                                    <div className={styles.wAafter}>{usage.PeasantUnRegisterTotal}家未接入</div>
                                    {/* <div className={styles.wAafter}>456家未接入</div> */}
                                </div>
                                <div className={styles.wAData}>
                                    <div>
                                        <div className={styles.yellowdata}>{usage.PeasantRegisterTotal}</div>
                                        {/* <div className={styles.yellowdata}>789</div> */}
                                        <div className={styles.dataName}>开通量</div>
                                    </div>
                                    <div>
                                        <div className={styles.yellowdata}>{percent}%</div>
                                        {/* <div className={styles.yellowdata}>88%</div> */}
                                        <div className={styles.dataName}>开通率</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.leftFooter}>
                            {/* 四个角 */}
                            <div className={styles.lt}></div>
                            <div className={styles.rt}></div>
                            <div className={styles.lb}></div>
                            <div className={styles.rb}></div>
                            <div className={styles.electric}>
                                <img className={styles.lfimg} src={require("../../assets/jt.png")} />
                                <span className={styles.lfTitle}>电量(kw·h)</span>
                                <div className={styles.smallTable}>
                                    <ElectricTable {...{ powerChart }} />
                                </div>
                            </div>
                            <div className={styles.water}>
                                <img className={styles.lfimg} src={require("../../assets/jt.png")} />
                                <span className={styles.lfTitle}>水量(m³)</span>
                                <div className={styles.smallTable}>
                                    <WaterTable {...{ waterChart }} />
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className={styles.center} lg={24} xl={8}>
                        <div className={styles.centerBody}>
                            {/* 四个闪光点 */}
                            <div className={styles.flashPoint1}>
                                <div className={styles.point1}></div>
                                <div className={styles.point2}></div>
                            </div>
                            <div className={styles.flashPoint2}>
                                <div className={styles.point3}></div>
                                <div className={styles.point4}></div>
                            </div>
                            <div className={styles.flashPoint3}>
                                <div className={styles.point5}></div>
                                <div className={styles.point6}></div>
                            </div>
                            <div className={styles.flashPoint4}>
                                <div className={styles.point7}></div>
                                <div className={styles.point8}></div>
                            </div>
                            <UnderGround {...{ shangQing }} />
                        </div>
                    </Col>
                    <Col className={styles.right} lg={24} xl={8}>
                        <div className={styles.rightTitle}>
                            <img className={styles.rtimg} src={require("../../assets/jt.png")} />
                            <span>信息监控</span>
                        </div>
                        <div className={styles.rightbody}>
                            <div className={styles.lb}></div>
                            <div className={styles.rb}></div>
                            <WatchInfo
                                {...{ weatherChart, windChart }}
                            //{...groundSit}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}