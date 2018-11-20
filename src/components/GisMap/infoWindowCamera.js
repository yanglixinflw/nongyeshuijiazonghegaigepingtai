import React, { Component } from 'react';
import styles from './index.less';
import classnames from 'classnames'
export default class extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { info } = this.props
        if (info.length == 0) {
            return null
        }
        const { isWarning } = info[0]
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

    }
}