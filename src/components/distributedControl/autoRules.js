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
        //得到ruleID
        const {ruleId}=this.state
        this.ruleForm.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                //得到全部条件/部分条件
                let anyConditionFireAction=values.condition;
                //得到规则名称
                let name=values.name
                let conditions=[],deviceId1=[],parameterId=[],operator=[],value=[],deviceId3=[];
                let actions=[], deviceId2=[],execCmd=[],deviceId4=[]
                //得到条件的deviceId
                if(values.deviceId3!=undefined){
                    values.deviceId3.push(values.deviceId);
                    deviceId1.push(values.deviceId3)
                    deviceId3=deviceId1[0]
                }else{
                    deviceId1.push(values.deviceId)
                    deviceId3=deviceId1
                }
                //得到参数
                if(values.variate1!=undefined){
                    values.variate1.push(values.variate);
                    parameterId.push(values.variate1)
                }else{
                    parameterId.push(values.variate)
                }
                //得到判断条件
                if(values.judge1!=undefined){
                    values.judge1.push(values.judge)
                    operator.push(values.judge1)
                }else{
                    operator.push(values.judge)
                }
                //得到值
                if(values.value1!=undefined){
                    values.value1.push(values.value)
                    value.push(values.value1)
                }else{
                    value.push(values.value)
                }
                //得到条件数据
                deviceId3.map((v,i) => {
                    let obj = {
                        deviceid:v,
                        parameterId:parameterId[0][i],
                        operator:operator[0][i],
                        value:value[0][i]
                    }
                    conditions.push(obj)
                })
                //得到执行的deviceId
                if(values.deviceId2!=undefined){
                    values.deviceId2.push(values.deviceId1)
                    deviceId2.push(values.deviceId2)
                    deviceId4=deviceId2[0]
                }else{
                    deviceId2.push(values.deviceId1)
                    deviceId4=deviceId2
                }
                //得到开关条件
                if(values.switch1=undefined){
                    values.switch1.push(values.switch)
                    execCmd.push(values.switch1)
                }else{
                    execCmd.push(values.switch)
                }
                //得到执行的数据
                deviceId4.map((v,i)=>{
                    let objs={
                        deviceId:v,
                        execCmd:execCmd[0][i]
                    }
                    actions.push(objs)
                })
                fetch(saveUrl,{
                    ...postOption,
                    body:JSON.stringify({
                        ruleId,
                        anyConditionFireAction,
                        name,
                        conditions,
                        actions
                    })
                }).then(res=>{
                    Promise.resolve(res.json())
                    .then(v=>{
                        if(v.ret==1){
                            fetch(ruleUrl,{
                                ...postOption,
                                body:JSON.stringify({
                                    ruleId
                                })
                            }).then(res=>{
                                Promise.resolve(res.json())
                                .then(v=>{
                                    if(v.ret==1){
                                        console.log(v.data)
                                        message.success('保存成功', 2);
                                        this.setState({
                                            anyConditionFireAction:v.data.anyConditionFireAction,
                                            name:v.data.name,
                                            conditions:v.data.condition,
                                            actions:v.data.actions
                                        })
                                    }
                                })    
                            })
                        }
                    })
                })
            }
        });
    }
    //重置
    _resetForm() {
        this.ruleForm.props.form.resetFields()
        this.ruleForm.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                if(values.name!=''){
                    values.name=''
                }
                if(values.deviceId!=''){
                    values.deviceId=''
                }
                if(values.deviceId1!=''){
                    values.deviceId1=''
                }
                if(values.deviceId2!=''){
                    values.deviceId2=''
                }
                if(values.deviceId3!=''){
                    values.deviceId3=''
                }
                if(values.judge!=''){
                    values.judge=''
                }
                if(values.judge1!=''){
                    values.judge1=''
                }
                if(values.switch!=""){
                    values.switch=""
                }
                if(values.switch1!=''){
                    values.switch1=''
                }
                if(values.value!=''){
                    values.value=''
                }
                if(values.value1!=''){
                    values.value1=''
                }
                if(values.variate!=''){
                    values.variate=''
                }
                if(values.variate1!=''){
                    values.variate1=''
                }
                if(values.condition!=''){
                    values.condition=''
                }
                let anyConditionFireAction=values.condition;
                //得到规则名称
                let name=values.name
                let conditions=[],deviceId1=[],parameterId=[],operator=[],value=[];
                let actions=[], deviceId2=[],execCmd=[]
                //得到条件的deviceId
                deviceId1.push(values.deviceId)
                //得到参数
                parameterId.push(values.variate)
                //得到判断条件
                operator.push(values.judge)
                //得到值
                value.push(values.value)
                //得到条件数据
                deviceId1.map((v,i) => {
                    let obj = {
                        deviceid:v,
                        parameterId:parameterId[i],
                        operator:operator[i],
                        value:value[i]
                    }
                    conditions.push(obj)
                })
                //得到执行的deviceId
                deviceId2.push(values.deviceId1)
                //得到开关条件
                execCmd.push(values.switch)
                //得到执行的数据
                deviceId2.map((v,i)=>{
                    let objs={
                        deviceId:v,
                        execCmd:execCmd[i]
                    }
                    actions.push(objs)
                })
                this.setState({
                    actions,
                    anyConditionFireAction,
                    name,
                    conditions
                })
            }
        })
    }
    render() {
        const { anyConditionFireAction,name,conditions,actions,clength,alength } = this.state;
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
                        {...{anyConditionFireAction,name,conditions,actions,clength,alength}}
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
            //下拉搜索框初始值
            value:undefined,
            //参数id列表
            parameterIdList:[],
            //开关阀列表
            switchList:[]
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
        remove = (v) => {
            const { form } = this.props;
            const keys = form.getFieldValue('keys');
            if (keys.length === 0) {
              return;
            }
            //可以使用数据绑定来设置
            form.setFieldsValue({
              keys: keys.filter(key => key !== v),
            });
          }
         add = () => {
            const { form } = this.props;
            const keys = form.getFieldValue('keys');
            //得到添加数量的数组
            // console.log(keys)
            const nextKeys = keys.concat(keys.length);
            console.log(nextKeys)
            // 可以使用数据绑定来设置
            // 重要!通知表单以检测更改
            form.setFieldsValue({
              keys: nextKeys,
            });
        }
//执行的++--
        removes = (v) => {
            const { form } = this.props;
            const key = form.getFieldValue('key');
            if (key.length === 0) {
            return;
            }
            //可以使用数据绑定来设置
            form.setFieldsValue({
            key: key.filter(key => key !== v),
            });
        }
        adds = () => {
            const { form } = this.props;
            const key = form.getFieldValue('key');
            //得到添加数量的数组
            // console.log(key)
            const nextKey = key.concat(key.length);
            console.log(nextKey)
            // 可以使用数据绑定来设置
            // 重要!通知表单以检测更改
            form.setFieldsValue({
            key: nextKey,
            });
        }
        render() {
            const { getFieldDecorator, getFieldValue } = this.props.form;
            const{anyConditionFireAction,name,conditions,actions,clength,alength}=this.props
            const {deviceList,parameterIdList,switchList}=this.state
            getFieldDecorator('keys', { initialValue: [] });
            const keys = getFieldValue('keys');
            getFieldDecorator('key', { initialValue: [] });
            const key = getFieldValue('key');
            const formItem = key.map((v,i) => {
                return (
                    <div className={styles.line} key={i}>
                        <Form.Item className={styles.search}>
                            {getFieldDecorator(`deviceId2[${v}]`, {initialValue:'设备名称/ID'})
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
                        {getFieldDecorator(`switch1[${v}]`, {initialValue:'开关阀'})
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
                        {key.length > 0 ? (
                            <Icon 
                                type="minus" 
                                disabled={keys.length === 1}
                                onClick={() => this.removes(v)}
                            />
                        ) : null}
                    </div>
                );
              });
            const formItems = keys.map((v,i) => {
                return (
                    <div className={styles.line} key={i}>
                        <Form.Item className={styles.search}>
                            {getFieldDecorator(`deviceId3[${v}]`, {initialValue:'设备名称/ID'})
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
                            {getFieldDecorator(`variate1[${v}]`, {initialValue:'参数'})
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
                            {getFieldDecorator(`judge1[${v}]`, {initialValue:'判断'})
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
                            {getFieldDecorator(`value1[${v}]`, {initialValue:''})
                                (<Input placeholder="值" type='text'/>)
                            }
                        </Form.Item>
                        {keys.length > 0 ? (
                            <Icon 
                                type="minus" 
                                disabled={keys.length === 1}
                                onClick={() => this.remove(v)}
                            />
                        ) : null}
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
                            {getFieldDecorator('condition', {initialValue:`${anyConditionFireAction}`})
                                (
                                <RadioGroup>
                                    <Radio value="false">全部条件</Radio>
                                    <Radio value="true">部分条件</Radio>
                                </RadioGroup>
                                )
                            }
                        </Form.Item>
                        {/* 条件的添加 */}
                        {formItems}
                        {
                            clength==0?(
                                <div className={styles.line}>
                                    <Form.Item className={styles.search}>
                                        {getFieldDecorator('deviceId', {initialValue:'设备名称/ID'})
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
                                        {getFieldDecorator('variate', {initialValue:'参数'})
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
                                        {getFieldDecorator('judge', {initialValue:'判断'})
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
                                        {getFieldDecorator('value', {initialValue:''})
                                            (<Input placeholder="值" type='text'/>)
                                        }
                                    </Form.Item>
                                    <Icon type="plus" onClick={this.add}/>
                                </div>
                            ):conditions.map((v,i)=>{
                                if(conditions.length-1==i){
                                    return(
                                        <div className={styles.line} key={i}>
                                            <Form.Item className={styles.search}>
                                                {getFieldDecorator('deviceId', {initialValue:`${v.deviceId}`})
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
                                                {getFieldDecorator('variate', {initialValue:`${v.parameterId}`})
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
                                                {getFieldDecorator('judge', {initialValue:`${v.operator}`})
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
                                                {getFieldDecorator('value', {initialValue:`${v.compareValue}`})
                                                    (<Input placeholder="值" type='text'/>)
                                                }
                                            </Form.Item>
                                            <Icon type="plus" onClick={this.add}/>
                                        </div>
                                    )
                                }else{
                                    return(
                                        <div className={styles.line} key={i}>
                                            <Form.Item className={styles.search}>
                                                {getFieldDecorator('deviceId', {initialValue:`${v.deviceId}`})
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
                                                {getFieldDecorator('variate', {initialValue:`${v.parameterId}`})
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
                                                {getFieldDecorator('judge', {initialValue:`${v.operator}`})
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
                                                {getFieldDecorator('value', {initialValue:`${v.compareValue}`})
                                                    (<Input placeholder="值" type='text'/>)
                                                }
                                            </Form.Item>
                                            <Icon type="minus"  onClick={this.remove(v)}/>
                                        </div>
                                    )
                                }
                            })
                        }
                        <div className={styles.do}>执行</div>
                        {/* 执行的添加 */}
                        {formItem}
                        {
                            alength==0?(
                                <div className={styles.line}>
                                    <Form.Item className={styles.search}>
                                        {getFieldDecorator('deviceId1', {initialValue:'设备名称/ID'})
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
                                        {getFieldDecorator('switch', {initialValue:'开关阀'})
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
                                    <Icon 
                                        type="plus" 
                                        onClick={this.adds}
                                    />
                                </div>
                            ):actions.map((v,i)=>{
                                if(actions.length-1==i){
                                    return(
                                        <div className={styles.line} key={i}>
                                        <Form.Item className={styles.search}>
                                            {getFieldDecorator('deviceId1', {initialValue:`${v.deviceId}`})
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
                                            {getFieldDecorator('switch', {initialValue:`${v.execCmd}`})
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
                                        <Icon 
                                            type="plus" 
                                            onClick={this.adds}
                                        />
                                    </div>
                                    )
                                }else{
                                    return(
                                        <div className={styles.line} key={i}>
                                            <Form.Item className={styles.search}>
                                                {getFieldDecorator('deviceId1', {initialValue:`${v.deviceId}`})
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
                                                {getFieldDecorator('switch', {initialValue:`${v.execCmd}`})
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
                                            <Icon 
                                                type="minus"
                                                onClick={this.removes(v)}
                                            />
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                </Form>
            )
        }
    }
)
