import React, { Component } from 'react';
import BreadcrumbView from '../PageHeader/breadcrumb';
import { Button } from 'antd';
import styles from './common.less';
export default class extends Component {
    constructor(props) {
        super(props)
        // const { ballhistory } = props;
        // const { data } = ballhistory.data;
        // const total = meteorologyhistory.data.length;

    }
    render() {
        return (
            <div className={styles.history}>
                <div className={styles.header}>
                    <Button icon="arrow-left"></Button>
                    <BreadcrumbView
                        {...this.props}
                        className={styles.breadcrumb}
                    />
                </div>
            </div>
        )

    }
}