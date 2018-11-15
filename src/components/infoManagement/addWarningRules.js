import React, { Component } from 'react';
import styles from './addWarningRules.less';
import { Input, Button, Form, Select, Icon } from 'antd';
import { Link } from 'dva/router';
const Option = Select.Option;
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
                <div className={styles.warningDetail}>
                    <div className={styles.title}>
                        <span className={styles.rulesName}>添加预警规则</span>
                    </div>
                    <div className={styles.content}>
                        {/* 添加表单 */}
                        
                            <AddRulesForm
                                wrappedComponentRef={(addRulesForm) => this.addRulesForm = addRulesForm}
                                onDelete={() => this._addDeleteHandler()}
                                onSave={() => this._addSaveHandler()}
                            />
                    </div>
                </div>

            </React.Fragment>
        )
    }
}
//添加自定义规则表单
const AddRulesForm = Form.create()(
    class extends React.Component {
        render() {
            const { form, onSave, onDelete } = this.props;
            const { getFieldDecorator } = form;
            const Option = Select.Option;
            return (
                <Form layout='inline' className={styles.addForm}>
                    <div className={styles.formTitle}>
                        <div className={styles.formName}>
                            <Form.Item>
                                {getFieldDecorator('warningTitle', {
                                    initialValue: '',
                                })(
                                    <Input
                                        placeholder="请输入预警规则名称"
                                    />
                                )}
                            </Form.Item>
                        </div>
                    </div>
                    <div className={styles.formContent}>
                        <div className={styles.items}>
                            <div className={styles.itemName1}>条件</div>
                            <Form.Item label='类型'>
                                {getFieldDecorator('warningType', {
                                    initialValue: '0',
                                })(
                                    <Select>
                                        <Option key='0'>功能预警</Option>
                                        <Option key='1'>运营预警</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label='判断规则' className={styles.judgmentRule}>
                                <Form.Item>
                                    {getFieldDecorator('params', {
                                        initialValue: '',
                                    })(
                                        <Select
                                            className={styles.params}
                                        >
                                            <Option value=''>参数1</Option>
                                        </Select>
                                    )}

                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('judge', {
                                        initialValue: ''
                                    })(
                                        <Select
                                            className={styles.judge}
                                        >
                                            <Option value=''>判断</Option>
                                            <Option key='='>=</Option>
                                            <Option key='>'>></Option>
                                            <Option key='<'>{'<'}</Option>
                                            <Option key='<='>{'<='}</Option>
                                            <Option key='>='>{'>='}</Option>
                                            <Option key='≠'>{'≠'}</Option>
                                        </Select>
                                    )}

                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('judgeValue', {
                                        initialValue: ''
                                    })(
                                        <Input
                                            placeholder='值'
                                        />
                                    )}
                                </Form.Item>
                            </Form.Item>
                        </div>
                        <div className={styles.items}>
                            <div className={styles.itemName1}>短信</div>
                            <Form.Item label='频率'>
                                {getFieldDecorator('SMSRate', {
                                    initialValue: '0',
                                })(
                                    <Select>
                                        <Option key='0'>不通知</Option>
                                        <Option key='1'>仅通知一次</Option>
                                        <Option key='2'>1小时通知一次</Option>
                                        <Option key='3'>12小时通知一次</Option>
                                        <Option key='4'>一天通知一次</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label='通知人' className={styles.informer}>
                                <Form.Item>
                                    {getFieldDecorator('SMSInformer', {
                                        initialValue: ''
                                    })(
                                        <Select>

                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('otherSMSInformer', {
                                        initialValue: ''
                                    })(
                                        <Input
                                            placeholder='需通知的其他联系人'
                                        />
                                    )}
                                </Form.Item>
                            </Form.Item>
                        </div>
                        <div className={styles.items}>
                            <div className={styles.itemName1}>电话</div>
                            <Form.Item label='频率'>
                                {getFieldDecorator('phoneRate', {
                                    initialValue: '0',
                                })(
                                    <Select>
                                        <Option key='0'>不通知</Option>
                                        <Option key='1'>仅通知一次</Option>
                                        <Option key='2'>1小时通知一次</Option>
                                        <Option key='3'>12小时通知一次</Option>
                                        <Option key='4'>一天通知一次</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label='通知人' className={styles.informer}>
                                <Form.Item>
                                    {getFieldDecorator('phoneInformer', {
                                        initialValue: ''
                                    })(
                                        <Select>

                                        </Select>
                                    )}

                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('otherPhoneInformer', {
                                        initialValue: ''
                                    })(
                                        <Input
                                            placeholder='需通知的其他联系人'
                                        />
                                    )}
                                </Form.Item>

                            </Form.Item>
                        </div>
                        <div className={styles.items}>
                            <div className={styles.itemName2}>通知</div>
                            <Form.Item label='通知范围' >
                                {getFieldDecorator('informRange', {
                                    //initialValue: '',
                                })(
                                    <Select
                                        mode="multiple"
                                        placeholder='全部'
                                    >
                                        <Option key='0'>不通知</Option>
                                        <Option key='1'>仅通知一次</Option>
                                        <Option key='2'>1小时通知一次</Option>
                                        <Option key='3'>12小时通知一次</Option>
                                        <Option key='4'>一天通知一次</Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </div>
                        <div className={styles.items}>
                            <div className={styles.itemName2}>通知内容</div>
                            <Form.Item label='通知内容' >
                                {getFieldDecorator('informContent', {
                                    initialValue: '',
                                })(
                                    <Input
                                        className={styles.informContent}
                                        placeholder='请输入通知内容，如需调用参数请用<>表示'
                                    />
                                )}
                            </Form.Item>
                        </div>
                        <div className={styles.items}>
                            <div className={styles.itemName2}>控制</div>
                            <Form.Item label='关联设备' >
                                <Form.Item>
                                    {getFieldDecorator('Device', {
                                        //initialValue: '',
                                    })(
                                        <Select
                                            placeholder='设备名称/ID'
                                        >

                                        </Select>

                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('order', {
                                        //initialValue: '',
                                    })(
                                        <Select
                                            placeholder='选择指令'
                                        >

                                        </Select>
                                    )}

                                </Form.Item>

                            </Form.Item>
                        </div>
                    </div>
                    <div className={styles.formFooter}>
                        <Button
                            icon='save'
                            className={styles.btnsave}
                            onClick={() => onSave()}
                        >保存</Button>
                        <Button
                            icon='delete'
                            className={styles.btndelete}
                            onClick={() => onDelete()}
                        >删除</Button>
                    </div>
                </Form>
            )
        }
    }
)
