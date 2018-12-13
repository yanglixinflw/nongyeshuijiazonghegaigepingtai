import React, { Component } from 'react';
import styles from './autoRules.less';
import { Input, Button, Form, Select, Icon, Radio, message, InputNumber, Tooltip } from 'antd';
import { getAutoRules } from '../../services/api'
import { Link } from 'dva/router';
import _ from 'lodash'
import { timeOut } from '../../utils/timeOut';
const Option = Select.Option;
const RadioGroup = Radio.Group;
import { ENVNet, postOption } from '../../services/netCofig'
//搜索设备调用
const deviceUrl = `${ENVNet}/api/device/list`;
//获取设备参数列表
const paramUrl = `${ENVNet}/api/DeviceType/deviceParameters`;
//获取开关阀列表
const switchUrl = `${ENVNet}/api/device/control/cmdList`;
//保存数据
const saveUrl = `${ENVNet}/api/Automatic/saveRuleSettings`
//获取规则详情
const ruleUrl = `${ENVNet}/api/Automatic/getRuleSettings`
export default class extends Component {
    constructor(props) {
        super(props)
        const { autoRules } = props;
        // console.log(props)
        this.state = {
            //规则id
            ruleId: props.ruleId,
            //全部/部分
            anyConditionFireAction: autoRules.data.data.anyConditionFireAction,
            //规则名称
            name: autoRules.data.data.name,
            //条件数组
            conditions: autoRules.data.data.conditions,
            //执行数组
            actions: autoRules.data.data.actions,
            //设备搜索列表
            deviceList: [],
            parameterIdListArr: [],
            switchListArr: []
        }
    }
    componentDidMount() {
        // //统一数据源
        const { conditions, actions } = this.state;
        if (conditions.length != 0) {
            let { parameterIdListArr } = this.state
            //获取参数的信息
            conditions.map((v, i) => {
                return fetch(deviceUrl, {
                    ...postOption,
                    body: JSON.stringify({
                        "deviceId": conditions[i].deviceId,
                        "pageIndex": 0,
                        "pageSize": 1
                    })
                }).then((res) => {
                    Promise.resolve(res.json())
                        .then((v) => {
                            //超时判断
                            timeOut(v.ret);
                            if (v.ret == 1) {
                                let deviceTypeId = v.data.items[0].deviceTypeId
                                //获取参数的信息
                                fetch(paramUrl, {
                                    ...postOption,
                                    body: JSON.stringify({
                                        deviceTypeId
                                    })
                                }).then((res) => {
                                    Promise.resolve(res.json())
                                        .then((v) => {
                                            //超时判断
                                            timeOut(v.ret);
                                            if (v.ret == 1) {
                                                let parameterIdList = v.data;
                                                // console.log(parameterIdList)
                                                parameterIdListArr.push(parameterIdList)
                                                // conditions[i].parameterIdList = parameterIdList;
                                                this.setState({
                                                    parameterIdListArr
                                                })
                                            } else {
                                                let parameterIdList = [];
                                                parameterIdListArr.push(parameterIdList)
                                                this.setState({
                                                    parameterIdListArr
                                                })
                                            }
                                        })
                                })
                            }
                        })
                }).catch(err => {
                    console.log(err)
                })
            })
        }
        if (actions.length !== 0) {
            let { switchListArr } = this.state;
            actions.map((v, i) => {
                return fetch(deviceUrl, {
                    ...postOption,
                    body: JSON.stringify({
                        "deviceId": actions[i].deviceId,
                        "pageIndex": 0,
                        "pageSize": 1
                    })
                }).then((res) => {
                    Promise.resolve(res.json())
                        .then((v) => {
                            //超时判断
                            timeOut(v.ret)
                            if (v.ret == 1) {
                                let deviceTypeId = v.data.items[0].deviceTypeId;
                                return fetch(switchUrl, {
                                    ...postOption,
                                    body: JSON.stringify({
                                        deviceTypeId
                                    })
                                }).then((res) => {
                                    Promise.resolve(res.json())
                                        .then((v) => {
                                            //判断超时
                                            timeOut(v.ret);
                                            if (v.ret == 1) {
                                                let switchList = v.data
                                                switchListArr.push(switchList)
                                                // actions[i].switchList = switchList
                                                this.setState({
                                                    switchListArr
                                                })
                                            } else {
                                                let switchList = []
                                                switchListArr.push(switchList)
                                                this.setState({
                                                    switchListArr
                                                })
                                            }
                                        })
                                })
                            }
                        })
                })
            })
        }
    }
    //保存
    _save() {
        this.ruleForm.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log(values)
                //拼接数组conditions
                if (typeof (values.actionDeviceId) !== 'undefined' && typeof (values.conditionDeviceId) !== 'undefined') {
                    var conditions = [];
                    values.conditionDeviceId.map((v, i) => {
                        let obj = {
                            deviceId: v,
                            parameterId: values.parameterId[i],
                            operator: values.operator[i],
                            compareValue: values.compareValue[i]
                        }
                        conditions.push(obj)
                    })
                    //拼接数组actions
                    var actions = [];
                    values.actionDeviceId.map((v, i) => {
                        let obj = {
                            deviceId: v,
                            execCmd: values.execCmd[i]
                        }
                        actions.push(obj)
                    })
                    //保存
                    fetch(saveUrl, {
                        ...postOption,
                        body: JSON.stringify({
                            "ruleId": this.state.ruleId,
                            'anyConditionFireAction': values.anyConditionFireAction,
                            'name': values.name,
                            conditions,
                            actions
                        })
                    }).then(res => {
                        Promise.resolve(res.json())
                            .then(v => {
                                //超时判断
                                timeOut(v.ret);
                                if (v.ret == 1) {
                                    //重新获取页面
                                    fetch(ruleUrl, {
                                        ...postOption,
                                        body: JSON.stringify({
                                            "ruleId": this.state.ruleId,
                                        })
                                    }).then(res => {
                                        Promise.resolve(res.json())
                                            .then(v => {
                                                //超时判断
                                                timeOut(v.ret);
                                                if (v.ret == 1) {
                                                    message.success(`${values.name}保存成功`, 2);
                                                    this.setState({
                                                        anyConditionFireAction: v.data.anyConditionFireAction,
                                                        name: v.data.name,
                                                        conditions: v.data.conditions,
                                                        actions: v.data.actions
                                                    })
                                                }
                                            })
                                    }).catch((err) => {
                                        console.log(err)
                                    })
                                }
                            })
                    })
                } else {
                    if (typeof (values.conditionDeviceId) == 'undefined' && typeof (values.actionDeviceId) !== 'undefined') {
                        message.error('您还未添加条件栏', 2)
                    } else if (typeof (values.conditionDeviceId) !== 'undefined' && typeof (values.actionDeviceId) == 'undefined') {
                        message.error('您还未添加执行栏', 2)
                    } else {
                        let conditions = [];
                        let actions = [];
                        //保存
                        fetch(saveUrl, {
                            ...postOption,
                            body: JSON.stringify({
                                "ruleId": this.state.ruleId,
                                'anyConditionFireAction': values.anyConditionFireAction,
                                'name': values.name,
                                conditions,
                                actions
                            })
                        }).then(res => {
                            Promise.resolve(res.json())
                                .then(v => {
                                    //超时判断
                                    timeOut(v.ret);
                                    if (v.ret == 1) {
                                        //重新获取页面
                                        fetch(ruleUrl, {
                                            ...postOption,
                                            body: JSON.stringify({
                                                "ruleId": this.state.ruleId,
                                            })
                                        }).then(res => {
                                            Promise.resolve(res.json())
                                                .then(v => {
                                                    //超时判断
                                                    timeOut(v.ret);
                                                    if (v.ret == 1) {
                                                        message.success(`${values.name}保存成功`, 2);
                                                        this.setState({
                                                            anyConditionFireAction: v.data.anyConditionFireAction,
                                                            name: v.data.name,
                                                            conditions: v.data.conditions,
                                                            actions: v.data.actions
                                                        })
                                                    }
                                                })
                                        }).catch((err) => {
                                            console.log(err)
                                        })
                                    }
                                })
                        })
                    }
                }
            }

        });
    }
    //重置
    _resetForm() {
        // this.ruleForm.props.form.resetFields();
        // console.log(1)
        const { ruleId } = this.state;
        Promise.resolve(getAutoRules({ ruleId }))
            .then((v) => {
                //超时判断
                timeOut(v.data.ret);
                if (v.data.ret == 1) {
                    let actions = v.data.data.actions;
                    let anyConditionFireAction = v.data.data.anyConditionFireAction;
                    let conditions = v.data.data.conditions;
                    let name = v.data.data.name;
                    // console.log(actions)
                    this.setState({
                        actions,
                        anyConditionFireAction,
                        conditions,
                        name,
                        parameterIdListArr: [],
                        switchListArr: []
                    })
                }
            })
        // this.setState({
        //     actions:[],
        //     anyConditionFireAction:false,
        //     conditions:[],
        // })

    }
    //option的value值就是设备ID
    handleChange(value, i) {
        // console.log(value)
        const form = this.ruleForm.props.form;
        const { conditions, actions,parameterIdListArr,switchListArr } = this.state;
        // console.log(conditions)
        this.setState({
            deviceList: []
        })
        if (conditions.length != 0) {
            fetch(deviceUrl, {
                ...postOption,
                body: JSON.stringify({
                    "deviceId": value,
                    "pageIndex": 0,
                    "pageSize": 1
                })
            }).then((res) => {
                Promise.resolve(res.json())
                    .then((v) => {
                        //超时判断
                        timeOut(v.ret);
                        if (v.ret == 1) {
                            // 设置页面显示的元素
                            let deviceTypeId = v.data.items[0].deviceTypeId
                            //获取参数的信息
                            fetch(paramUrl, {
                                ...postOption,
                                body: JSON.stringify({
                                    deviceTypeId
                                })
                            }).then((res) => {
                                Promise.resolve(res.json())
                                    .then((v) => {
                                        //超时判断
                                        timeOut(v.ret);
                                        if (v.ret == 1) {
                                            // console.log(1)
                                            let parameterIdList = v.data;
                                            if (parameterIdList.length == 0) {
                                                form.setFieldsValue({
                                                    [`parameterId[${i}]`]: []
                                                });
                                            }
                                            parameterIdListArr[i]= parameterIdList;
                                            // console.log(parameterIdListArr)
                                            this.setState({
                                                parameterIdListArr
                                            })
                                        } else {
                                            parameterIdListArr[i]= [];
                                            // form.setFieldsValue({
                                            //     [`parameterId[${i}]`]: []
                                            // });
                                            this.setState({
                                                parameterIdListArr
                                            })
                                        }
                                    })
                            })
                        }
                    })
            })
        }

        //获取开关的信息
        if (actions.length !== 0) {
            actions.map((v, i) => {
                return fetch(deviceUrl, {
                    ...postOption,
                    body: JSON.stringify({
                        "deviceId": actions[i].deviceId,
                        "pageIndex": 0,
                        "pageSize": 1
                    })
                }).then((res) => {
                    Promise.resolve(res.json())
                        .then((v) => {
                            //超时判断
                            timeOut(v.ret)
                            if (v.ret == 1) {
                                let deviceTypeId = v.data.items[0].deviceTypeId;
                                return fetch(switchUrl, {
                                    ...postOption,
                                    body: JSON.stringify({
                                        deviceTypeId
                                    })
                                }).then((res) => {
                                    Promise.resolve(res.json())
                                        .then((v) => {
                                            //判断超时
                                            timeOut(v.ret);
                                            if (v.ret == 1) {
                                                let switchList = v.data;
                                                // console.log(switchList)
                                                if (switchList.length == 0) {
                                                    form.setFieldsValue({
                                                        [`execCmd[${i}]`]: []
                                                    });
                                                }
                                                switchListArr[i] = switchList
                                                this.setState({
                                                    switchListArr
                                                })
                                            } else {
                                                switchListArr[i]= []
                                                this.setState({
                                                    switchListArr
                                                })
                                            }
                                        })
                                })
                            }
                        })
                })
            })
        }
    }
    //下拉搜索框搜索功能
    handleSearch(value) {
        // console.log(value)
        if (value == '') {
            this.setState({
                deviceList: []
            })
            return
        }
        fetch(deviceUrl, {
            ...postOption,
            body: JSON.stringify({
                "name": value,
                "pageIndex": 0,
                "pageSize": 10
            })
        }).then(res => {
            Promise.resolve(res.json())
                .then(v => {
                    //超时判断
                    timeOut(v.ret);
                    if (v.ret == 1) {
                        // 设置页面显示的元素
                        let deviceList = v.data.items
                        this.setState({
                            deviceList,
                        })
                    }
                })
        }).catch(err => {
            console.log(err)
        })
    }
    // 添加条件++
    conditionAdd() {
        const { conditions,parameterIdListArr } = this.state
        // console.log(condition)
        //得到添加数量的数组
        const nextCondition = conditions.concat({});
        let parameterIdList = [];
        parameterIdListArr.push(parameterIdList)
        this.setState({
            conditions: nextCondition,
            parameterIdListArr
        })
    }
    //减少条件--
    conditionLess = (index) => {
        // console.log(index)
        const { conditions,parameterIdListArr } = this.state
        // console.log(conditions)
        let newCodition = _.cloneDeep(conditions);
        let newParameterIdListArr =  _.cloneDeep(parameterIdListArr);
        let arr = newCodition.filter((key, i) => i != index);
        let brr = newParameterIdListArr.filter((key,i) => i!=index );
        this.setState({
            conditions: arr,
            parameterIdListArr:brr
        })
    }
    //添加执行++
    actionAdd() {
        const { actions,switchListArr } = this.state;
        //得到添加数量的数组
        const nextAction = actions.concat({});
        let switchList = [];
        switchListArr.push(switchList)
        this.setState({
            actions: nextAction,
            switchListArr
        })
    }
    //减少执行--
    actionLess = (index) => {
        const { actions,switchListArr } = this.state;
        let newActions = _.cloneDeep(actions);
        let newSwitchListArr = _.cloneDeep(switchListArr);
        let arr = newActions.filter((key, i) => i != index);
        let brr = newSwitchListArr.filter((key, i) => i != index);
        this.setState({
            actions: arr,
            switchListArr:brr
        })
    }
    render() {
        const { anyConditionFireAction, name, conditions, actions, deviceList, parameterIdListArr, switchListArr } = this.state;
        return (
            <React.Fragment>
                <div className={styles.headers}>
                    <div className={styles.btnGroup}>
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
                    <RuleForm
                        wrappedComponentRef={(ruleForm) => this.ruleForm = ruleForm}
                        {...{ anyConditionFireAction, name, conditions, actions, deviceList, parameterIdListArr, switchListArr }}
                        onChange={(value, i) => this.handleChange(value, i)}
                        onSearch={(value) => this.handleSearch(value)}
                        conditionAdd={() => this.conditionAdd()}
                        conditionLess={(index) => this.conditionLess(index)}
                        actionAdd={() => this.actionAdd()}
                        actionLess={(index) => this.actionLess(index)}
                    />
                </div>
            </React.Fragment>
        )
    }
}
//规则表单
const RuleForm = Form.create()(
    class extends React.Component {
        constructor(props) {
            super(props)
        }
        render() {
            const { getFieldDecorator, getFieldValue } = this.props.form;
            const { anyConditionFireAction, name, onChange, onSearch, conditionAdd, conditionLess, actionAdd, actionLess, parameterIdListArr, switchListArr } = this.props
            const { deviceList, actions, conditions } = this.props;
            // console.log(parameterIdListArr)
            //条件列表渲染
            // getFieldDecorator('condition', { initialValue: conditions });
            // const condition = getFieldValue('condition');
            // console.log(condition)
            const conditionForm = conditions.map((v, index) => {
                if (parameterIdListArr.length == conditions.length)
                    return (
                        <div className={styles.line} key={index}>
                            <Form.Item className={styles.search}>
                                <Tooltip title="设备名称/ID">
                                    {getFieldDecorator(`conditionDeviceId[${index}]`,
                                        {
                                            initialValue: v.deviceId || [],
                                            rules: [{ required: true, message: '设备名称不能为空' }]
                                        }
                                    )
                                        (

                                        <Select
                                            showSearch
                                            defaultActiveFirstOption={false}
                                            showArrow={false}
                                            onSearch={_.debounce((value) => onSearch(value), 300)}
                                            onChange={(value) => onChange(value, index)}
                                            notFoundContent={null}
                                            placeholder='设备名称/ID'

                                        >
                                            {
                                                deviceList.map((v, i) => {
                                                    return (
                                                        <Option key={v.deviceId}>{v.deviceId}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                        )
                                    }
                                </Tooltip>
                            </Form.Item>
                            <Form.Item className={styles.search}>
                                {getFieldDecorator(`parameterId[${index}]`,
                                    {
                                        initialValue: `${v.parameterId}` !== 'undefined' ? `${v.parameterId}` : [],
                                        rules: [{ required: true, message: '请选择参数' }]
                                    }
                                )
                                    (<Select
                                        placeholder='参数'
                                    >
                                        {
                                            parameterIdListArr[index].map((v, i) => {
                                                return (
                                                    <Option key={v.parameterId}>{v.name}{v.unit}</Option>
                                                )
                                            })
                                        }
                                    </Select>)
                                }
                            </Form.Item>
                            <Form.Item className={styles.end}>
                                {getFieldDecorator(`operator[${index}]`,
                                    {
                                        initialValue: v.operator || [],
                                        rules: [{ required: true, message: '请选择判断符号' }]
                                    }
                                )
                                    (<Select
                                        placeholder='判断'
                                    >
                                        <Option value=">">&gt;</Option>
                                        <Option value="<">&lt;</Option>
                                        <Option value="=">=</Option>
                                        <Option value=">=">&gt;=</Option>
                                        <Option value="<=">&lt;=</Option>
                                        <Option value="≠">≠</Option>
                                    </Select>)
                                }
                            </Form.Item>
                            <Form.Item className={styles.end}>
                                {getFieldDecorator(`compareValue[${index}]`,
                                    {
                                        initialValue: v.compareValue || '',
                                        rules: [{ required: true, message: '判断值不能为空' }]
                                    }
                                )
                                    (<InputNumber placeholder='值' />)
                                }
                            </Form.Item>
                            {index == 0 ? (
                                <div className={styles.addLess}>
                                    <Icon
                                        type="plus"
                                        onClick={conditionAdd}
                                    />
                                    <Icon
                                        type="minus"
                                        onClick={() => conditionLess(index)}
                                    />
                                </div>
                            ) : (
                                    <Icon
                                        type="minus"
                                        onClick={() => conditionLess(index)}
                                    />
                                )}
                        </div>
                    )

                        ;
            });
            //执行列表渲染
            // getFieldDecorator('action', { initialValue: actions });
            // const action = getFieldValue('action');
            const actionForm = actions.map((v, index) => {
                // console.log(v)
                if (switchListArr.length == actions.length)
                    return (
                        <div className={styles.line} key={index}>
                            <Form.Item className={styles.search}>
                                <Tooltip title="设备名称/ID">
                                    {getFieldDecorator(`actionDeviceId[${index}]`,
                                        {
                                            initialValue: v.deviceId || [],
                                            rules: [{ required: true, message: '设备名称不能为空' }]
                                        }
                                    )
                                        (
                                        <Select
                                            placeholder='设备名称/ID'
                                            showSearch
                                            defaultActiveFirstOption={false}
                                            showArrow={false}
                                            filterOption={false}
                                            onSearch={_.debounce((value) => onSearch(value), 300)}
                                            onChange={(value) => onChange(value, index)}
                                            notFoundContent={null}
                                        >
                                            {
                                                deviceList.map((v, i) => {
                                                    return (
                                                        <Option title='设备名称/ID' key={v.deviceId}>{v.deviceId}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                        )
                                    }
                                </Tooltip>
                            </Form.Item>
                            <Form.Item className={styles.search}>
                                {getFieldDecorator(`execCmd[${index}]`,
                                    {
                                        initialValue: v.execCmd,
                                        rules: [{ required: true, message: '请选择指令' }]
                                    }
                                )
                                    (<Select
                                        placeholder='开关阀'
                                    >
                                        {
                                            switchListArr[index].map((v, i) => {
                                                return (
                                                    <Option key={v.cmd}>{v.displayName}</Option>
                                                )
                                            })
                                        }
                                    </Select>)
                                }
                            </Form.Item>
                            {index == 0 ? (
                                <div className={styles.addLess}>
                                    <Icon
                                        type="plus"
                                        onClick={actionAdd}
                                    />
                                    <Icon
                                        type="minus"
                                        onClick={() => actionLess(index)}
                                    />
                                </div>
                            ) : (
                                    <Icon
                                        type="minus"
                                        onClick={() => actionLess(index)}
                                    />
                                )}
                        </div>
                    );
            });
            return (
                <Form className={styles.form}>
                    <div className={styles.Rules}>
                        <Form.Item className={styles.rulesName}>
                            {getFieldDecorator('name', { initialValue: `${name}` })
                                (<Input type='text' />)
                            }
                        </Form.Item>
                        <div className={styles.border}></div>
                    </div>
                    <div className={styles.inner}>
                        <div className={styles.if}>条件</div>
                        <Form.Item className={styles.all}>
                            {getFieldDecorator('anyConditionFireAction', { initialValue: `${anyConditionFireAction}` })
                                (
                                <RadioGroup>
                                    <Radio value="false">全部条件</Radio>
                                    <Radio value="true">部分条件</Radio>
                                </RadioGroup>
                                )
                            }
                        </Form.Item>
                        {/* 条件的添加 */}
                        {/* {conditionForm} */}
                        {
                            conditions.length == 0 ?
                                (
                                    <Form.Item>
                                        <Button className={styles.btnCondition} onClick={conditionAdd}>点此添加条件栏</Button>
                                    </Form.Item>
                                )
                                :
                                conditionForm
                        }

                        <div className={styles.do}>执行</div>
                        {/* 执行的添加 */}

                        {
                            actions.length == 0 ?
                                (
                                    <Form.Item>
                                        <Button className={styles.btnAction} onClick={actionAdd}>点此添加执行栏</Button>
                                    </Form.Item>
                                )
                                :
                                actionForm
                        }
                    </div>
                </Form>
            )
        }
    }
)
