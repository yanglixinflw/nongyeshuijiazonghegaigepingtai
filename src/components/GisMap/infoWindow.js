import React, { Component } from 'react';
import styles from './index.less';
import { Switch } from 'antd';
import classnames from 'classnames'
// import { Link } from 'dva/router';
export default class extends Component {
    constructor(props) {
        super(props)
        console.log(props)
    }
    render() {
        const {info} = this.props
        const {infoData} =this.props
        const { isWarning,deviceTypeId } = info[0]
        if (deviceTypeId == 5) {
            return (
                <div>
                    {isWarning ?
                        <div className={styles.cameraWarningWindow}>
                            <p className={styles.warinngMsg}>设备网络断开，请重新连接网络</p>
                            <div className={styles.mask}>{info[0].name}</div>
                        </div>
                        :
                        <div className={styles.cameraWindow}>
                            <i className={classnames('dyhsicon', 'dyhs-bofang', `${styles.playIcon}`)}></i>
                            <div className={styles.mask}>{info[0].name}</div>
                        </div>
                    }
                </div>
            )
        } else if (deviceTypeId == 1) {
            return (
                <div>
                    <div className={styles.infoTitle}>
                        <p className={styles.deviceName}>{info[0].name}</p>
                    </div>
                    {isWarning ?
                        <div className={styles.infoContent}>
                            <p className={styles.warinngMsg}>设备网络断开，请重新连接网络</p>
                            <p className={styles.checkMore}><a>点击查看更多信息<span>>></span></a></p>
                        </div>
                        :
                        <div className={styles.infoContent}>
                            {
                                infoData.length == 0? 
                                    <p>暂无数据</p>
                                :
                                infoData.map((v,i)=>{
                                    return (
                                        <div>
                                            <p className={styles.labelName} key={i}>太阳能电压<span>{v.sunElecPress}</span></p>
                                            <p className={styles.labelName} key={i}>管道压力<span>{v.press}</span></p>
                                            <p className={styles.labelName} key={i}>瞬时流量<span>{v.instantNumber}</span></p>
                                            <p className={styles.labelName} key={i}>累积流量<span>{v.waterTotalNumber}</span></p>
                                            <p className={styles.labelName} key={i}>供电电压<span>{v.batteryPress}</span></p>
                                            <p className={styles.labelName} key={i}>阀门状态<span>{v.valveStatus}</span></p>
                                        </div>
                                    )
                                })
                            }

                            <p className={styles.labelName}>
                                控制开关
                            <Switch defaultChecked />
                            </p>
                            <p className={styles.checkMore}><a>点击查看更多信息<span>>></span></a></p>
                        </div>
                    }
                </div>
            )
        } else {
            return (
                <div>
                    <div className={styles.infoTitle}>
                        <p className={styles.deviceName}>{info[0].name}</p>
                    </div>
                    {isWarning ?
                        <div className={styles.infoContent}>
                            <p className={styles.warinngMsg}>设备网络断开，请重新连接网络</p>
                            <p className={styles.checkMore}><a>点击查看更多信息<span>>></span></a></p>
                        </div>
                        :
                        <div className={styles.infoContent}>
                            <p className={styles.labelName}>实时数据<span>0.99m3/h</span></p>
                            <p className={styles.labelName}>
                                控制开关
                            <Switch defaultChecked />
                            </p>
                            <p className={styles.checkMore}><a>点击查看更多信息<span>>></span></a></p>
                        </div>
                    }
                </div>
            )
        }
    }
}