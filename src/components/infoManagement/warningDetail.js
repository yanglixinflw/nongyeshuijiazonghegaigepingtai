import React, { Component } from 'react';
import styles from './warningDetail.less';
import { Select, Button, Form, Modal, Input, message, InputNumber } from 'antd';
import { timeOut } from '../../utils/timeOut';
import { getUserList, getDeviceParameters, getRoleList, getSimpleList, getControlList, queryWarningDetail } from '../../services/api'
import _ from 'lodash';
import { ENVNet, postOption } from '../../services/netCofig'
//保存/添加预警规则Url
const addUrl = `${ENVNet}/api/DeviceWaringRule/add`;
//获取修改预警规则详情
const detailUrl = `${ENVNet}/api/DeviceWaringRule/ruleDetails`
//修改预警规则Url
const updateUrl = `${ENVNet}/api/DeviceWaringRule/update`;
//删除预警规则Url
const deleteUrl = `${ENVNet}/api/DeviceWaringRule/delete`;
//获取预警模板
const TemRulesListUrl = `${ENVNet}/api/DeviceWaringRule/ruleList`

export default class extends Component {
    constructor(props) {
        super(props)
        const { warningDetail, deviceId } = props;
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
            //当前正在执行修改或删除操作的规则Id
            ruleId: '',
            //修改/删除 预警规则Id数组
            ruleIds: [],
            // 修改对应ruleId的预警规则数组
            modifyDatas: [],
            //设备Id
            deviceId,
            //添加表单设备名称搜索值
            addSearchValue: '',
            //模板预警表单数据
            temRulesDatas: [],
            //通知人列表
            receiverList: [],
            //预警规则模板列表
            TemRulesList: [],
            //修改表单数组
            modifyRulesForms: [],
            //模板表单数组
            temRulesForms: [],
            //编辑模板规则Id
            templateRuleId: '',
            //编辑模板规则Id数组
            templateRuleIds: [],
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
            //超时判断
            timeOut(v.data.ret)
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
            //超时判断
            timeOut(v.data.ret)
            if (v.data.ret === 1) {
                this.setState({
                    roleList: v.data.data
                })
            }

        })
    }
    //保存完之后的刷新自定义规则列表
    _refreshList(newRuleIds = [], type = '') {
        const { deviceId } = this.state;
        //还在修改中的ruleIds
        // console.log(newRuleIds)
        Promise.resolve(queryWarningDetail({ deviceId }))
            .then((v) => {
                //超时判断
                timeOut(v.data.ret)
                // console.log(v)
                if (v.data.ret == 1) {
                    // console.log(v)
                    let data = v.data.data;
                    newRuleIds.map((v, i) => {
                        return data = data.filter(item => item.ruleId !== v)
                    })
                    // console.log(data)
                    if (type == 'template') {
                        this.setState({
                            data,
                            templateRuleIds: newRuleIds
                        })
                    } else {
                        this.setState({
                            data,
                            ruleIds: newRuleIds
                        })
                    }
                } else {
                    this.setState({
                        data: []
                    })
                }
            })
    }
    //点击选择预警模板
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
                    } else {
                        this.setState({
                            TemRulesList: []
                        })
                    }
                })
        }).catch((err) => {
            console.log(err)
        })
    }
    //取消选择
    _selectCancelHandler() {
        this.setState({
            selectVisible: false
        })
    }
    //确定选择预警规则模板
    _SelectTem(ruleId) {
        // console.log(ruleId)
        const { templateRuleIds } = this.state;
        templateRuleIds.push(ruleId);
        const { temRulesDatas } = this.state;
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
                        let temRulesData = v.data;
                        temRulesDatas.push(temRulesData)
                        this.setState({
                            templateRuleIds,
                            templateRuleId: ruleId,
                            temRulesDatas,
                            selectVisible: false,
                        })
                    } else {
                        this.setState({
                            temRulesDatas: []
                        })
                    }
                })
        }).catch((err) => {
            console.log(err)
        })
    }
    //取消预警模板
    _temCancelHandler(i) {
        const { templateRuleIds, temRulesForms, temRulesDatas } = this.state;
        const form = temRulesForms[i].props.form;
        //过滤出剩下未取消还在修改中的ruleId
        let newTemplateRuleIds = templateRuleIds.filter(item => item !== templateRuleIds[i]);
        //过滤出剩下未取消的还在修改的数据数组
        let newTemRulesDatas = temRulesDatas.filter(item => item.ruleId !== templateRuleIds[i]);
        // 重置表单
        form.resetFields();
        this._refreshList(newTemplateRuleIds, 'template');
        this.setState({
            temRulesDatas: newTemRulesDatas
        })
    }
    //预警模板保存
    _temSaveHandler(i) {
        const { templateRuleIds, deviceId, temRulesForms, temRulesDatas } = this.state;
        const form = temRulesForms[i].props.form;
        //过滤出剩下未保存还在编辑中的ruleId
        let newTemplateRuleIds = templateRuleIds.filter(item => item !== templateRuleIds[i]);
        form.validateFields((err, values) => {
            if (!err) {
                // console.log(values)
                // //设备Id
                values.deviceId = deviceId
                //预警规则ID
                values.ruleId = templateRuleIds[i]
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
                        receiverIds: [values.SMSreceiverIds],
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
                        receiverIds: [values.TELreceiverIds],
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
                                this._refreshList(newTemplateRuleIds, 'template');
                                let newTemRulesDatas = temRulesDatas.filter(item => item.ruleId !== templateRuleIds[i]);
                                this.setState({
                                    templateVisible: false,
                                    temRulesDatas: newTemRulesDatas
                                })
                                message.success('修改成功', 2)
                                // 重置表单
                                form.resetFields();
                            }
                        })
                }).catch((err) => {
                    console.log(err)
                })
            }
        })
    }
    //点击添加自定义规则
    _addRules() {
        if (this.state.addVisible == false) {
            this.setState({
                addVisible: true
            })
        } else {
            message.info('请先保存当前正在编辑的自定义规则', 2)
        }
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
        const { deviceId } = this.state;
        form.validateFields((err, values) => {
            if (!err) {
                // console.log(values)
                //设备ID
                values.deviceId = deviceId
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
                        receiverIds: [values.SMSreceiverIds],
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
                        receiverIds: [values.TELreceiverIds],
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
                }).catch((err) => {
                    console.log(err)
                })
            }
        })
    }
    //修改表单取消
    _modifyCancelHandler(i) {
        const { ruleIds, modifyDatas, modifyRulesForms } = this.state;
        //过滤出剩下未取消还在修改中的ruleId
        let newRuleIds = ruleIds.filter(item => item !== ruleIds[i]);
        //过滤出剩下未取消的还在修改的数据数组
        let newModifyDatas = modifyDatas.filter(item => item.ruleId !== ruleIds[i]);
        const form = modifyRulesForms[i].props.form;
        // 重置表单
        form.resetFields();
        this._refreshList(newRuleIds);
        this.setState({
            modifyDatas: newModifyDatas
        })
    }
    //修改表单保存
    _modifySaveHandler(i) {
        const { ruleIds, modifyDatas, modifyRulesForms } = this.state;
        const form = modifyRulesForms[i].props.form;
        //过滤出剩下未保存还在修改中的ruleId
        let newRuleIds = ruleIds.filter(item => item !== ruleIds[i]);
        form.validateFields((err, values) => {
            if (!err) {
                // console.log(values)
                //预警规则ID
                values.ruleId = ruleIds[i]
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
                        receiverIds: [values.SMSreceiverIds],
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
                        receiverIds: [values.TELreceiverIds],
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
                                this._refreshList(newRuleIds);
                                let newModifyDatas = modifyDatas.filter(item => item.ruleId !== ruleIds[i]);
                                this.setState({
                                    modifyDatas: newModifyDatas
                                })
                                message.success('修改成功', 2)
                                // 重置表单
                                form.resetFields();
                            }
                        })
                }).catch((err) => {
                    console.log(err)
                })
            }
        })
    }
    //已有预警规则点击修改 //请求规则详情并保存ruleId
    _modifyHandler(ruleId) {
        const { data, modifyDatas, ruleIds } = this.state;
        // console.log(modifyRulesForms[0])
        ruleIds.push(ruleId);
        //过滤正要修改的数据
        let newData = data.filter(item => item.ruleId !== ruleId);
        // console.log(newData)
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
                        modifyDatas.push(modifyData)
                        this.setState({
                            ruleId,
                            ruleIds,
                            modifyDatas,
                            data: newData,
                        })
                    } else {
                        this.setState({
                            modifyDatas: []
                        })
                    }
                })
        }).catch((err) => {
            console.log(err)
        })
    }
    //已有预警规则点击删除
    _deleteHandler(ruleId) {
        const { ruleIds } = this.state;
        ruleIds.push(ruleId);
        this.setState({
            deleteVisible: true,
            ruleIds,
            ruleId
        })
    }
    //确认删除已有预警规则
    _deleteOkHandler() {
        const { ruleIds,ruleId } = this.state;
        //将当前取消的ruleId从ruleIds中去除
        let newRuleIds = ruleIds.filter(item => item !== ruleId);
        // console.log(ruleIds)
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
                            deleteVisible: false,
                            ruleIds: newRuleIds
                        })
                        message.success('删除成功', 2)
                    }
                })
        }).catch((err) => {
            console.log(err)
        })
    }
    //取消删除预警规则
    _deleteCancelHandler() {
        const { ruleIds, ruleId } = this.state;
        //将当前取消的ruleId从ruleIds中去除
        let newRuleIds = ruleIds.filter(item => item !== ruleId);
        this.setState({
            deleteVisible: false,
            ruleIds: newRuleIds
        })
    }
    render() {
        const {
            data,
            selectVisible,
            deleteVisible,
            addVisible,
            modifyDatas,
            temRulesDatas,
            parameterList,
            roleList,
            TemRulesList,
            modifyRulesForms,
            temRulesForms
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
                    {temRulesDatas.length !== 0 ?
                        temRulesDatas.map((TemRulesData, i) => {
                            return (
                                <TemRulesForm
                                    key={i}
                                    wrappedComponentRef={(temRulesForm) => temRulesForms[i] = temRulesForm}
                                    onCancel={() => this._temCancelHandler(i)}
                                    onSave={() => this._temSaveHandler(i)}
                                    parameterList={parameterList}
                                    roleList={roleList}
                                    {...{ TemRulesData }}
                                />
                            )
                        })

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
                    {modifyDatas.length !== 0 ?
                        modifyDatas.map((modifyData, i) => {
                            return (
                                <ModifyRulesForm
                                    key={i}
                                    wrappedComponentRef={(modifyRulesForm) => { modifyRulesForms[i] = modifyRulesForm }}
                                    onCancel={() => this._modifyCancelHandler(i)}
                                    onSave={() => this._modifySaveHandler(i)}
                                    parameterList={parameterList}
                                    roleList={roleList}
                                    {...{ modifyData }}
                                />
                            )
                        })

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
                                <div>{v.conditionDescription}</div>
                            </Form.Item>
                            <Form.Item label='判断规则' className={styles.judgmentRule}>
                                <div>当{v.parameterName}{v.operator}{v.compareValue}</div>
                            </Form.Item>
                        </div>
                        <div className={styles.items}>
                            <div className={styles.itemName}>短信</div>
                            <Form.Item label='频率'>
                                <div>{v.smsFrequency}</div>
                            </Form.Item>
                            <Form.Item label='通知人' className={styles.informer}>
                                <div >{v.smsReceiverNames}</div>
                            </Form.Item>
                        </div>
                        <div className={styles.items}>
                            <div className={styles.itemName}>通知内容</div>
                            <Form.Item label='通知内容'>
                                <div>{v.notifyMsgContent}</div>
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
        constructor(props){
            super(props)
            this. state = {
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
            // // 初始化获取指令列表
            // this.deviceChange(props.data.deviceId)
        }
        // state = {
        //     // 短信通知人
        //     SMSreceiver: '',
        //     TELreceiver: '',
        //     // 短信通知人列表
        //     SMSreceiverData: [],
        //     TELreceiverData: [],
        //     // 通知人是否为必填项
        //     SMSreceiverRequired: false,
        //     TELreceiverRequired: false,
        //     // 设备数据列表
        //     deviceData: [],
        //     // 设备操作指令列表
        //     controlList: []
        // }
        // 搜索获取通知人列表
        handleSearch(value, type) {
            let UserList = getUserList(value)
            Promise.resolve(UserList).then((v) => {
                // 短信通知人
                //超时判断
                timeOut(v.data.ret)
                // console.log(v)
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
                    //超时判断
                    timeOut(v.data.ret)
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
                //超时判断
                timeOut(v.data.ret)
                if (v.data.ret == 1) {
                    this.setState({
                        controlList: v.data.data || []
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
                                        <Option key='-1'>仅通知一次</Option>
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
                                            // onSearch={(value) => this.handleSearch(value, 'sms')}
                                            onSearch={_.debounce((value) => this.handleSearch(value, 'sms'), 300)}
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
                                        <Option key='-1'>仅通知一次</Option>
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
                                            // onSearch={(value) => this.handleSearch(value, 'TEL')}
                                            onSearch={_.debounce((value) => this.handleSearch(value, 'TEL'), 300)}
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
                                            // onSearch={(value) => this.deviceSearch(value)}
                                            onSearch={_.debounce((value) => this.deviceSearch(value), 300)}
                                            // onChange={(value) => this.deviceChange(value)}
                                            onSelect={(value) => this.deviceChange(value)}
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
        constructor(props) {
            super(props)
            this.state = {
                // 短信通知人
                SMSreceiver: '',
                TELreceiver: '',
                // 短信通知人列表
                SMSreceiverData: props.modifyData.smsNotify.receivers,
                TELreceiverData: props.modifyData.phoneNotify.receivers,
                // 通知人是否为必填项
                SMSreceiverRequired: false,
                TELreceiverRequired: false,
                // 设备数据列表
                deviceData: [{
                    deviceId: props.modifyData.fireControlDeviceId,
                    name: props.modifyData.fireControlDeviceName
                }],
                // 设备操作指令列表
                controlList: []
            }
            // 初始化获取指令列表
            this.deviceChange(props.modifyData.fireControlDeviceId)
        }
        // 搜索获取通知人列表
        handleSearch(value, type) {
            let UserList = getUserList(value)
            Promise.resolve(UserList).then((v) => {
                // 短信通知人
                //超时判断
                timeOut(v.data.ret)
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
                    //超时判断
                    timeOut(v.data.ret)
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
                //超时判断
                timeOut(v.data.ret)
                if (v.data.ret == 1) {
                    this.setState({
                        controlList: v.data.data || []
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
            // console.log(deviceData);
            // console.log(modifyData)
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
                                        <Option key='-1'>仅通知一次</Option>
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
                                            // onSearch={(value) => this.handleSearch(value, 'sms')}
                                            onSearch={_.debounce((value) => this.handleSearch(value, 'sms'), 300)}
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
                                        <Option key='-1'>仅通知一次</Option>
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
                                            // onSearch={(value) => this.handleSearch(value, 'TEL')}
                                            onSearch={_.debounce((value) => this.handleSearch(value, 'TEL'), 300)}
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
                                    initialValue: modifyData.notifyMsgContent,
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
                                            // onSearch={(value) => this.deviceSearch(value)}
                                            onSearch={_.debounce((value) => this.deviceSearch(value), 300)}
                                            // onChange={(value) => this.deviceChange(value)}
                                            onSelect={(value) => this.deviceChange(value)}
                                        >
                                            {
                                                deviceData[0].displayName == null ? null :
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
        constructor(props) {
            super(props)
            // console.log(props.TemRulesData)
            this.state = {
                // 短信通知人
                SMSreceiver: '',
                TELreceiver: '',
                // 短信通知人列表
                SMSreceiverData: props.TemRulesData.smsNotify.receivers,
                TELreceiverData: props.TemRulesData.phoneNotify.receivers,
                // 通知人是否为必填项
                SMSreceiverRequired: false,
                TELreceiverRequired: false,
                // 设备数据列表
                deviceData: [{
                    deviceId: props.TemRulesData.fireControlDeviceId,
                    name: props.TemRulesData.fireControlDeviceName
                }],
                // 设备操作指令列表
                controlList: []
            }
            // 初始化获取指令列表
            this.deviceChange(props.TemRulesData.fireControlDeviceId)
        }
        // 搜索获取通知人列表
        handleSearch(value, type) {
            let UserList = getUserList(value)
            Promise.resolve(UserList).then((v) => {
                //超时判断
                timeOut(v.data.ret)
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
                    //超时判断
                    timeOut(v.data.ret)
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
                    //超时判断
                    timeOut(v.data.ret)
                    this.setState({
                        controlList: v.data.data || []
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
            } = this.state;
            // console.log(controlList)
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
                                        <Option key='-1'>仅通知一次</Option>
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
                                            // onSearch={(value) => this.handleSearch(value, 'sms')}
                                            onSearch={_.debounce((value) => this.handleSearch(value, 'sms'), 300)}
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
                                        <Option key='-1'>仅通知一次</Option>
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
                                            // onSearch={(value) => this.handleSearch(value, 'TEL')}
                                            onSearch={_.debounce((value) => this.handleSearch(value, 'TEL'), 300)}
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
                                    initialValue: TemRulesData.notifyMsgContent,
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
                                            // onSearch={(value) => this.deviceSearch(value)}
                                            onSearch={_.debounce((value) => this.deviceSearch(value), 300)}
                                            // onChange={(value) => this.deviceChange(value)}
                                            onSelect={(value) => this.deviceChange(value)}
                                        >
                                            {
                                                deviceData[0].deviceTypeName == null ? null :
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