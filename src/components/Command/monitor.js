import React, { Component, Fragment } from 'react';
import styles from './index.less'
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
            playBoxStyle:styles.playBox9,
            // 播放队列
            playArray: [],
            // 等待队列
            awaitArray: []
        }

    }
    componentDidMount() {
        // 渲染初始化格子
        this._getInitBox()
    }
    // 格子处理函数
    _getInitBox() {
        const { monitorNum } = this.state
        let {playBoxStyle}=this.state
        let monitorArr = []
        for (let i = 1; i <= monitorNum; i++) {
            monitorArr.push(i)
        }
        if(monitorNum===9){
            playBoxStyle=styles.playBox9
        }
        if(monitorNum===4){
            playBoxStyle=styles.playBox4
        }
        if(monitorNum===1){
            playBoxStyle=styles.playBox1
        }
        this.setState({
            monitorArr,
            playBoxStyle
        })
    }
    render() {
        const { monitorArr ,playBoxStyle} = this.state
        return (
            <Fragment>
                <div className={styles.header}>
                    <span>|</span>视频监控
                </div>
                <div className={styles.allScreen}>
                {/* 播放区域 */}
                    <div className={styles.playArea}>
                    {monitorArr.map((v,i)=>{
                        return(
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
                                <div className={styles.operateButton}>左上</div>
                                <div className={styles.operateButton}>上</div>
                                <div className={styles.operateButton}>右上</div>
                                <div className={styles.operateButton}>左</div>
                                <div className={styles.operateButton}>中间</div>
                                <div className={styles.operateButton}>右</div>
                                <div className={styles.operateButton}>左下</div>
                                <div className={styles.operateButton}>下</div>
                                <div className={styles.operateButton}>右下</div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}
