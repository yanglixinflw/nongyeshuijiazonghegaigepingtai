import React, { Component, Fragment } from 'react';
import styles from './index.less'
import ysj from '../../assets/ysj.png'
import up from '../../assets/up.png'
import classnames from 'classnames'
import { Menu, Dropdown } from 'antd'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // 初始显示格数
            monitorNum: 9,
            // monitorNum: 4,
            // monitorNum: 1,
            // 显示数组
            monitorArr: [],
            // 显示区域ClassName
            playBoxStyle: styles.playBox9,
            // 播放队列
            playArray: [],
            // 等待队列
            awaitArray: [],
            // 云台速度
            yuntaiSpeed:"慢"
        }
    }
    componentDidMount() {
        // 渲染初始化格子
        this.setScreenNum(this.state.monitorNum)
    }
    // 设置画面数量
    setScreenNum(monitorNum) {

        let { playBoxStyle } = this.state
        let monitorArr = []
        for (let i = 1; i <= monitorNum; i++) {
            monitorArr.push(i)
        }
        if (monitorNum === 9) {
            playBoxStyle = styles.playBox9
        }
        if (monitorNum === 4) {
            playBoxStyle = styles.playBox4
        }
        if (monitorNum === 1) {
            playBoxStyle = styles.playBox1
        }
        this.setState({
            monitorArr,
            playBoxStyle
        })
    }
    //设置云台速度 
    setSpeed(speed){
        this.setState({
            yuntaiSpeed:speed
        })
    }
    render() {
        const { monitorArr, playBoxStyle,yuntaiSpeed } = this.state
        // 云台速度选择
        const speed = (
            <div className={styles.speedList}>
                <div onClick={()=>this.setSpeed('慢')}>慢</div>
                <div onClick={()=>this.setSpeed('中')} style={{borderBottom:'1px #515C9F solid',borderTop:'1px #515C9F solid'}}>中</div>
                <div onClick={()=>this.setSpeed('快')}>快</div>
            </div>
        )
        return (
            <Fragment >
                <div className={styles.header}>
                    <span>|</span>视频监控
                </div>
                <div className={styles.allBody}>
                    <div className={styles.allScreen}>
                        {/* 播放区域 */}
                        <div className={styles.playArea}>
                            {monitorArr.map((v, i) => {
                                return (
                                    <div className={playBoxStyle} key={v}>
                                        {v}
                                    </div>
                                )
                            })}
                        </div>
                        {/* 操作区域 */}
                        <div className={styles.operateArea}>
                            <div className={styles.picOperate}>
                                <div className={styles.operateLeft}>
                                    <div className={styles.operateButton}>
                                        <img src={ysj} title='左上移动'
                                            style={{ transform: 'rotate(-90deg)' }}
                                        />
                                    </div>
                                    <div className={styles.operateButton}>
                                        <img src={up} title='向上移动'
                                        />
                                    </div>
                                    <div className={styles.operateButton}>
                                        <img src={ysj} title='右上移动'

                                        />
                                    </div>
                                    <div className={styles.operateButton}>
                                        <img src={up} title='向左移动'
                                            style={{ transform: 'rotate(-90deg)' }}
                                        />
                                    </div>
                                    <div className={styles.operateButton}></div>
                                    <div className={styles.operateButton}>
                                        <img src={up} title='向右移动'
                                            style={{ transform: 'rotate(90deg)' }}
                                        />
                                    </div>
                                    <div className={styles.operateButton}>
                                        <img src={ysj} title='左下移动'
                                            style={{ transform: 'rotate(180deg)' }}
                                        />
                                    </div>
                                    <div className={styles.operateButton}>
                                        <img src={up} title='向下移动'
                                            style={{ transform: 'rotate(180deg)' }}
                                        />
                                    </div>
                                    <div className={styles.operateButton}>
                                        <img src={ysj} title='右下移动'
                                            style={{ transform: 'rotate(90deg)' }}
                                        />
                                    </div>
                                </div>
                                <div className={styles.operateRight}>
                                    <div 
                                    onClick={()=>this.setScreenNum(1)}
                                    className={styles.operateIcon}>
                                        <div>
                                            <i className={classnames('dyhsicon', 'dyhs-danhuamian', `${styles.picIcon}`)}></i>
                                        </div>
                                        <span>单画面</span>
                                    </div>
                                    <div 
                                    onClick={()=>this.setScreenNum(4)}
                                    className={styles.operateIcon}>
                                        <div>
                                            <i className={classnames('dyhsicon', 'dyhs-sihuamian', `${styles.picIcon}`)}></i>
                                        </div>
                                        <span>四画面</span>

                                    </div>
                                    <div 
                                    onClick={()=>this.setScreenNum(9)}
                                    className={styles.operateIcon}>
                                        <div>
                                            <i className={classnames('dyhsicon', 'dyhs-jiuhuamian', `${styles.picIcon}`)}></i>
                                        </div>
                                        <span>九画面</span>

                                    </div>
                                    <div className={styles.operateIcon}>
                                        <Dropdown 
                                        overlay={speed} 
                                        // trigger={['click']}
                                        
                                        >
                                            <i className={classnames('dyhsicon', 'dyhs-yuntaisudu', `${styles.picIcon}`, `${styles.speedIcon}`)}>
                                                <span className={styles.speed}>{yuntaiSpeed}</span>
                                            </i>
                                        </Dropdown>
                                        <span style={{
                                            position: 'relative',
                                            left: '-56px',
                                            top: '28px'
                                        }}>云台速度
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}
