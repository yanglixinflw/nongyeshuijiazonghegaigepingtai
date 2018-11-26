import React, { Component } from 'react';
import styles from './autoRules.less';
import { Input, Button, Form, Select,Icon,Radio,message} from 'antd';
import {Link} from 'dva/router';
const Option = Select.Option;
const RadioGroup = Radio.Group;
//开发地址
const envNet = 'http://192.168.30.127:88';
//生产环境
// const envNet='';
// post通用设置
let postOption = {
    method: 'POST',
    credentials: "include",
    mode: 'cors',
    headers: new Headers({
        'Content-Type': 'application/json',
    }),
}
//搜索设备调用
const deviceUrl = `${envNet}/api/device/list`;
//获取设备参数列表
const paramUrl = `${envNet}/api/DeviceType/deviceParameters`;
//获取开关阀列表
const switchUrl = `${envNet}/api/device/control/cmdList`;
//保存数据
const saveUrl = `${envNet}/api/Automatic/saveRuleSettings`
//获取规则详情
const ruleUrl = `${envNet}/api/Automatic/getRuleSettings`
export default class extends Component {
    constructor(props) {
        super(props)
        const{autoRules}=props;
        // console.log(autoRules)
        this.state={
            //规则id
            ruleId:autoRules.data.data.ruleId,
            //全部/部分
            anyConditionFireAction:autoRules.data.data.anyConditionFireAction,
            //规则名称
            name:autoRules.data.data.name,
            //条件数组
            conditions:autoRules.data.data.conditions,
            //条件数组的长度
            clength:autoRules.data.data.conditions.length,
            //执行数组
            actions:autoRules.data.data.actions,
            //执行数组的长度
            alength:autoRules.data.data.actions.length,
        }
    }
    _save () {
        this.ruleForm.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);    
                // fetch(saveUrl,{
                //     ...postOption,
                //     body:JSON.stringify({
                //         "ruleId":this.state.ruleId,
                //         'anyConditionFireAction':values.condition,
                //         'name':values.name,
                //         conditions:,
                //         actions
                //     })
                // }).then(res=>{
                //     Promise.resolve(res.json())
                //     .then(v=>{
                //         if(v.ret==1){
                //             fetch(ruleUrl,{
                //                 ...postOption,
                //                 body:JSON.stringify({
                //                     ruleId
                //                 })
                //             }).then(res=>{
                //                 Promise.resolve(res.json())
                //                 .then(v=>{
                //                     if(v.ret==1){
                //                         console.log(v.data)
                //                         message.success('保存成功', 2);
                //                         this.setState({
                //                             anyConditionFireAction:v.data.anyConditionFireAction,
                //                             name:v.data.name,
                //                             conditions:v.data.conditions,
                //                             actions:v.data.actions
                //                         })
                //                     }
                //                 })    
                //             })
                //         }
                //     })
                // })
            }
        });
    }
    //重置
    _resetForm() {
        this.ruleForm.props.form.resetFields()
        let actions=[{deviceId:'',execCmd:''}]
        let conditions=[{deviceId:'',parameterId:'',operator:'',value:''}]
        this.setState({
            actions,
            anyConditionFireAction:'',
            name:'',
            conditions
        })  
    }
    render() {
        const { anyConditionFireAction,name,conditions,actions } = this.state;
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
                    <RuleForm
                        wrappedComponentRef={(ruleForm) => this.ruleForm = ruleForm}
                        {...{anyConditionFireAction,name,conditions,actions}}
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
        this.state={
            //条件初始数组
            conditionArr:[],
            //执行初始数组
            actionArr:[],
            //设备列表
            deviceList:[],
            //参数id列表
            parameterIdList:[],
            //开关阀列表
            switchList:[],
            //条件数组
            conditions:this.props.conditions,
            //条件数组的长度
            clength:this.props.conditions.length,
            //执行数组
            actions:this.props.actions,
            //执行数组的长度
            alength:this.props.actions.length,
        }
    }
         //下拉搜索框搜索功能
         handleSearch = (value) => {
            console.log(value)
            fetch(deviceUrl, {
                ...postOption,
                body: JSON.stringify({
                    "name":value,
                    "pageIndex": 0,
                    "pageSize": 10
                })
            }).then(res => {
                Promise.resolve(res.json())
                    .then(v => {
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
        //option的value值就是设备ID
        handleChange = (value) => {
            console.log(value)
            fetch(deviceUrl, {
                ...postOption,
                body: JSON.stringify({
                    "deviceId":value,
                    "pageIndex": 0,
                    "pageSize": 1
                })
            }).then(res => {
                Promise.resolve(res.json())
                    .then(v => {
                        if (v.ret == 1) {
                            // 设置页面显示的元素
                            let deviceTypeId = v.data.items[0].deviceTypeId
                            this.setState({
                                value
                            })
                            fetch(paramUrl,{
                                ...postOption,
                                body:JSON.stringify({
                                    deviceTypeId
                                })
                            }).then(res=>{
                                Promise.resolve(res.json())
                                .then(v=>{
                                    if(v.ret==1){
                                        let parameterIdList=v.data
                                        this.setState({
                                            parameterIdList
                                        })
                                    }
                                })
                            }),
                            fetch(switchUrl,{
                                ...postOption,
                                body:JSON.stringify({
                                    deviceTypeId
                                })
                            }).then(res=>{
                                Promise.resolve(res.json())
                                .then(v=>{
                                    if(v.ret==1){
                                        let switchList=v.data
                                        this.setState({
                                            switchList
                                        })
                                    }
                                })
                            })
                        }
                    })
            }).catch(err => {
                console.log(err)
            })
        }
//条件的++ --
        conditionRemove = (v) => {
            const { form } = this.props;
            const condition = form.getFieldValue('condition');
            if (condition.length === 1) {
              return;
            }
            //可以使用数据绑定来设置
            form.setFieldsValue({
                condition: condition.filter(key => key !== v),
            });
          }
          conditionAdd = () => {
            const { form } = this.props;
            const {conditionArr}=this.state
            conditionArr.push(conditionArr.length)
            const condition = form.getFieldValue('condition');
            //得到添加数量的数组
            const nextCondition = condition.concat({});
            // 可以使用数据绑定来设置
            // 重要!通知表单以检测更改
            form.setFieldsValue({
                condition: nextCondition,
                conditionArr
            });
        }
//执行的++--
        actionRemove = (v) => {
            const { form } = this.props;
            const action = form.getFieldValue('action');
            // const content = form.getFieldValue('content');
            if (action.length === 1) {
            return;
            }
            //可以使用数据绑定来设置
            form.setFieldsValue({
                action: action.filter(key => key !== v),
                // content: content.filter( key => key !== v),
            });
        }
        actionAdd = () => {
            const { form } = this.props;
            const action = form.getFieldValue('action');
            const {actionArr}=this.state;
            actionArr.push(actionArr.length)
            //得到添加数量的数组
            // console.log(key)
            const nextAction = action.concat({});
            // 可以使用数据绑定来设置
            // 重要!通知表单以检测更改
            form.setFieldsValue({
                action: nextAction,
                actionArr
            });
        }
        render() {
            const { getFieldDecorator, getFieldValue } = this.props.form;
            const{ anyConditionFireAction,name }=this.props
            const {deviceList,parameterIdList,switchList,actions,conditions,actionArr,conditionArr}=this.state
            getFieldDecorator('condition', { initialValue: conditions });
            const condition = getFieldValue('condition');
            getFieldDecorator('action', { initialValue: actions});
            const action = getFieldValue('action');
            const actionForm = action.map((v,i) => {
                return (
                    <div className={styles.line} key={i}>
                        <Form.Item className={styles.search}>
                            {getFieldDecorator(`actionsDeviceId[${i}]`, {initialValue: v.deviceId || '设备名称/ID'})
                                (
                                <Select
                                    showSearch
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={this.handleSearch}
                                    onChange={this.handleChange}
                                    notFoundContent={null}
                                >
                                    {
                                        deviceList.map((v,i)=>{
                                            return(
                                                <Option value={v.deviceId} key={i}>{v.name}</Option> 
                                            )
                                        })
                                    }
                                </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item className={styles.search}>
                        {getFieldDecorator(`execCmd[${i}]`, {initialValue: v.execCmd || '开关阀'})
                                (<Select>
                                    {
                                        switchList.map((v,i)=>{
                                            return(
                                                <Option value={v.cmd} key={i}>{v.displayName}</Option> 
                                            )
                                        })
                                    }
                                </Select>)
                            }
                        </Form.Item>
                        {i==0 ? (
                            <Icon 
                                type="plus" 
                                onClick={() => this.actionAdd(v)}
                            />
                        ) : (
                            <Icon 
                                type="minus" 
                                onClick={() => this.actionRemove(v)}
                            />
                        )}
                    </div>
                );
              });
            const conditionForm = condition.map((v,i) => {
                return (
                    <div className={styles.line} key={i}>
                        <Form.Item className={styles.search}>
                            {getFieldDecorator(`conditionDeviceId[${i}]`, {initialValue: v.deviceId || '设备名称/ID'})
                                (
                                <Select
                                    showSearch
                                    // placeholder=''
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={this.handleSearch}
                                    onChange={this.handleChange}
                                    notFoundContent={null}
                                > 
                                    {
                                        deviceList.map((v,i)=>{
                                            return(
                                                <Option value={v.deviceId} key={i}>{v.name}</Option> 
                                            )
                                        })
                                    }
                                </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item className={styles.search}>
                            {getFieldDecorator(`parameterId[${i}]`, {initialValue: v.parameterId || '参数'})
                                (<Select> 
                                    {
                                        parameterIdList.map((v,i)=>{
                                            return(
                                                <Option value={v.parameterId} key={i}>{v.name}</Option> 
                                            )
                                        })
                                    }
                                </Select>)
                            }
                        </Form.Item>
                        <Form.Item className={styles.end}>
                            {getFieldDecorator(`operator[${i}]`, {initialValue: v.operator || '判断'})
                                (<Select>
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
                            {getFieldDecorator(`compareValue[${i}]`, {initialValue: v.compareValue || ''})
                                (<Input placeholder='值' type='number'/>)
                            }
                        </Form.Item>
                        {i==0 ? (
                            <Icon 
                                type="plus" 
                                onClick={() => this.conditionAdd(v)}
                            />
                        ) : (
                            <Icon 
                                type="minus" 
                                onClick={() => this.conditionRemove(v)}
                            />
                        )}
                    </div>
                );
              });
            return (
                <Form className={styles.form}>
                    <div className={styles.Rules}>
                        <Form.Item className={styles.rulesName}>
                            {getFieldDecorator('name', {initialValue:`${name}`})
                                (<Input type='text'/>)
                            }
                        </Form.Item>
                        <div className={styles.border}></div>
                    </div>
                    <div className={styles.inner}>
                        <div className={styles.if}>条件</div>
                        <Form.Item className={styles.all}>
                            {getFieldDecorator('anyConditionFireAction', {initialValue:`${anyConditionFireAction}`})
                                (
                                <RadioGroup>
                                    <Radio value="false">全部条件</Radio>
                                    <Radio value="true">部分条件</Radio>
                                </RadioGroup>
                                )
                            }
                        </Form.Item>
                        {/* 条件的添加 */}
                        {conditionForm} 
                        {conditionArr.length==0?(<div style={{color:"rgba(187,197,210,1)",width:"200px",height:"36px",fontSize:'16px',textAlign:'center',lineHeight:'36px',background:'rgba(20,24,49,1)'}} onClick={() => this.conditionAdd()}>点此添加条件栏</div>):null}
                        <div className={styles.do}>执行</div>
                        {/* 执行的添加 */}
                        {actionForm}
                        {actionArr.length==0?(<div style={{color:"rgba(187,197,210,1)",width:"200px",height:"36px",fontSize:'16px',textAlign:'center',lineHeight:'36px',background:'rgba(20,24,49,1)'}} onClick={() => this.actionAdd()}>点此添加执行栏</div>):null}
                    </div>
                </Form>
            )
        }
    }
)
