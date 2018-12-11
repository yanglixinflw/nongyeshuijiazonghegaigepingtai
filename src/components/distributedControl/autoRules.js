import React, { Component } from 'react';
import styles from './autoRules.less';
import { Input, Button, Form, Select,Icon,Radio,message,InputNumber} from 'antd';
import {getAutoRules} from '../../services/api'
import {Link} from 'dva/router';
const Option = Select.Option;
const RadioGroup = Radio.Group;
import {ENVNet,postOption} from '../../services/netCofig'
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
        const{autoRules}=props;
        // console.log(props)
        this.state={
            //规则id
            ruleId:props.ruleId,
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
            //条件初始数组
            conditionArr:[],
            //执行初始数组
            actionArr:[],
        }
    }
    //保存
    _save () {
        this.ruleForm.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                //针对compareValue出现的问题，先将其转换为字符串型，再转换回数组,并将数组元素的双引号去掉  
                // console.log(values)
                // let valueArr=values.compareValue
                // let valueString=valueArr.join("-")
                // valueArr=valueString.split('-')
                // for(var i=0;i<valueArr.length;i++){
                //     valueArr[i]=parseInt(valueArr[i])
                // }
                //拼接数组conditions
                if(typeof(values.actionDeviceId) !=='undefined' && typeof(values.conditionDeviceId) !=='undefined'){
                    var conditions=[];
                    values.conditionDeviceId.map((v,i)=>{
                        let obj={
                            deviceId:v,
                            parameterId:values.parameterId[i],
                            operator:values.operator[i],
                            compareValue:values.compareValue[i]
                        }
                        conditions.push(obj)
                    })
                    //拼接数组actions
                    var actions=[];
                    values.actionDeviceId.map((v,i)=>{
                        let obj={
                            deviceId:v,
                            execCmd:values.execCmd[i]
                        }
                        actions.push(obj)
                    })
                    //保存
                    fetch(saveUrl,{
                        ...postOption,
                        body:JSON.stringify({
                            "ruleId":this.state.ruleId,
                            'anyConditionFireAction':values.anyConditionFireAction,
                            'name':values.name,
                            conditions,
                            actions
                        })
                    }).then(res=>{
                        Promise.resolve(res.json())
                        .then(v=>{
                            if(v.ret==1){
                                //重新获取页面
                                fetch(ruleUrl,{
                                    ...postOption,
                                    body:JSON.stringify({
                                        "ruleId":this.state.ruleId,
                                    })
                                }).then(res=>{
                                    Promise.resolve(res.json())
                                    .then(v=>{
                                        if(v.ret==1){
                                            message.success(`${values.name}保存成功`, 2);
                                            this.setState({
                                                anyConditionFireAction:v.data.anyConditionFireAction,
                                                name:v.data.name,
                                                conditions:v.data.conditions,
                                                actions:v.data.actions
                                            })
                                        }
                                    })    
                                })
                            }
                        })
                    })
                }else{
                    if(typeof(values.conditionDeviceId) =='undefined'){
                        message.error('您还未添加条件栏',2)
                    }else if(typeof(values.actionDeviceId) =='undefined'){
                        message.error('您还未添加执行栏',2)
                    }
                }
            }
                
        });
    }
    //重置
    _resetForm() {
        this.ruleForm.props.form.resetFields();
        const {ruleId} = this.state;
        Promise.resolve(getAutoRules({ruleId}))
        .then((v)=>{
            if(v.data.ret==1){
                // console.log(v.data)
                let actions = v.data.data.actions;
                let anyConditionFireAction = v.data.data.anyConditionFireAction;
                let conditions = v.data.data.conditions;
                let name = v.data.data.name;
                this.setState({
                    actions,
                    anyConditionFireAction,
                    conditions,
                    name,
                    conditionArr:[],
                    actionArr:[]
                })
            }
        })
         
    }
    render() {
        const { anyConditionFireAction,name,conditions,actions,conditionArr,actionArr } = this.state;
        return (
            <React.Fragment>
                <div className={styles.headers}>
                    {/* <div className={styles.left}>
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
                    </div> */}
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
                        {...{anyConditionFireAction,name,conditions,actions,conditionArr,actionArr}}
                    />
                </div>
            </React.Fragment>
        )
    }
}

