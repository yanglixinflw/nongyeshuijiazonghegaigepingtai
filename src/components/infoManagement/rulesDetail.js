import React, { Component } from 'react';
import { Form, Select, Input, InputNumber, Button, message } from 'antd';
import styles from './rulesDetail.less';
import { Link,routerRedux } from 'dva/router';
import store from '../../index'
import { timeOut } from '../../utils/timeOut';
import { getUserList, getDeviceParameters, getRoleList, getSimpleList, getControlList } from '../../services/api'
// 开发环境
const envNet = 'http://192.168.30.127:88';
// 生产环境
// const envNet = '';
//修改预警规则Url
const updateUrl = `${envNet}/api/DeviceWaringRule/update`;
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
        const data = props.rulesDetail.data.data
        // console.log(props)
        this.state = {
            //规则详细信息
            data,
            ruleId: props.ruleId,
            parameterList: [],
            roleList: []

        }
    }
    componentDidMount() {
        // 获取设备参数列表
        let parameterList = getDeviceParameters(
            {
                deviceTypeId: localStorage.getItem('selectDeviceTypeId')
            })
        Promise.resolve(parameterList).then((v) => {
            // console.log(v)
            if (v.data.ret === 1) {
                if (v.data.data.length == 0) {
                    alert('该设备暂不支持预警规则设置')
                } else {
                    this.setState({
                        parameterList: v.data.data
                    })
                }
            }

        })
        // 获取通知角色列表
        Promise.resolve(getRoleList()).then((v) => {
            // console.log(v)
            if (v.data.ret === 1) {
                this.setState({
                    roleList: v.data.data
                })
            }

        })
    }
    // //保存完后重新加载
    // _Reload(ruleId){
    //     Promise.resolve(getRulesDetail(ruleId)).then((v)=>{
    //         if(v.data.ret == 1){
    //             this.setState({
    //                 data:v.data.data
    //             })
    //         }
    //     })
    // }
    //保存
    _saveHandler() {
        const form = this.rulesdetailForm.props.form;
        const { ruleId } = this.state;
        form.validateFields((err, values) => {
            if (typeof (store) === 'undefined') {
                return
            } else {
                const { dispatch } = store
                if (!err) {
                    // console.log(values)
                    //预警规则ID
                    values.ruleId = ruleId
                    // 设备类型ID
                    values.deviceTypeId = localStorage.getItem('selectDeviceTypeId')
                    // 短信是否通知
                    if (values.SMSfrequency == 0) {
                        // 短信通知
                        values.smsNotify = {
                            frequency: values.SMSfrequency,
                            receiverIds: [],
                            othersMobile: ''
                        }
                    } else {
                        values.smsNotify = {
                            frequency: values.SMSfrequency,
                            receiverIds: values.SMSreceiverIds,
                            othersMobile: values.SMSInformer
                        }
                    }
                    // 手机是否通知
                    if (values.TELfrequency == 0) {
                        values.phoneNotify = {
                            frequency: values.TELfrequency,
                            receiverIds: [],
                            othersMobile: ''
                        }
                    } else {
                        values.phoneNotify = {
                            frequency: values.TELfrequency,
                            receiverIds: values.TELreceiverIds,
                            othersMobile: values.TELInformer
                        }
                    }
                    // 通知范围
                    values.sysMsgNotify = {
                        frequency: "1",
                        receiverIds: values.informRange,
                        othersMobile: ""
                    }
                    // console.log(values)
                    fetch(updateUrl, {
                        ...postOption,
                        body: JSON.stringify({
                            ...values
                        })
                    }).then((res) => {
                        Promise.resolve(res.json())
                            .then((v) => {
                                //超时判断
                                timeOut(v.ret)
                                if (v.ret == 1) {
                                    // this._Reload(ruleId)
                                    message.success('修改成功', 2)
                                    // 重置表单
                                    form.resetFields();
                                    dispatch(routerRedux.push(`/messageManagement/warningRules`))
                                }
                            })
                    }).catch((err) => {
                        console.log(err)
                    })
                }
            }

        })
    }
    render() {
        const { data, parameterList, roleList } = this.state;
        return (
            <div className={styles.rulesDetail}>
                <RulesDetailForm
                    wrappedComponentRef={(rulesdetailForm) => this.rulesdetailForm = rulesdetailForm}
                    onSave={() => this._saveHandler()}
                    parameterList={parameterList}
                    roleList={roleList}
                    {...{ data }}
                />
            </div>

        )

    }
}
const RulesDetailForm = Form.create()(
    class extends React.Component {
        state = {
            // 短信通知人
            SMSreceiver: '',
            TELreceiver: '',
            // 短信通知人列表
            SMSreceiverData: [],
            TELreceiverData: [],
            // 通知人是否为必填项
            SMSreceiverRequired: false,
            TELreceiverRequired: false,
            // 设备数据列表
            deviceData: [],
            // 设备操作指令列表
            controlList: []
        }
        // 搜索获取通知人列表
        handleSearch(value, type) {
            let UserList = getUserList(value)
            Promise.resolve(UserList).then((v) => {
                // 短信通知人
                if (type == 'sms') {
                    this.setState({
                        SMSreceiverData: v.data.data
                    })
                    // 电话通知人
                } else {
                    this.setState({
                        TELreceiverData: v.data.data
                    })
                }
            })
        }
        // 通知人变化
        receiverChange(value, type) {
            // console.log(value)
            if (type == 'sms') {
                this.setState({
                    SMSreceiver: value
                })
            } else {
                this.setState({
                    TELreceiver: value
                })
            }
        }
        // 通知频率变化
        FrequencyChange(value, type) {
            if (type == 'sms') {
                if (value != 0) {
                    this.setState({
                        SMSreceiverRequired: true,
                    }),
                        () => {
                            // console.log(this.state.SMSreceiverRequired)
                            this.props.form.validateFields(["SMSreceiverIds"], { force: true });
                        }
                } else {
                    // console.log(0)
                    this.setState({
                        SMSreceiverRequired: false,
                    }),
                        () => {
                            this.props.form.validateFields(["SMSreceiverIds"], { force: true });
                        }
                }

            } else {
                if (value != 0) {
                    this.setState({
                        TELreceiverRequired: true,
                    }),
                        () => {
                            this.props.form.validateFields(["TELreceiverIds"], { force: true });
                        }
                } else {
                    this.setState({
                        TELreceiverRequired: false,
                    }),
                        () => {
                            this.props.form.validateFields(["TELreceiverIds"], { force: true });
                        }
                }
            }
        }
        // 搜索设备
        deviceSearch(value) {
            Promise.resolve(getSimpleList({
                "name": value,
                "pageIndex": 0,
                "pageSize": 100
            }))
                .then((v) => {
                    if (v.data.ret == 1) {
                        this.setState({
                            deviceData: v.data.data.items
                        })
                    }
                    // console.log(v.data)
                })
        }
        // 选中设备后
        deviceChange(value) {
            Promise.resolve(getControlList({
                deviceId: value
            })).then((v) => {
                if (v.data.ret == 1) {
                    this.setState({
                        controlList: v.data.data
                    })
                    // console.log(v.data.data.items)
                    // console.log(v.data.data)
                }
            })
        }
        render() {
            const { form, onSave, parameterList, roleList, data } = this.props;
            // console.log(data)
            const { SMSreceiver,
                TELreceiver,
                SMSreceiverData,
                TELreceiverData,
                SMSreceiverRequired,
                TELreceiverRequired,
                deviceData,
                controlList
            } = this.state
            const { getFieldDecorator } = form;
            // 短信联系人通知列表
            const SMSreceiverList =
                SMSreceiverData.length == 0 ?
                    null
                    : SMSreceiverData.map((v, i) => {
                        return (
                            <Select.Option
                                key={v.userId}
                            >
                                {v.realName}({v.mobile})
                            </Select.Option>
                        )
                    })
            // 手机通知人列表
            const TELreceiverList =
                TELreceiverData.length == 0 ?
                    null
                    : TELreceiverData.map((v, i) => {
                        return (
                            <Select.Option
                                key={v.userId}
                            >
                                {v.realName}({v.mobile})
                            </Select.Option>
                        )
                    })
            const Option = Select.Option;
            return (
                <Form layout='inline' className={styles.addForm}>
                    <div className={styles.formTitle}>
                        <div className={styles.formName}>
                            <Form.Item>
                                {getFieldDecorator('name', {
                                    initialValue: data.name,
                                    rules: [
                                        { required: true, message: '预警规则名称不能为空' },
                                        { max: 30, message: '不要超过30个字符' }
                                    ],
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
                                {getFieldDecorator('conditionType', {
                                    initialValue: `${data.conditionType}`,
                                    rules: [{ required: true, message: '请选择预警类型' },],
                                })(
                                    <Select>
                                        <Option key='1'>功能预警</Option>
                                        <Option key='2'>运营预警</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label='判断规则' className={styles.judgmentRule}>
                                <Form.Item>
                                    {getFieldDecorator('parameterId', {
                                        initialValue: `${data.parameterId}`,
                                        rules: [{ required: true, message: '判断规则不能为空' },],
                                    })(
                                        <Select
                                            className={styles.params}
                                            placeholder='请选择参数'
                                            dropdownClassName={styles.searchDropDown}
                                        >
                                            {
                                                parameterList.length == 0 ? null :
                                                    parameterList.map((v, i) => {
                                                        // console.log(v)
                                                        return (
                                                            <Option
                                                                key={v.parameterId}
                                                            >
                                                                {v.name}
                                                                {/* 判断单位 */}
                                                                {
                                                                    v.unit == '' ? null : `(${v.unit})`
                                                                }
                                                            </Option>
                                                        )
                                                    })
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('operator', {
                                        initialValue: data.operator,
                                        rules: [{ required: true, message: '判断符不能为空' },],
                                    })(
                                        <Select
                                            className={styles.judge}
                                            placeholder='判断符'
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
                                    {getFieldDecorator('compareValue', {
                                        initialValue: data.compareValue,
                                        rules: [{ required: true, message: '请选择判断值' },],
                                    })(
                                        <InputNumber
                                            placeholder='值'
                                        />
                                    )}
                                </Form.Item>
                            </Form.Item>
                        </div>
                        <div className={styles.items}>
                            <div className={styles.itemName1}>短信</div>
                            <Form.Item label='频率'>
                                {getFieldDecorator('SMSfrequency', {
                                    initialValue: `${data.smsNotify.frequency}`,
                                })(
                                    <Select
                                        onChange={(value) => this.FrequencyChange(value, 'sms')}
                                    >
                                        <Option key='0'>不通知</Option>
                                        <Option key='1'>仅通知一次</Option>
                                        <Option key='60'>1小时通知一次</Option>
                                        <Option key='720'>12小时通知一次</Option>
                                        <Option key='1440'>一天通知一次</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label='通知人' className={styles.informer}>
                                <Form.Item>
                                    {getFieldDecorator('SMSreceiverIds', {
                                        initialValue: data.smsNotify.receiverIds[0],
                                        setFieldsValue: SMSreceiver,
                                        rules: [{ required: SMSreceiverRequired, message: '通知人不能为空' },],
                                    })(
                                        <Select
                                            className={styles.searchReceiver}
                                            showSearch
                                            placeholder='输入通知人名字'
                                            defaultActiveFirstOption={false}
                                            showArrow={false}
                                            filterOption={false}
                                            notFoundContent={null}
                                            onSearch={(value) => this.handleSearch(value, 'sms')}
                                            onChange={(value) => this.receiverChange(value, 'sms')}
                                            dropdownClassName={styles.searchDropDown}
                                        >
                                            {SMSreceiverList}
                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('SMSInformer', {
                                        initialValue: data.smsNotify.othersMobile,
                                        rules: [{
                                            pattern: '^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\\d{8}([,，；;]{1,}((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\\d{8})*$',
                                            message: '请输入正确的手机号码'
                                        }],
                                    })(
                                        <Input
                                            placeholder='需通知的其他联系人'
                                            title='多个联系人用分号或者逗号分隔'
                                        />
                                    )}
                                </Form.Item>
                            </Form.Item>
                        </div>
                        <div className={styles.items}>
                            <div className={styles.itemName1}>电话</div>
                            <Form.Item label='频率'>
                                {getFieldDecorator('TELfrequency', {
                                    initialValue: `${data.phoneNotify.frequency}`,
                                })(
                                    <Select>
                                        <Option key='0'>不通知</Option>
                                        <Option key='1'>仅通知一次</Option>
                                        <Option key='60'>1小时通知一次</Option>
                                        <Option key='720'>12小时通知一次</Option>
                                        <Option key='1440'>一天通知一次</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label='通知人' className={styles.informer}>
                                <Form.Item>
                                    {getFieldDecorator('TELreceiverIds', {
                                        initialValue: data.phoneNotify.receiverIds[0],
                                        setFieldsValue: TELreceiver,
                                        rules: [{ required: TELreceiverRequired, message: '通知人不能为空' }]
                                    })(
                                        <Select
                                            showSearch={true}
                                            placeholder='输入通知人名字'
                                            defaultActiveFirstOption={false}
                                            showArrow={false}
                                            filterOption={false}
                                            notFoundContent={null}
                                            onSearch={(value) => this.handleSearch(value, 'TEL')}
                                            onChange={(value) => this.receiverChange(value, 'TEL')}
                                            dropdownClassName={styles.searchDropDown}
                                        >
                                            {TELreceiverList}
                                        </Select>
                                    )}

                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('TELInformer', {
                                        initialValue: data.phoneNotify.othersMobile,
                                        rules: [{
                                            pattern: '^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\\d{8}([,，；;]{1,}((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\\d{8})*$',
                                            message: '请输入正确的手机号码'
                                        }],
                                    })(
                                        <Input
                                            placeholder='需通知的其他联系人'
                                        />
                                    )}
                                </Form.Item>
                            </Form.Item>
                        </div>
                        <div className={styles.items}>
                            <div className={styles.itemName2}>平台通知</div>
                            <Form.Item label='通知范围' >
                                {getFieldDecorator('informRange', {
                                    initialValue: data.sysMsgNotify.receiverIds,
                                    rules: [{ required: true, message: '通知范围不能为空' },],
                                })(
                                    <Select
                                        className={styles.informContent}
                                        mode="multiple"
                                        placeholder='选择通知范围'
                                    >
                                        {
                                            roleList.length == 0 ?
                                                null
                                                : roleList.map((v, i) => {
                                                    // console.log(v)
                                                    return (
                                                        <Option
                                                            key={v.id}
                                                        >
                                                            {v.name}
                                                        </Option>)
                                                })
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                        </div>
                        <div className={styles.items}>
                            <div className={styles.itemName2}>通知内容</div>
                            <Form.Item label='通知内容' >
                                {getFieldDecorator('notifyMsgContent', {
                                    initialValue: data.notifyMsgConten,
                                    rules: [{ required: true, message: '通知内容不能为空' },],
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
                                    {getFieldDecorator('fireControlDeviceId', {
                                        initialValue: data.fireControlDeviceId,
                                    })(
                                        <Select
                                            //可搜索
                                            showSearch={true}
                                            placeholder='设备名称/ID'
                                            defaultActiveFirstOption={false}
                                            showArrow={false}
                                            filterOption={false}
                                            onSearch={(value) => this.deviceSearch(value)}
                                            onChange={(value) => this.deviceChange(value)}
                                        >
                                            {
                                                deviceData.length == 0 ? null :
                                                    deviceData.map((v, i) => {
                                                        // console.log(v)
                                                        return (
                                                            <Option
                                                                key={v.deviceId}
                                                            >
                                                                {v.name}({v.deviceTypeName})
                                                    </Option>)
                                                    })
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('fireControlCmd', {
                                        initialValue: data.fireControlCmd,
                                    })(
                                        <Select
                                            placeholder='选择指令'
                                        >
                                            {
                                                controlList.length == 0 ? null :
                                                    controlList.map((v, i) => {
                                                        // console.log(v)
                                                        return (
                                                            <Option
                                                                key={v.cmd}
                                                            >
                                                                {v.displayName}
                                                            </Option>
                                                        )
                                                    })
                                            }
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
                        <Link to='/messageManagement/warningRules'>
                            <Button
                                icon='delete'
                                className={styles.btndelete}
                            >取消</Button>
                        </Link>
                    </div>
                </Form>
            )
        }
    }
)