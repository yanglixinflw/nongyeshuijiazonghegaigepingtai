import React, { Component, Fragment } from 'react';
import styles from './index.less'
import ysj from '../../assets/ysj.png'
import up from '../../assets/up.png'
import play from '../../assets/play.png'
import pause from '../../assets/pause.png'
import EZUIPlayer from '../../assets/ezuikit'
import classnames from 'classnames'
import { Dropdown, Select } from 'antd'
const Option = Select.Option
const mockselectList = [
    {
        id: 'all', count: 10, name: '全部'
    },
    {
        id: '1', count: 1, name: '井'
    },
    {
        id: '2', count: 1, name: '田'
    },
    {
        id: "3", count: 1, name: '水'
    },
    {
        id: "4", count: 5, name: '家'
    },
    {
        id: "5", count: 5, name: '库房'
    },
]
export default class extends Component {
    constructor(props) {
        super(props)
        // 初始等待队列
        let initAwit = mockselectList.filter(item => item.id === 'all')
        let count = initAwit[0].count
        let awaitArray = []
        for (let i = 1; i <= count; i++) {
            awaitArray.push({id:i,value:i})
        }
        this.state = {
            // 初始显示格数
            monitorNum: 9,
            // 格子数显示数组
            monitorArr: [],
            // 显示区域ClassName
            playBoxStyle: styles.playBox9,
            // 播放队列
            playArray: [],
            // 等待队列
            awaitArray,
            // 云台速度
            yuntaiSpeed: "慢",
            // 受控视频
            controlVideoId: "",
            // controlVideoId:'1',
            // 受控视频播放状态
            controlPlay: true,
            // 下拉选项列表
            selectList: mockselectList
        }

    }
    componentDidMount() {
        // 渲染初始化格子
        this.setScreenNum(this.state.monitorNum)
        // let { awaitArray } = this.state
        // 实例化所有的player
        // let newPlayer = []
        // awaitArray.map((v, i) => {
        //     // console.log(v)
        //     newPlayer.push(new EZUIPlayer(v.toString()))
        // })
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
    //显示等待队列
    getAwaitArray(selectId) {
        const {selectList}=this.state
        let initAwit = selectList.filter(item => item.id === selectId)
        let count = initAwit[0].count
        let awaitArray = []
        for (let i = 1; i <= count; i++) {
            awaitArray.push({id:i,value:i})
        }
        this.setState({
            awaitArray
        })
    }
    //设置云台速度 
    setSpeed(speed) {
        this.setState({
            yuntaiSpeed: speed
        })
    }
    render() {
        const { monitorArr,
            playBoxStyle,
            yuntaiSpeed,
            controlPlay,
            controlVideoId,
            selectList,
            awaitArray
        } = this.state
        // console.log(awaitArray)
        // 云台速度选择
        const speed = (
            <div className={styles.speedList}>
                <div onClick={() => this.setSpeed('慢')}>慢</div>
                <div onClick={() => this.setSpeed('中')} style={{ borderBottom: '1px #515C9F solid', borderTop: '1px #515C9F solid' }}>中</div>
                <div onClick={() => this.setSpeed('快')}>快</div>
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
                                // console.log(v)
                                return (
                                    <div className={playBoxStyle} key={i} onClick={()=>{
                                        console.log(v)
                                    }}>
                                        {v}
                                    </div>
                                )
                            })}
                        </div>
                        {/* 操作区域 */}
                        <div className={styles.operateArea}>
                            <div className={styles.operateTop}>
                                <div
                                    onClick={() => this.setScreenNum(1)}
                                    className={styles.operateIcon}>
                                    <div>
                                        <i className={classnames('dyhsicon', 'dyhs-danhuamian', `${styles.picIcon}`)}></i>
                                    </div>
                                    <span>单画面</span>
                                </div>
                                <div
                                    onClick={() => this.setScreenNum(4)}
                                    className={styles.operateIcon}>
                                    <div>
                                        <i className={classnames('dyhsicon', 'dyhs-sihuamian', `${styles.picIcon}`)}></i>
                                    </div>
                                    <span>四画面</span>

                                </div>
                                <div
                                    onClick={() => this.setScreenNum(9)}
                                    className={styles.operateIcon}>
                                    <div>
                                        <i className={classnames('dyhsicon', 'dyhs-jiuhuamian', `${styles.picIcon}`)}></i>
                                    </div>
                                    <span>九画面</span>

                                </div>
                                <div className={styles.operateIcon}>
                                    <Dropdown
                                        overlay={speed}
                                        trigger={['click']}
                                        // disabled={false}
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
                                    <div className={styles.operateButton}>
                                        {controlVideoId == '' ? null :
                                            <img
                                                src={controlPlay ? pause : play} title={controlPlay ? '暂停' : '播放'}
                                            />
                                        }
                                    </div>
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
                                    <div className={styles.operateAdd}>
                                        <div className={styles.plus}>
                                            <i className={classnames('dyhsicon', 'dyhs-fangda')}>
                                            </i>
                                        </div>
                                        <div>画面</div>
                                        <div className={styles.minus}>
                                            <i className={classnames('dyhsicon', 'dyhs-suoxiao')}>
                                            </i>
                                        </div>
                                    </div>
                                    <div className={styles.operateAdd}>
                                        <div className={styles.plus}>
                                            <i className={classnames('dyhsicon', 'dyhs-fangda')}>
                                            </i>
                                        </div>
                                        <div>焦距</div>
                                        <div className={styles.minus}>
                                            <i className={classnames('dyhsicon', 'dyhs-suoxiao')}>
                                            </i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.videoArea}>
                                <Select
                                    defaultValue="all"
                                    dropdownClassName={styles.dropdown}
                                    onSelect={(id) => this.getAwaitArray(id)}
                                >
                                    {selectList.length === 0
                                        ? <Option key='all' value='all'>全部</Option>
                                        : selectList.map((v, i) => {
                                            return (
                                                <Option key={i} value={v.id}>{v.name}({v.count}个)</Option>
                                            )
                                        })}

                                </Select>
                                <div className={styles.videoList}>
                                    {
                                        awaitArray.length === 0 ? null :
                                            awaitArray.map((v, i) => {
                                                return (
                                                    <div className={styles.video} key={i}>
                                                        <div className={styles.mask}>
                                                        <i className={classnames('dyhsicon', 'dyhs-bofang',`${styles.playButton}`)}></i>
                                                        </div>
                                                        <div className={styles.videoTitle}>第个{v.id}摄像头</div>
                                                    </div>
                                                )

                                            })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}