//规则表单
const RuleForm = Form.create()(
    class extends React.Component {
        state={
            //设备列表
            deviceList:[],
            //参数id列表
            parameterIdList:[],
            //开关阀列表
            switchList:[],
            //条件数组
            conditions:this.props.conditions,
            //执行数组
            actions:this.props.actions,
        }
        // console.log(this.state.conditionArr)
    
         //下拉搜索框搜索功能
         handleSearch = (value) => {
            // this.setState({
            //     deviceList:[]
            // })
            // console.log(this.state.deviceList)
            // console.log(value)
            if(value==''){
                this.setState({
                    deviceList:[]
                })
                return
            }
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
            // console.log(value)
            this.setState({
                deviceList:[]
            })
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
                            //获取参数的信息
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
                            //获取开关的信息
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
            const { form,conditionArr } = this.props;
            // const {conditionArr}=this.state
            conditionArr.pop(v)
            const condition = form.getFieldValue('condition');
            // if (condition.length === 1) {
            //   return;
            // }
            //可以使用数据绑定来设置
            form.setFieldsValue({
                condition: condition.filter(key => key !== v),
            });
            this.setState({
                conditionArr
            })
          }
          conditionAdd = () => {
            const { form,conditionArr} = this.props;
            //conditionArr不存在的时候就让“点此添加一行”显现
            // const {conditionArr}=this.state
            conditionArr.push(conditionArr.length)
            const condition = form.getFieldValue('condition');
            //得到添加数量的数组
            const nextCondition = condition.concat({});
            // 可以使用数据绑定来设置
            // 重要!通知表单以检测更改
            form.setFieldsValue({
                condition: nextCondition,
            });
            this.setState({
                conditionArr
            })
        }
//执行的++--
        actionRemove = (v) => {
            const { form,actionArr } = this.props;
            // const {actionArr}=this.state
            actionArr.pop(v)
            const action = form.getFieldValue('action');
            // if (action.length === 1) {
            // return;
            // }
            //可以使用数据绑定来设置
            form.setFieldsValue({
                action: action.filter(key => key !== v),
            });
            this.setState({
                actionArr
            })
        }
        actionAdd = () => {
            const { form,actionArr } = this.props;
            const action = form.getFieldValue('action');
            //actionArr不存在的时候就让“点此添加一行”显现
            // const {actionArr}=this.state;
            actionArr.push(actionArr.length)
            //得到添加数量的数组
            const nextAction = action.concat({});
            // 可以使用数据绑定来设置
            // 重要!通知表单以检测更改
            form.setFieldsValue({
                action: nextAction,
            });
            this.setState({
                actionArr
            })
        }
        render() {
            const {conditionArr,actionArr}=this.props;
            const { getFieldDecorator, getFieldValue } = this.props.form;
            const{ anyConditionFireAction,name }=this.props
            const {deviceList,parameterIdList,switchList,actions,conditions}=this.state
            //条件列表渲染
            getFieldDecorator('condition', { initialValue: conditions });
            const condition = getFieldValue('condition');
            const conditionForm = condition.map((v,i) => {
                return (
                    <div className={styles.line} key={i}>
                        <Form.Item className={styles.search}>
                            {getFieldDecorator(`conditionDeviceId[${i}]`, 
                                {   
                                    initialValue: v.deviceName || [] ,
                                    rules: [{ required: true, message: '设备名称不能为空' }]
                                }
                                )
                                (
                                <Select
                                    showSearch
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={this.handleSearch}
                                    onChange={this.handleChange}
                                    notFoundContent={null}
                                    placeholder='设备名称/ID'
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
                            {getFieldDecorator(`parameterId[${i}]`, 
                                {
                                    initialValue: v.parameterId || [],
                                    rules: [{ required: true, message: '请选择参数' }]
                                }
                                )
                                (<Select
                                    placeholder='参数'
                                > 
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
                            {getFieldDecorator(`operator[${i}]`, 
                                {   
                                    initialValue: v.operator ||[],
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
                            {getFieldDecorator(`compareValue[${i}]`, 
                                {
                                    initialValue: v.compareValue || '',
                                    rules: [{ required: true, message: '判断值不能为空' }]
                                }
                                )
                                (<InputNumber  placeholder='值'/>)
                            }
                        </Form.Item>
                        {i==0 ? (
                            <div className={styles.addLess}>
                                <Icon 
                                    type="plus" 
                                    onClick={() => this.conditionAdd(v)}
                                />
                                <Icon 
                                    type="minus" 
                                    onClick={() => this.conditionRemove(v)}
                                />
                            </div>
                        ) : (
                            <Icon 
                                type="minus" 
                                onClick={() => this.conditionRemove(v)}
                            />
                        )}
                    </div>
                );
            });
            //执行列表渲染
            getFieldDecorator('action', { initialValue: actions});
            const action = getFieldValue('action');
            const actionForm = action.map((v,i) => {
                return (
                    <div className={styles.line} key={i}>
                        <Form.Item className={styles.search}>
                            {getFieldDecorator(`actionDeviceId[${i}]`, 
                                {
                                    initialValue: v.deviceName,
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
                        {getFieldDecorator(`execCmd[${i}]`, 
                            {
                                initialValue: v.execCmd,
                                rules: [{ required: true, message: '请选择指令' }]
                            }
                            )
                                (<Select
                                    placeholder='开关阀'
                                >
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
                            <div className={styles.addLess}>
                                <Icon 
                                    type="plus" 
                                    onClick={() => this.actionAdd(v)}
                                />
                                <Icon 
                                    type="minus" 
                                    onClick={() => this.actionRemove(v)}
                                />
                            </div>
                        ) : (
                            <Icon 
                                type="minus" 
                                onClick={() => this.actionRemove(v)}
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
                        <Form.Item>
                            {conditionArr.length==0&&condition.length==0?(<Button style={{color:"rgba(187,197,210,1)",width:"200px",height:"36px",fontSize:'16px',textAlign:'center',lineHeight:'36px',background:'rgba(20,24,49,1)'}} onClick={() => this.conditionAdd()}>点此添加条件栏</Button>):null}
                        </Form.Item> 
                        <div className={styles.do}>执行</div>
                        {/* 执行的添加 */}
                        {actionForm}
                        <Form.Item>
                            {actionArr.length==0&&action.length==0?(<Button style={{color:"rgba(187,197,210,1)",width:"200px",height:"36px",fontSize:'16px',textAlign:'center',lineHeight:'36px',background:'rgba(20,24,49,1)'}} onClick={() => this.actionAdd()}>点此添加执行栏</Button>):null}
                        </Form.Item>
                    </div>
                </Form>
            )
        }
    }
)
