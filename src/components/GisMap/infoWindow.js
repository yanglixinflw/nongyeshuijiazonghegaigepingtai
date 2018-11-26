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
        const {info} = this.props
        if(info.length == 0){
            return null
        }
        const {infoData} =this.props
        if (info[0].deviceTypeId == 5) {   //摄像头
            return (
                <div>
                    {info[0].isWarning ?
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
        } else if (info[0].deviceTypeId == 1) {  //球阀
            return (
                <div>
                    <div className={styles.infoTitle}>
                        <p className={styles.deviceName}>{info[0].name}</p>
                    </div>
                    {info[0].isWarning ?
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
                                    let result =[]
                                    for(let key in v){
                                        result.push(
                                            <div>
                                                <p className={styles.labelName} key={key}>{key}<span>{v[key]}</span></p>
                                            </div>
                                        )
                                            
                                        
                                    }
                                   return result
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
        } else if (info[0].deviceTypeId == 2){ //水表
            return (
                <div>
                    <div className={styles.infoTitle}>
                        <p className={styles.deviceName}>{info[0].name}</p>
                    </div>
                    {info[0].isWarning ?
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
                                    let result =[]
                                    for(let key in v){
                                        result.push(
                                            <div>
                                                <p className={styles.labelName} key={key}>{key}<span>{v[key]}</span></p>
                                            </div>
                                        )
                                            
                                        
                                    }
                                   return result
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
        }else if (info[0].deviceTypeId == 3){ //电表
            return (
                <div>
                    <div className={styles.infoTitle}>
                        <p className={styles.deviceName}>{info[0].name}</p>
                    </div>
                    {info[0].isWarning ?
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
                                    let result =[]
                                    for(let key in v){
                                        result.push(
                                            <div>
                                                <p className={styles.labelName} key={key}>{key}<span>{v[key]}</span></p>
                                            </div>
                                        )
                                            
                                        
                                    }
                                   return result
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