import React, { Component } from 'react';
import styles from './index.less';
import { Switch } from 'antd';
import classnames from 'classnames'
// import { Link } from 'dva/router';
export default class extends Component {
    constructor(props) {
        super(props)
        // console.log(props)
    }
    render() {
        const { deviceInfo } = this.props
        // console.log(deviceInfo)
        if (deviceInfo.length == 0) {
            return null
        }
        const { infoData } = this.props
        if (deviceInfo[0].deviceTypeId == 5) {   //摄像头
            return (
                <div>
                    {deviceInfo[0].isWarning ?
                        <div className={styles.cameraWarningWindow}>
                            <p className={styles.warinngMsg}>设备网络断开，请重新连接网络</p>
                            <div className={styles.mask}>{deviceInfo[0].name}</div>
                        </div>
                        :
                        <div 
                            className={styles.cameraWindow}
                        >
                            <div style={{ background: `url(${deviceInfo[0].photoUrl})`, backgroundSize: 'cover',width:'285px',height:'169px' }}>
                            <a href={`/#/command/videoMonitoring:${deviceInfo[0].deviceId}`} target='_blank'>
                                <i className={classnames('dyhsicon', 'dyhs-bofang', `${styles.playIcon}`)}></i>
                            </a>
                           
                            <div className={styles.mask}>{deviceInfo[0].name}</div>
                            </div>
                        </div>
                    }
                </div>
            )
        } else if (deviceInfo[0].deviceTypeId == 1) {  //球阀
            return (
                <div>
                    <div className={styles.infoTitle}>
                        <p className={styles.deviceName}>{deviceInfo[0].name}</p>
                    </div>
                    {deviceInfo[0].isWarning ?
                        <div className={styles.infoContent}>
                            <p className={styles.warinngMsg}>设备网络断开，请重新连接网络</p>
                            <p className={styles.checkMore}><a>点击查看更多信息<span>>></span></a></p>
                        </div>
                        :
                        <div className={styles.infoContent}>
                            {
                                infoData.length == 0 ?
                                    <p>暂无数据</p>
                                    :
                                    infoData.map((v, i) => {
                                        return (

                                            <p className={styles.labelName} key={i}>{v.displayName}{v.unit}<span>{v.value}</span></p>

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
        } else if (deviceInfo[0].deviceTypeId == 2) { //水表
            return (
                <div>
                    <div className={styles.infoTitle}>
                        <p className={styles.deviceName}>{deviceInfo[0].name}</p>
                    </div>
                    {deviceInfo[0].isWarning ?
                        <div className={styles.infoContent}>
                            <p className={styles.warinngMsg}>设备网络断开，请重新连接网络</p>
                            <p className={styles.checkMore}><a>点击查看更多信息<span>>></span></a></p>
                        </div>
                        :
                        <div className={styles.infoContent}>
                            {
                                infoData.length == 0 ?
                                    <p>暂无数据</p>
                                    :
                                    infoData.map((v, i) => {
                                        return (

                                            <p className={styles.labelName} key={i}>{v.displayName}{v.unit}<span>{v.value}</span></p>

                                        )
                                    })

                            }
                            {/* <p className={styles.labelName}>
                                控制开关
                            <Switch defaultChecked />
                            </p> */}
                            <p className={styles.checkMore}><a>点击查看更多信息<span>>></span></a></p>
                        </div>
                    }
                </div>
            )
        } else if (deviceInfo[0].deviceTypeId == 3) { //电表
            return (
                <div>
                    <div className={styles.infoTitle}>
                        <p className={styles.deviceName}>{deviceInfo[0].name}</p>
                    </div>
                    {deviceInfo[0].isWarning ?
                        <div className={styles.infoContent}>
                            <p className={styles.warinngMsg}>设备网络断开，请重新连接网络</p>
                            <p className={styles.checkMore}><a>点击查看更多信息<span>>></span></a></p>
                        </div>
                        :
                        <div className={styles.infoContent}>
                            {
                                infoData.length == 0 ?
                                    <p>暂无数据</p>
                                    :
                                    infoData.map((v, i) => {
                                        return (

                                            <p className={styles.labelName} key={i}>{v.displayName}{v.unit}<span>{v.value}</span></p>

                                        )
                                    })

                            }
                            {/* <p className={styles.labelName}>
                                控制开关
                            <Switch defaultChecked />
                            </p> */}
                            <p className={styles.checkMore}><a>点击查看更多信息<span>>></span></a></p>
                        </div>
                    }
                </div>
            )
        }
    }
}