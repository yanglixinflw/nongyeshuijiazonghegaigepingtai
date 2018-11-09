import React, { Component, Fragment } from 'react';
import styles from './index.less'
import ysj from '../../assets/ysj.png'
import up from '../../assets/up.png'
import play from '../../assets/play.png'
import pause from '../../assets/pause.png'
import close from '../../assets/close.png'
import EZUIPlayer from '../../assets/ezuikit'
import classnames from 'classnames'
import { Dropdown, Select } from 'antd'
const Option = Select.Option
//开发地址
const envNet = 'http://192.168.30.127:88';
// post通用设置
const postOption = {
    method: 'POST',
    credentials: "include",
    mode: 'cors',
    headers: new Headers({
        'Content-Type': 'application/json',
    }),
}
// 获取视频列表
const getMonitorUrl = `${envNet}/api/CamerasMonitor/cameras`
export default class extends Component {
    constructor(props) {
        super(props)
        const { data, monitorList } = this.props
        // 下拉列表
        const selectList = data.data
        // 初始等待视频列表
        let awaitArray = monitorList.data.data
        this.state = {
            // 初始显示格数
            monitorNum: 9,
            // 格子数显示数组
            monitorArr: [],
            // 显示区域ClassName
            playBoxStyle: styles.playBox9,
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
            selectList
        }

    }
    componentDidMount() {
        // 渲染初始化格子
        this.setScreenNum(this.state.monitorNum)
        // let { awaitArray } = this.state
        // console.log(awaitArray)
        // // 实例化所有的player
        // let newPlayer = []
        // awaitArray.map((v, i) => {
        //     console.log(v.deviceId)
        //     // newPlayer.push(new EZUIPlayer(v.deviceId.toString()))
        // })
    }
    componentDidUpdate(){
        const {monitorArr}=this.state
        console.log(monitorArr)
        // 实例化监控
         let newPlayer=[]
         monitorArr.map((v, i) => {
             if(v.video){
                 console.log(v.video[0].deviceId.toString())
                //  newPlayer.push(new EZUIPlayer('CAM00001'))
                 newPlayer.push(new EZUIPlayer(v.video[0].deviceId))
             }
             
             
         })
    }
    // 设置画面数量
    setScreenNum(monitorNum) {
        let { playBoxStyle } = this.state
        let monitorArr = []
        for (let i = 1; i <= monitorNum; i++) {
            monitorArr.push({id:i,value:i})
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
        // console.log(monitorArr)
        this.setState({
            monitorArr,
            playBoxStyle
        })
    }
    //显示等待队列
    getAwaitArray(buildingId) {
        fetch(getMonitorUrl, {
            ...postOption,
            body: JSON.stringify({
                buildingId
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    if (v.ret == 1) {
                        this.setState({
                            awaitArray: v.data
                        })
                    }
                })
        })

    }
    //设置云台速度 
    setSpeed(speed) {
        this.setState({
            yuntaiSpeed: speed
        })
    }
    // 点击等待队列播放
    playHandler(deviceId) {
        const { awaitArray, monitorArr } = this.state
        // 要播放的视频
        let playVideo = awaitArray.filter(item => item.deviceId === deviceId)
        // 获取空余可以播放位置的序号
        let playOrder = []
        monitorArr.map((v, i) => {
            if(v.video==undefined){
                playOrder.push(i)
                return
            }
        })
        // console.log(monitorArr[playOrder[0]])
        monitorArr[playOrder[0]].video=playVideo
       
        this.setState({
            monitorArr
        })



    }
    // 获取焦点视频ID
    getFocousVideo(deviceId) {
        // console.log(deviceId)
            this.setState({
                controlVideoId: deviceId
            })

    }
    // 关闭视频
    closeVideo(deviceId){
        const {monitorArr}=this.state
        // console.log(deviceId)
    }
    render() {
        const { 
            monitorArr,
            playBoxStyle,
            yuntaiSpeed,
            controlPlay,
            controlVideoId,
            selectList,
            awaitArray
        } = this.state
        // console.log(monitorArr)
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
                                // console.log(v.video)
                                if (!v.video) {
                                    return (
                                        <div className={playBoxStyle} key={i}>
                                        </div>
                                    )
                                } else {
                                    // console.log(typeof v.video[0].deviceId)
                                    return (
                                        <div className={classnames(`${playBoxStyle}`, `${styles.video}`)}
                                            key={i}
                                            onFocus={() => this.getFocousVideo(v.video[0].deviceId)}
                                            tabIndex='0'
                                        >
                                            <div className={styles.closeButton} 
                                            onClick={()=>this.closeVideo(v.video[0].deviceId)}>
                                                <img src={close}></img>
                                            </div>
                                            <video 
                                            id= {v.video[0].deviceId} poster={v.video[0].coverUrl} controls playsInline autoPlay>
                                                <source src={v.video[0].playList.rtmp} type="rtmp/flv" />
                                                <source src={v.video[0].playList.hls} type="application/x-mpegURL" />
                                            </video>
                                        </div>
                                    )
                                }
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
                                    defaultValue={0}
                                    dropdownClassName={styles.dropdown}
                                    onSelect={(id) => this.getAwaitArray(id)}
                                >
                                    {selectList.length === 0
                                        ? <Option key='all' value={0}>全部</Option>
                                        : selectList.map((v, i) => {
                                            // console.log(selectList)
                                            return (
                                                <Option key={i} value={v.buildingId}>{v.name}({v.deviceCount}个)</Option>
                                            )
                                        })}

                                </Select>
                                <div className={styles.videoList}>
                                    {
                                        awaitArray.length === 0 ? null :
                                            awaitArray.map((v, i) => {
                                                // console.log(awaitArray)
                                                return (
                                                    <div
                                                        className={styles.videoCover}
                                                        key={i}
                                                        onClick={() => this.playHandler(v.deviceId)}
                                                        style={{ background: `url(${v.coverUrl})`, backgroundSize: 'cover' }}
                                                    >
                                                        <div className={styles.mask}>
                                                            <i className={classnames('dyhsicon', 'dyhs-bofang', `${styles.playButton}`)}></i>
                                                        </div>
                                                        <div className={styles.videoTitle}>{v.name}</div>
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
