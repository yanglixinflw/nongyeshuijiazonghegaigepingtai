import React, { Component } from 'react';
import styles from './addWarningRules.less';
import { Input, Button, Form, Select, Icon } from 'antd';
import { Link } from 'dva/router';
const Option = Select.Option;
const frequency = {

}
export default class extends Component {
    // constructor(props) {
    //     super(props)
    componentDidMount() { }
    render() {
        return (
            <React.Fragment>
                <div className={styles.headers}>
                    <div className={styles.left}>
                        <Link to={`/messageManagement/warningRules`}>
                            <div className={styles.arrowLeft}>
                                <Icon type="arrow-left" theme="outlined" style={{ marginTop: '22px', fontSize: '18px' }} />
                                <div>预警规则</div>
                            </div>
                        </Link>
                        <div className={styles.warningRules}>
                            <div>/</div>
                            <div className={styles.addRules}>添加预警规则</div>
                        </div>
                    </div>
                </div>

                <div className={styles.mbody}>
                    <div className={styles.Rules}>
                        <span className={styles.rulesName}>添加预警规则</span>
                    </div>
                    <AddForm
                        wrappedComponentRef={(addForm) => this.addForm = addForm}
                    />
                </div>
            </React.Fragment>
        )
    }
}
//添加表单
const AddForm = Form.create()(
    class extends React.Component {
        render() {
            const { getFieldDecorator } = this.props.form;
            return (
                <Form className={styles.form}>
                    <div className={styles.head}>
                        <div className={styles.flag}></div>
                        <input className={styles.formRule} placeholder='请设置预警规则名称' />
                    </div>
                    <div className={styles.type1}>
                        <div className={styles.based}>条件</div>
                        <div className={styles.type}>
                            <div className={styles.typeName}>类型</div>
                            <Form.Item className={styles.standard1}>
                                {getFieldDecorator('type', { initialValue: 'fn' })
                                    (<Select>
                                        <Option value="fn">功能预警</Option>
                                        <Option value="run">运营预警</Option>
                                    </Select>)
                                }
                            </Form.Item>
                        </div>
                        <div className={styles.limited}>
                            <div className={styles.limitedName}>判断规则</div>
                            <Form.Item className={styles.standard1}>
                                {getFieldDecorator('param', { initialValue: 'param1' })
                                    (<Select>
                                        <Option value="param1">参数1</Option>
                                        <Option value="param2">参数2</Option>
                                    </Select>)
                                }
                            </Form.Item>
                            <Form.Item className={styles.standard2}>
                                {getFieldDecorator('condition', { initialValue: 'judge' })
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
                            <Form.Item className={styles.standard2}>
                                {getFieldDecorator('value', { initialValue: '' })
                                    (<Input placeholder="值" type='number' />)
                                }
                            </Form.Item>
                        </div>
                    </div>
                    <div className={styles.type1}>
                        <div className={styles.based}>短信</div>
                        <div className={styles.type}>
                            <div className={styles.typeName}>频率</div>
                            <Form.Item className={styles.standard1}>
                                {getFieldDecorator('noteInfo', { initialValue: 'no' })
                                    (<Select>
                                        <Option value="no">不通知</Option>
                                        <Option value="one">仅通知一次</Option>
                                        <Option value="five">五分钟通知一次</Option>
                                    </Select>)
                                }
                            </Form.Item>
                        </div>
                        <div className={styles.limited}>
                            <div className={styles.limitedName}>通知人</div>
                            <Form.Item className={styles.standard1}>
                                {getFieldDecorator('notePeople', { initialValue: 'people1' })
                                    (<Select>
                                        <Option value="people1">慧水老李</Option>
                                        <Option value="people2">慧水老王</Option>
                                    </Select>)
                                }
                            </Form.Item>
                            <Form.Item className={styles.standard3}>
                                {getFieldDecorator('noteOther', { initialValue: '' })
                                    (<Input placeholder="需通知的其他人" type='text' />)
                                }
                            </Form.Item>
                        </div>
                    </div>
                    <div className={styles.type1}>
                        <div className={styles.based}>电话</div>
                        <div className={styles.type}>
                            <div className={styles.typeName}>频率</div>
                            <Form.Item className={styles.standard1}>
                                {getFieldDecorator('phoneInfo', { initialValue: 'no' })
                                    (<Select>
                                        <Option value="no">不通知</Option>
                                        <Option value="one">仅通知一次</Option>
                                        <Option value="five">五分钟通知一次</Option>
                                    </Select>)
                                }
                            </Form.Item>
                        </div>
                        <div className={styles.limited}>
                            <div className={styles.limitedName}>通知人</div>
                            <Form.Item className={styles.standard1}>
                                {getFieldDecorator('phonePeople', { initialValue: 'people1' })
                                    (<Select>
                                        <Option value="people1">慧水老李</Option>
                                        <Option value="people2">慧水老王</Option>
                                    </Select>)
                                }
                            </Form.Item>
                            <Form.Item className={styles.standard3}>
                                {getFieldDecorator('phoneOther', { initialValue: '' })
                                    (<Input placeholder="需通知的其他人" type='text' />)
                                }
                            </Form.Item>
                        </div>
                    </div>
                    <div className={styles.type1}>
                        <div className={styles.based}>通知</div>
                        <div className={styles.type}>
                            <div className={styles.typeName}>通知范围</div>
                            <Form.Item className={styles.standard1}>
                                {getFieldDecorator('range', { initialValue: 'all' })
                                    (<Select>
                                        <Option value="all">全部</Option>
                                        <Option value="ordinary">一般管理员</Option>
                                        <Option value="super">超级管理员</Option>
                                    </Select>)
                                }
                            </Form.Item>
                        </div>
                    </div>
                    <div className={styles.type1}>
                        <div className={styles.based}>通知内容</div>
                        <div className={styles.type}>
                            <div className={styles.typeName}>通知内容</div>
                            <Form.Item className={styles.standard4}>
                                {getFieldDecorator('content', { initialValue: 'all' })
                                    (<Select>
                                        <Option value="all">没钱啦</Option>
                                        <Option value="ordinary">没电啦</Option>
                                        <Option value="super">坏啦</Option>
                                    </Select>)
                                }
                            </Form.Item>
                        </div>
                    </div>
                    <div className={styles.type1}>
                        <div className={styles.based}>控制</div>
                        <div className={styles.type}>
                            <div className={styles.typeName}>关联设备</div>
                            <Form.Item className={styles.standard5}>
                                {getFieldDecorator('deviceId', { initialValue: '设备名称/ID' })
                                    (<Select>
                                        <Option value="water">宁围街道水表</Option>
                                        <Option value="elect">宁围街道电表</Option>
                                    </Select>)
                                }
                            </Form.Item>
                            <Form.Item className={styles.standard1}>
                                {getFieldDecorator('info', { initialValue: '请选择指令' })
                                    (<Select>
                                        <Option value="open">慧水老李</Option>
                                        <Option value="close">慧水老王</Option>
                                    </Select>)
                                }
                            </Form.Item>
                        </div>
                    </div>
                    <div className={styles.borderBot}></div>
                    <div className={styles.fn}>
                        <Button
                            className={styles.save}
                            // onClick={() => this.save(record.userId)}
                            icon='delete'
                        >
                            删除
                        </Button>
                        <Button
                            className={styles.delete}
                            // onClick={()=>this._deleteInfo(record.userId)}
                            icon='edit'
                        >
                            修改
                        </Button>

                    </div>
                </Form>
            )
        }
    }
)