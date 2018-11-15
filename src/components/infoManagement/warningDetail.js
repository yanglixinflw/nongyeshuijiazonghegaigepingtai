import React, { Component } from 'react';
import styles from './warningDetail.less';
import { Select, Button, Form, Modal, Input } from 'antd';
export default class extends Component {
    constructor(props) {
        super(props)
        const { warningDetail } = props

        this.state = {
            //数据源
            data: warningDetail.data.data,
            // data: [],
            //添加自定义规则弹窗可见性
            addVisible: false,
            //修改规则弹窗可见性
            modifyVisible: false,
            // 修改对应ruleId的预警规则
            modifyData: [],
        }
        console.log(this.state.data)
    }
    //添加自定义规则
    _addRules() {
        this.setState({
            addVisible: true
        })
    }
    // 添加删除
    _addDeleteHandler() {
        // console.log('点击删除按钮');
        const form = this.addRulesForm.props.form;
        // 重置表单
        form.resetFields();
        this.setState({
            addVisible: false
        })
    }
    //添加保存
    _addSaveHandler() {
        const form = this.addRulesForm.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log(values)
        })
        // 重置表单
        form.resetFields();
        this.setState({
            addVisible: false
        })
    }
    //修改表单删除
    _modifyDeleteHandler(){
        const form = this.modifyRulesForm.props.form;
        // 重置表单
        form.resetFields();
        this.setState({
            modifyVisible: false
        })
    }
    //修改表单保存
    _modifySaveHandler(){
        const form = this.modifyRulesForm.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log(values)
        })
        // 重置表单
        form.resetFields();
        this.setState({
            addVisible: false
        })
    }
    //自定义规则表单修改
    _modifyHandler(ruleId) {
        const { data } = this.state;
        let modifyData = [];
        modifyData = data.filter(item => item.ruleId === ruleId);
        // console.log(modifyData)
        this.setState({
            modifyData,
            modifyVisible: true
        })

    }
    //删除
    _deleteHandler(ruleId) {
        console.log(ruleId)
    }
    render() {
        const { data, addVisible,modifyVisible,modifyData } = this.state;
        const Option = Select.Option;
        return (
            <div className={styles.warningDetail}>
                <div className={styles.title}>
                    <div className={styles.rulesName}>预警机制</div>
                    <div className={styles.border}></div>
                </div>
                <div className={styles.content}>
                    <div className={styles.labelName}>预警规则</div>
                    <Select
                        placeholder='慧水 RUT'
                    >
                        <Option key={0}>全部</Option>
                    </Select>
                    <Button
                        onClick={() => this._addRules()}
                    >添加自定义规则</Button>
                    {/* 添加表单 */}
                    {addVisible ?
                        <AddRulesForm
                            wrappedComponentRef={(addRulesForm) => this.addRulesForm = addRulesForm}
                            onDelete={() => this._addDeleteHandler()}
                            onSave={() => this._addSaveHandler()}
                        />
                        : null
                    }
                    {/* 修改表单 */}
                    {modifyVisible ?
                        <ModifyRulesForm
                            wrappedComponentRef={(modifyRulesForm) => this.modifyRulesForm = modifyRulesForm}
                            onDelete={() => this._modifyDeleteHandler()}
                            onSave={() => this._modifySaveHandler()}
                            {...{modifyData}}
                        />
                        : null
                    }
                    {
                        data.length==0?
                        null
                        :
                        data.map((v, i) => {
                            return (
                                <RulesForm
                                    key={i}
                                    wrappedComponentRef={(rulesForm) => this.rulesForm = rulesForm}
                                    onModify={(ruleId) => this._modifyHandler(ruleId)}
                                    onDelete={(ruleId) => this._deleteHandler(ruleId)}
                                    {...{ v, i }}
                                />
                            )
                        })
                    }
                    

                </div>
            </div>
        )
    }
}
//自定义预警规则表单
const RulesForm = Form.create()(
    class extends React.Component {
        render() {
            const { v, i, onDelete, onModify } = this.props;
            // console.log(v)
            return (
                <Form layout='inline'>
                    <div className={styles.formTitle}>
                        <div className={styles.formName}>自定义预警规则{i + 1}</div>
                    </div>
                    <div className={styles.formContent}>
                        <div className={styles.items}>
                            <div className={styles.itemName}>条件</div>
                            <Form.Item label='类型'>
                                <div>功能预警</div>
                            </Form.Item>
                            <Form.Item label='判断规则' className={styles.judgmentRule}>
                                <div>当电量≤10%时</div>
                            </Form.Item>
                        </div>
                        <div className={styles.items}>
                            <div className={styles.itemName}>短信</div>
                            <Form.Item label='频率'>
                                <div>仅通知一次</div>
                            </Form.Item>
                            <Form.Item label='通知人' className={styles.informer}>
                                <div >慧水公司-老李</div>
                            </Form.Item>
                        </div>
                        <div className={styles.items}>
                            <div className={styles.itemName}>通知内容</div>
                            <Form.Item label='通知内容'>
                                <div>{v.deviceTypeName}{v.name}</div>
                            </Form.Item>
                        </div>
                    </div>
                    <div className={styles.formFooter}>
                        <Button
                            icon='edit'
                            className={styles.btnmodify}
                            onClick={() => onModify(v.ruleId)}
                        >修改</Button>
                        <Button
                            icon='delete'
                            className={styles.btndelete}
                            onClick={() => onDelete(v.ruleId)}
                        >删除</Button>
                    </div>
                </Form>
            )
        }
    }
)
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
                                        placeholder="预警规则"
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
//修改自定义规则表单
const ModifyRulesForm = Form.create()(
    class extends React.Component {
        render() {
            const { form, onSave, onDelete,modifyData } = this.props;
            const { getFieldDecorator } = form;
            const Option = Select.Option;
            console.log(modifyData)
            return (
                <Form layout='inline' className={styles.addForm}>
                    <div className={styles.formTitle}>
                        <div className={styles.formName}>
                            <Form.Item>
                                {getFieldDecorator('warningTitle', {
                                    initialValue: '',
                                })(
                                    <Input
                                        placeholder="预警规则"
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