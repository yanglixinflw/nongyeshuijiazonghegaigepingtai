import React, { Component } from 'react';
import styles from './warningDetail.less';
import { Select, Button, Form, Modal, Input, message } from 'antd';
import { timeOut } from '../../utils/timeOut';
// 开发环境
const envNet = 'http://192.168.30.127:88';
// 生产环境
// const envNet = '';
//保存/添加Url
const addUrl = `${envNet}/api/DeviceWaringRule/add`;
//修改Url
const updateUrl = `${envNet}/api/DeviceWaringRule/update`;
//删除Url
const deleteUrl = `${envNet}/api/DeviceWaringRule/delete`;
// post通用设置
let postOption = {
    method: 'POST',
    credentials: "include",
    mode: 'cors',
    headers: new Headers({
        'Content-Type': 'application/json',
    }),
};
export default class extends Component {
    constructor(props) {
        super(props)
        const { warningDetail,deviceId } = props
        this.state = {
            //数据源
            data: warningDetail.data.data,
            // data: [],
            //删除弹窗可见性
            deleteVisible: false,
            //添加自定义规则弹窗可见性
            addVisible: false,
            //修改规则弹窗可见性
            modifyVisible: false,
            //预警规则Id
            ruleId: '',
            // 修改对应ruleId的预警规则
            modifyData: [],
            //设备Id
            deviceId
        }
        console.log(this.state.data)
    }
    //添加自定义规则
    _addRules() {
        this.setState({
            addVisible: true
        })
    }
    // 添加取消
    _addCancelHandler() {
        // console.log('点击取消按钮');
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
    //修改表单取消
    _modifyCancelHandler() {
        const form = this.modifyRulesForm.props.form;
        // 重置表单
        form.resetFields();
        this.setState({
            modifyVisible: false
        })
    }
    //修改表单保存
    _modifySaveHandler() {
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
    //已有预警规则删除
    _deleteHandler(ruleId) {
        this.setState({
            deleteVisible: true,
            ruleId
        })
    }
    //确认删除预警规则
    _deleteOkHandler() {
        const { ruleId } = this.state;
        message.success('删除成功', 2);
        this.setState({
            deleteVisible: false
        })
    }
    //取消删除预警规则
    _deleteCancelHandler() {
        this.setState({
            deleteVisible: false
        })
    }
    render() {
        const { data, deleteVisible, addVisible, modifyVisible, modifyData } = this.state;
        const Option = Select.Option;
        return (
            <div className={styles.warningDetail}>
                <Modal
                    centered={true}
                    visible={deleteVisible}
                    onOk={() => this._deleteOkHandler()}
                    onCancel={() => this._deleteCancelHandler()}
                    title='删除'
                    cancelText='取消'
                    okText='确定'
                >
                    <span>确认删除此预警规则</span>
                </Modal>
                <div className={styles.title}>
                    <span className={styles.rulesName}>预警机制</span>
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
                            onCancel={() => this._addCancelHandler()}
                            onSave={() => this._addSaveHandler()}
                        />
                        : null
                    }
                    {/* 修改表单 */}
                    {modifyVisible ?
                        <ModifyRulesForm
                            wrappedComponentRef={(modifyRulesForm) => this.modifyRulesForm = modifyRulesForm}
                            onCancel={() => this._modifyCancelHandler()}
                            onSave={() => this._modifySaveHandler()}
                            {...{ modifyData }}
                        />
                        : null
                    }
                    {
                        data.length == 0 ?
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
            const { form, onSave, onCancel } = this.props;
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
                            onClick={() => onCancel()}
                        >取消</Button>
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
            const { form, onSave, onCancel, modifyData } = this.props;
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
                            onClick={() => onCancel()}
                        >取消</Button>
                    </div>
                </Form>
            )
        }
    }
)