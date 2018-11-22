import React, { Component } from 'react';
import styles from './warningDetail.less';
import { Select, Button, Form, Modal, Input, message, InputNumber } from 'antd';
import { timeOut } from '../../utils/timeOut';
import { getUserList, getDeviceParameters, getRoleList, getSimpleList, getControlList, queryWarningDetail } from '../../services/api'
// 开发环境
const envNet = 'http://192.168.30.127:88';
// 生产环境
// const envNet = '';
//保存/添加预警规则Url
const addUrl = `${envNet}/api/DeviceWaringRule/add`;
//获取修改预警规则详情
const detailUrl = `${envNet}/api/DeviceWaringRule/ruleDetails`
//修改预警规则Url
const updateUrl = `${envNet}/api/DeviceWaringRule/update`;
//删除预警规则Url
const deleteUrl = `${envNet}/api/DeviceWaringRule/delete`;
//获取预警模板
const TemRulesListUrl = `${envNet}/api/DeviceWaringRule/ruleList`
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
        const { warningDetail, deviceId } = props
        this.state = {
            //数据源
            data: warningDetail.data.data,
            // data: [],
            //选择模板弹窗可见性
            selectVisible: false,
            //删除弹窗可见性
            deleteVisible: false,
            //模板表单可见性
            templateVisible: false,
            //添加自定义规则表单可见性
            addVisible: false,
            //修改规则表单可见性
            modifyVisible: false,
            //修改/删除 预警规则Id
            ruleId: '',
            // 修改对应ruleId的预警规则
            modifyData: [],
            //设备Id
            deviceId,
            //添加表单设备名称搜索值
            addSearchValue: '',
            //模板预警表单数据
            TemRulesData: '',
            //通知人列表
            receiverList: [],
            //预警规则模板列表
            TemRulesList: [],
        }
        // console.log(this.state.data)
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
    //保存完之后的刷新自定义规则列表
    _refreshList() {
        const { deviceId } = this.state;
        Promise.resolve(queryWarningDetail(deviceId))
            .then((v) => {
                //超时判断
                timeOut(v.ret)
                // console.log(v)
                if (v.data.ret == 1) {
                    // console.log(v)
                    let data = v.data.data
                    this.setState({
                        data
                    })
                }else{
                    this.setState({
                        data:[]
                    })
                }
            })
    }
    //选择预警模板
    _SelectTemplate() {
        let deviceTypeId = localStorage.getItem('selectDeviceTypeId');
        return fetch(TemRulesListUrl, {
            ...postOption,
            body: JSON.stringify({
                deviceTypeId,
                pageSize: 50
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    //超时判断
                    timeOut(v.ret)
                    if (v.ret == 1) {
                        let TemRulesList = v.data.items;
                        //添加key
                        TemRulesList.map((v, i) => {
                            v.key = i
                        })
                        this.setState({
                            TemRulesList,
                            selectVisible: true
                        })
                    }else{
                        this.setState({
                            TemRulesList:[]
                        })
                    }
                })
        }).catch((err)=>{
            console.log(err)
        })
    }
    //取消选择
    _selectCancelHandler() {
        this.setState({
            selectVisible: false
        })
    }
    //选择预警规则模板
    _SelectTem(ruleId) {
        // console.log(ruleId)
        return fetch(detailUrl, {
            ...postOption,
            body: JSON.stringify({
                ruleId
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    // 判断是否超时
                    timeOut(v.ret)
                    if (v.ret == 1) {
                        let TemRulesData = v.data;
                        this.setState({
                            ruleId,
                            TemRulesData,
                            selectVisible: false,
                            templateVisible: true
                        })
                    } else {
                        this.setState({
                            TemRulesData: []
                        })
                    }
                })
        }).catch((err) => {
            console.log(err)
        })
    }
    //取消预警模板
    _temCancelHandler() {
        const form = this.temRulesForm.props.form;
        // 重置表单
        form.resetFields();
        this.setState({
            templateVisible: false
        })
    }
    //预警模板保存
    _temSaveHandler() {
        const form = this.temRulesForm.props.form;
        const { ruleId } = this.state
        form.validateFields((err, values) => {
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
                // console.log(...values)
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
                                this._refreshList()
                                this.setState({
                                    templateVisible: false
                                })
                                message.success('修改成功', 2)
                                // 重置表单
                                form.resetFields();
                            }
                        })
                }).catch((err)=>{
                    console.log(err)
                })
            }
        })
    }
    //点击添加自定义规则
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
            if (!err) {
                // console.log(values)
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
                // console.log(...values)
                fetch(addUrl, {
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
                                this._refreshList()
                                this.setState({
                                    addVisible: false
                                })
                                message.success('添加成功', 2)
                                // 重置表单
                                form.resetFields();
                            }
                        })
                }).catch((err)=>{
                    console.log(err)
                })
            }
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
        const { ruleId } = this.state
        form.validateFields((err, values) => {
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
                // console.log(...values)
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
                                this._refreshList()
                                this.setState({
                                    modifyVisible: false
                                })
                                message.success('修改成功', 2)
                                // 重置表单
                                form.resetFields();
                            }
                        })
                }).catch((err)=>{
                    console.log(err)
                })
            }
        })
    }
    //已有预警规则点击修改 //请求规则详情并保存ruleId
    _modifyHandler(ruleId) {
        return fetch(detailUrl, {
            ...postOption,
            body: JSON.stringify({
                ruleId
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    // 判断是否超时
                    timeOut(v.ret)
                    if (v.ret == 1) {
                        let modifyData = v.data;
                        this.setState({
                            ruleId,
                            modifyData,
                            modifyVisible: true
                        })
                    }else{
                        this.setState({
                            modifyData:[]
                        })
                    }
                })
        }).catch((err) => {
            console.log(err)
        })
    }
    //已有预警规则点击删除
    _deleteHandler(ruleId) {
        this.setState({
            deleteVisible: true,
            ruleId
        })
    }
    //确认删除已有预警规则
    _deleteOkHandler() {
        const { ruleId } = this.state;
        let ruleIds = [];
        ruleIds.push(ruleId);
        return fetch(deleteUrl, {
            ...postOption,
            body: JSON.stringify({
                ruleIds
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    // 判断是否超时
                    timeOut(v.ret)
                    if (v.ret == 1) {
                        this._refreshList();
                        this.setState({
                            deleteVisible: false
                        })
                        message.success('删除成功', 2)
                    }
                })
        }).catch((err)=>{
            console.log(err)
        })
    }
    //取消删除预警规则
    _deleteCancelHandler() {
        this.setState({
            deleteVisible: false
        })
    }
    render() {
        const {
            data,
            templateVisible,
            selectVisible,
            deleteVisible,
            addVisible,
            modifyVisible,
            modifyData,
            TemRulesData,
            parameterList,
            roleList,
            TemRulesList,
        } = this.state;
        // const Option = Select.Option;
        return (
            <div className={styles.warningDetail}>
                <Modal
                    className={styles.deleteModal}
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
                <Modal
                    className={styles.selectModal}
                    centered={true}
                    visible={selectVisible}
                    onCancel={() => this._selectCancelHandler()}
                    title='选择自定义规则模板'
                    cancelText='取消'
                    okText='确定'
                >
                    {TemRulesList.length !== 0 ?
                        TemRulesList.map((v, i) => {
                            let ruleId = v.ruleId
                            return (
                                <Button
                                    key={i}
                                    onClick={() => this._SelectTem(ruleId)}
                                >{v.name}</Button>
                            )
                        })
                        : null

                    }
                </Modal>
                <div className={styles.title}>
                    <span className={styles.rulesName}>预警机制</span>
                </div>
                <div className={styles.content}>
                    <Button
                        onClick={() => this._SelectTemplate()}
                    >选择预警规则</Button>
                    <Button
                        onClick={() => this._addRules()}
                    >添加自定义规则</Button>
                    {/* 预警模板表单 */}
                    {templateVisible ?
                        <TemRulesForm
                            wrappedComponentRef={(temRulesForm) => this.temRulesForm = temRulesForm}
                            onCancel={() => this._temCancelHandler()}
                            onSave={() => this._temSaveHandler()}
                            parameterList={parameterList}
                            roleList={roleList}
                            {...{ TemRulesData }}
                        />
                        : null
                    }
                    {/* 添加表单 */}
                    {addVisible ?
                        <AddRulesForm
                            wrappedComponentRef={(addRulesForm) => this.addRulesForm = addRulesForm}
                            onCancel={() => this._addCancelHandler()}
                            onSave={() => this._addSaveHandler()}
                            parameterList={parameterList}
                            roleList={roleList}
                        />
                        : null
                    }
                    {/* 修改表单 */}
                    {modifyVisible ?
                        <ModifyRulesForm
                            wrappedComponentRef={(modifyRulesForm) => this.modifyRulesForm = modifyRulesForm}
                            onCancel={() => this._modifyCancelHandler()}
                            onSave={() => this._modifySaveHandler()}
                            parameterList={parameterList}
                            roleList={roleList}
                            {...{ modifyData }}
                        />
                        : null
                    }
                    <div className={styles.customizeForm}>
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
                        <div className={styles.formName}>{v.name}</div>
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
            const { form, onSave, onCancel, parameterList, roleList } = this.props;
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
                                    initialValue: '',
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
                                    initialValue: '1',
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
                                    initialValue: '0',
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
                                        initialValue: '',
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
                                    initialValue: '0',
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
                                        initialValue: '',
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
                                    initialValue: '',
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
            const { form, onSave, onCancel, parameterList, roleList, modifyData } = this.props;
            // console.log(modifyData)
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
                                    initialValue: modifyData.name,
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
                                    initialValue: `${modifyData.conditionType}`,
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
                                        initialValue: `${modifyData.parameterId}`,
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
                                        initialValue: modifyData.operator,
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
                                        initialValue: modifyData.compareValue,
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
                                    initialValue: `${modifyData.smsNotify.frequency}`,
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
                                        initialValue: modifyData.smsNotify.receiverIds[0],
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
                                        initialValue: modifyData.smsNotify.othersMobile,
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
                                    initialValue: `${modifyData.phoneNotify.frequency}`,
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
                                        initialValue: modifyData.phoneNotify.receiverIds[0],
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
                                        initialValue: modifyData.phoneNotify.othersMobile,
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
                                    initialValue: modifyData.sysMsgNotify.receiverIds,
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
                                    initialValue: modifyData.notifyMsgConten,
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
                                        initialValue: modifyData.fireControlDeviceId,
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
                                        initialValue: modifyData.fireControlCmd,
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
//预警规则已有模板表单
const TemRulesForm = Form.create()(
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
            const { form, onSave, onCancel, parameterList, roleList, TemRulesData } = this.props;
            // console.log(TemRulesData)
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
                                    initialValue: TemRulesData.name,
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
                                    initialValue: `${TemRulesData.conditionType}`,
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
                                        initialValue: `${TemRulesData.parameterId}`,
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
                                        initialValue: TemRulesData.operator,
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
                                        initialValue: TemRulesData.compareValue,
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
                                    initialValue: `${TemRulesData.smsNotify.frequency}`,
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
                                        initialValue: TemRulesData.smsNotify.receiverIds[0],
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
                                        initialValue: TemRulesData.smsNotify.othersMobile,
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
                                    initialValue: `${TemRulesData.phoneNotify.frequency}`,
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
                                        initialValue: TemRulesData.phoneNotify.receiverIds[0],
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
                                        initialValue: TemRulesData.phoneNotify.othersMobile,
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
                                    initialValue: TemRulesData.sysMsgNotify.receiverIds,
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
                                    initialValue: TemRulesData.notifyMsgConten,
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
                                        initialValue: TemRulesData.fireControlDeviceId,
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
                                        initialValue: TemRulesData.fireControlCmd,
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