import React, { Component } from 'react';
import styles from './mapControl.less';
export default class extends Component {
    constructor(props) {
        super(props)
        const { markers } = props;
        if (!markers) {
            return null
        }
        const { deviceTypeId, status } = markers;
        this.state = {
            markers,
            deviceTypeId,
            status
        }

    }
    render() {
        const { markers, deviceTypeId, status } = this.state;
        // console.log(info)
        if (deviceTypeId == 5) {
            return (
                <div className={styles.markerCamera}>
                    <i className={styles.normal}></i>
                </div>

            )
        } else if (deviceTypeId == 2) {
            return (
                <div className={styles.markerWaterM}>
                    <i className={styles.normal}></i>
                </div>

            )
        } else if (deviceTypeId == 3) {
            return (
                <div className={styles.markerEleMeter}>
                    <i className={styles.normal}></i>
                </div>

            )
        } else if (deviceTypeId == 1) {
            return (
                <div className={styles.markerWaterV}>
                    {
                        status == 0 ?
                            <i className={styles.valveClose}></i>
                            :
                            <i className={styles.valveOpen}></i>
                    }
                </div>

            )
        }

    }
}