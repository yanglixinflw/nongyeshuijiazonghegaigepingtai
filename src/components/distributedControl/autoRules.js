import React, { Component } from 'react';
import styles from './autoRules.less';
import { Input, Button, Form, Select,Icon} from 'antd';
import {Link} from 'dva/router';
const Option = Select.Option;
export default class extends Component {
    constructor(props) {
        super(props)
        this.state={
            
        }
    }
    //删除一行
    remove(k){
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
          return;
        }
    
        // can use data-binding to set
        form.setFieldsValue({
          keys: keys.filter(key => key !== k),
        });
    }
    //添加一行
    add(){
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(keys.length);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
          keys: nextKeys,
        });
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
                        <SearchForm
                            wrappedComponentRef={(searchForm) => this.searchForm = searchForm}
                        />
                    </div>
                    <div className={styles.execute}>
                        <div>执行</div>
                        <DoForm
                            wrappedComponentRef={(doForm) => this.doForm = doForm}
                        />
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

//搜索表单
const SearchForm = Form.create()(
    class extends React.Component {
        render() {
            const { getFieldDecorator, getFieldValue } = this.props.form;
            getFieldDecorator('keys', { initialValue: [] });
            const keys = getFieldValue('keys');
            const formItems = keys.map((k, index) => {
                return (
                    <div className={styles.line}  key={k}>
                        <Form.Item className={styles.search}>
                            {getFieldDecorator(`deviceId[${k}]`, {initialValue:''})
                                (<Input placeholder="设备名称/ID"/>)
                            }
                        </Form.Item>
                        <Form.Item className={styles.search}>
                            {getFieldDecorator(`what[${k}]`, {initialValue:'power'})
                                (<Select>
                                    <Option value="power">电量</Option>
                                    <Option value="water">水量</Option>
                                    <Option value="state">状态</Option>
                                </Select>)
                            }
                        </Form.Item>
                        <Form.Item className={styles.end}>
                            {getFieldDecorator(`condition[${k}]`, {initialValue:'judge'})
                                (<Select>
                                    <Option value="judge">判断</Option>
                                    <Option value="high">&gt;</Option>
                                    <Option value="low">&lt;</Option>
                                    <Option value="equal">=</Option>
                                    <Option value="heq">&gt;=</Option>
                                    <Option value="leq">&lt;=</Option>
                                    <Option value="neq">≠</Option>
                                </Select>)
                            }
                        </Form.Item>
                        <Form.Item className={styles.end}>
                            {getFieldDecorator(`value[${k}]`, {initialValue:''})
                                (<Input placeholder="值"/>)
                            }
                        </Form.Item>
                        <Icon 
                            type="plus-circle" 
                            theme="filled" 
                            disabled={keys.length === 1}
                            onClick={() => this.remove(k)}
                        />
                    </div>
                );
              });
            return (
                <Form className={styles.form}>
                    <Form.Item className={styles.all}>
                        {getFieldDecorator('condition', {initialValue:'all'})
                            (
                            <Select>
                                <Option value="all">全部条件</Option>
                            </Select>
                            )
                        }
                    </Form.Item>
                    <div className={styles.line}>
                        <Form.Item className={styles.search}>
                            {getFieldDecorator('deviceId', {initialValue:''})
                                (
                                <Input placeholder="设备名称/ID"/>
                                )
                            }
                        </Form.Item>
                        <Form.Item className={styles.search}>
                            {getFieldDecorator('state', {initialValue:'power'})
                                (
                                <Select>
                                    <Option value="power">电量</Option>
                                    <Option value="water">水量</Option>
                                    <Option value="state">状态</Option>
                                </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item className={styles.end}>
                            {getFieldDecorator('judge', {initialValue:'judge'})
                                (
                                <Select>
                                    <Option value="judge">判断</Option>
                                    <Option value="high">&gt;</Option>
                                    <Option value="low">&lt;</Option>
                                    <Option value="equal">=</Option>
                                    <Option value="heq">&gt;=</Option>
                                    <Option value="leq">&lt;=</Option>
                                    <Option value="neq">≠</Option>
                                </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item className={styles.end}>
                            {getFieldDecorator('value', {initialValue:''})
                                (
                                <Input placeholder="值"/>
                                )
                            }
                        </Form.Item>
                        <Icon 
                            type="minus-circle" 
                            theme="filled" 
                            disabled={keys.length === 1}
                            onClick={() => this.remove(k)}
                        />
                    </div>
                    {formItems}
                    <div className={styles.line}>
                        <Form.Item className={styles.search}>
                            {getFieldDecorator('deviceId', {initialValue:''})
                                (
                                <Input placeholder="设备名称/ID"/>
                                )
                            }
                        </Form.Item>
                        <Form.Item className={styles.search}>
                            {getFieldDecorator('state', {initialValue:'power'})
                                (
                                <Select>
                                    <Option value="param1">参数1</Option>
                                    <Option value="param2">参数2</Option>
                                </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item className={styles.end}>
                            {getFieldDecorator('judge', {initialValue:'judge'})
                                (
                                <Select>
                                    <Option value="judge">判断</Option>
                                    <Option value="high">&gt;</Option>
                                    <Option value="low">&lt;</Option>
                                    <Option value="equal">=</Option>
                                    <Option value="heq">&gt;=</Option>
                                    <Option value="leq">&lt;=</Option>
                                    <Option value="neq">≠</Option>
                                </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item className={styles.end}>
                            {getFieldDecorator('value', {initialValue:''})
                                (
                                <Input placeholder="值"/>
                                )
                            }
                        </Form.Item>
                        <Icon 
                            type="plus-circle" 
                            theme="filled" 
                            onClick={() => this.add()}/>
                    </div>
                </Form>
            )
        }
    }
)
//执行表单
const DoForm = Form.create()(
    class extends React.Component {
        render() {
            const { form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Form className={styles.form}>
                    <Form.Item className={styles.search}>
                        {getFieldDecorator('deviceId', {initialValue:''})
                            (<Input placeholder="设备名称/ID"/>)
                        }
                    </Form.Item>
                    <Form.Item className={styles.search}>
                       {getFieldDecorator('switch', {initialValue:'open'})
                            (<Select>
                                <Option value="open">开阀</Option>
                                <Option value="close">关阀</Option>
                            </Select>)
                        }
                    </Form.Item>
                    <Icon 
                        type="minus-circle" 
                        theme="filled" 
                        onClick={() => this.remove(k)}/>
                </Form>
            )
        }
    }
)