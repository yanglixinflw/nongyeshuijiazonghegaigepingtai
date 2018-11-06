import React, { Component } from 'react';
import styles from './autoRules.less';
import { Input, Button, Form, Select,Icon} from 'antd';
import {Link} from 'dva/router';
const Option = Select.Option;
export default class extends Component {
    constructor(props) {
        super(props)
        this.state={
            ab:123
        }
    }
    render() {
        return (
            <React.Fragment>
                <div className={styles.headers}>
                    <div className={styles.left}>
                        <Link to={`/dcs/automation`}>
                            <div className={styles.arrowLeft}>
                                <Icon type="arrow-left" theme="outlined" style={{marginTop:'22px',fontSize:'18px'}}/>
                                <div>自动化控制</div>
                            </div>
                        </Link>
                        <Link to={`/automation/autoRules`}>
                            <div className={styles.autoControl}>
                                <div>/</div>
                                <div className={styles.autoRules}>设置自动化规则</div>
                            </div>
                        </Link>
                    </div>
                    <div className={styles.right}>
                        <Button
                            icon='reload'
                            className={styles.fnButton}
                            onClick={() => this._resetForm()}
                        >
                            重置
                        </Button>
                        <Button
                            className={styles.fnButton}
                            icon="save"
                            onClick={() => this._save()}
                        >
                            保存
                        </Button>
                    </div>
                </div>
                <div className={styles.mbody}>
                    <div className={styles.impoundRules}>
                        <div className={styles.rulesName}>蓄水池自动化蓄水规则</div>
                        <div className={styles.border}></div>
                    </div>
                    <div className={styles.judge}>
                        <div className={styles.if}>条件</div>
                        <Form>
                            <Form.Item>
                                <Select defaultValue="all">
                                    <Option value="all">全部条件</Option>
                                </Select>
                            </Form.Item>
                            <div>
                                <Form.Item>
                                    <Input placeholder="设备名称/ID"/>
                                </Form.Item>
                                <Form.Item>
                                    <Select defaultValue="power">
                                        <Option value="power">电量</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item>
                                    <Select defaultValue="judge">
                                        <Option value="judge">判断</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item>
                                    <Input placeholder="值"/>
                                </Form.Item>
                            </div>
                        </Form>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
