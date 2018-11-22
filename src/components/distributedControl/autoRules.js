import React, { Component } from 'react';
import styles from './autoRules.less';
import { Input, Button, Form, Select,Icon,Radio} from 'antd';
import {Link} from 'dva/router';
const Option = Select.Option;
const RadioGroup = Radio.Group;
//开发地址
const envNet = 'http://192.168.30.127:88';
//生产环境
// const envNet='';
//搜索设备调用
const deviceUrl = `${envNet}/api/device/list`;
export default class extends Component {
    constructor(props) {
        super(props)
        const{autoRules}=props;
        console.log(autoRules.data.data.conditions)
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
          }
        });
      }
    render() {
        const { ruleId,anyConditionFireAction,name,conditions,actions,clength,alength } = this.state;
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
                        {...{ruleId,anyConditionFireAction,name,conditions,actions,clength,alength}}
                    />
                </div>
            </React.Fragment>
        )
    }
}

//搜索表单
const RuleForm = Form.create()(
    class extends React.Component {
        state={
            //设备列表
            deviceList:[],
            //下拉搜索框初始值
            value:undefined
        }
         //下拉搜索框搜索功能
         handleSearch = (value) => {
            if(value==''){
                value=undefined
            }
            console.log(value)
            fetch(buildingUrl, {
                ...postOption,
                body: JSON.stringify({
                    "name": value,
                    "countDevice": true
                })
            }).then(res => {
                Promise.resolve(res.json())
                    .then(v => {
                        if (v.ret == 1) {
                            // 设置页面显示的元素
                            console.log(v.data)
                            let buildingList = v.data
                            this.setState({
                                buildingList,
                                value
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
            const{ruleId,anyConditionFireAction,name,conditions,actions,clength,alength}=this.props
            getFieldDecorator('keys', { initialValue: [] });
            const keys = getFieldValue('keys');
            getFieldDecorator('key', { initialValue: [] });
            const key = getFieldValue('key');
            const formItem = key.map((v,i) => {
                return (
                    <div className={styles.line} key={i}>
                        <Form.Item className={styles.search}>
                            {getFieldDecorator(`deviceId2[${v}]`, {initialValue:''})
                                (
                                <Select
                                    showSearch
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={this.handleSearch}
                                    notFoundContent={null}
                                >
                                    <Option value='' disabled selected style={{display:'none'}}>设备名称/ID</Option>  
                                    <Option value="1">1</Option>
                                    <Option value="2">2</Option>
                                    <Option value="3">3</Option>
                                </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item className={styles.search}>
                        {getFieldDecorator(`switch1[${v}]`, {initialValue:''})
                                (<Select>
                                    <Option value='' disabled selected style={{display:'none'}}>开关阀</Option>  
                                    <Option value="open">开阀</Option>
                                    <Option value="close">关阀</Option>
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
                            {getFieldDecorator(`deviceId3[${v}]`, {initialValue:''})
                                (
                                <Select
                                    showSearch
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={this.handleSearch}
                                    notFoundContent={null}
                                >
                                    <Option value='' disabled selected style={{display:'none'}}>设备名称/ID</Option>  
                                    <Option value="1">1</Option>
                                    <Option value="2">2</Option>
                                    <Option value="3">3</Option>
                                </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item className={styles.search}>
                            {getFieldDecorator(`variate1[${v}]`, {initialValue:''})
                                (<Select>
                                    <Option value='' disabled selected style={{display:'none'}}>状态</Option>  
                                    <Option value="power">电量</Option>
                                    <Option value="water">水量</Option>
                                </Select>)
                            }
                        </Form.Item>
                        <Form.Item className={styles.end}>
                            {getFieldDecorator(`judge1[${v}]`, {initialValue:''})
                                (<Select>
                                    <Option value='' disabled selected style={{display:'none'}}>判断</Option>  
                                    <Option value="high">&gt;</Option>
                                    <Option value="low">&lt;</Option>
                                    <Option value="equal">=</Option>
                                    <Option value="highEq">&gt;=</Option>
                                    <Option value="lowEq">&lt;=</Option>
                                    <Option value="notEq">≠</Option>
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
                            {getFieldDecorator('value', {initialValue:`${name}`})
                                (<Input  type='text'/>)
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
                                        {getFieldDecorator('deviceId', {initialValue:''})
                                            (
                                            <Select
                                                showSearch
                                                defaultActiveFirstOption={false}
                                                showArrow={false}
                                                filterOption={false}
                                                onSearch={this.handleSearch}
                                                notFoundContent={null}
                                            >
                                                <Option value='' disabled selected style={{display:'none'}}>设备名称/ID</Option>  
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                            </Select>
                                            )
                                        }
                                    </Form.Item>
                                    <Form.Item className={styles.search}>
                                        {getFieldDecorator('variate', {initialValue:''})
                                            (<Select>
                                                <Option value='' disabled selected style={{display:'none'}}>状态</Option>  
                                                <Option value="power">电量</Option>
                                                <Option value="water">水量</Option>
                                            </Select>)
                                        }
                                    </Form.Item>
                                    <Form.Item className={styles.end}>
                                        {getFieldDecorator('judge', {initialValue:''})
                                            (<Select>
                                                <Option value='' disabled selected style={{display:'none'}}>判断</Option>  
                                                <Option value="high">&gt;</Option>
                                                <Option value="low">&lt;</Option>
                                                <Option value="equal">=</Option>
                                                <Option value="highEq">&gt;=</Option>
                                                <Option value="lowEq">&lt;=</Option>
                                                <Option value="notEq">≠</Option> 
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
                                                        notFoundContent={null}
                                                    >
                                                        <Option value="1">1</Option>
                                                        <Option value="2">2</Option>
                                                        <Option value="3">3</Option>
                                                    </Select>
                                                    )
                                                }
                                            </Form.Item>
                                            <Form.Item className={styles.search}>
                                                {getFieldDecorator('variate', {initialValue:`${v.parameterId}`})
                                                    (<Select>
                                                        <Option value='' disabled selected style={{display:'none'}}>状态</Option>  
                                                        <Option value="power">电量</Option>
                                                        <Option value="water">水量</Option>
                                                    </Select>)
                                                }
                                            </Form.Item>
                                            <Form.Item className={styles.end}>
                                                {getFieldDecorator('judge', {initialValue:`${v.operator}`})
                                                    (<Select>
                                                        <Option value='' disabled selected style={{display:'none'}}>判断</Option>  
                                                        <Option value="high">&gt;</Option>
                                                        <Option value="low">&lt;</Option>
                                                        <Option value="equal">=</Option>
                                                        <Option value="highEq">&gt;=</Option>
                                                        <Option value="lowEq">&lt;=</Option>
                                                        <Option value="notEq">≠</Option> 
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
                                                        notFoundContent={null}
                                                    >
                                                        <Option value="1">1</Option>
                                                        <Option value="2">2</Option>
                                                        <Option value="3">3</Option>
                                                    </Select>
                                                    )
                                                }
                                            </Form.Item>
                                            <Form.Item className={styles.search}>
                                                {getFieldDecorator('variate', {initialValue:`${v.parameterId}`})
                                                    (<Select>
                                                        <Option value='' disabled selected style={{display:'none'}}>状态</Option>  
                                                        <Option value="power">电量</Option>
                                                        <Option value="water">水量</Option>
                                                    </Select>)
                                                }
                                            </Form.Item>
                                            <Form.Item className={styles.end}>
                                                {getFieldDecorator('judge', {initialValue:`${v.operator}`})
                                                    (<Select>
                                                        <Option value='' disabled selected style={{display:'none'}}>判断</Option>  
                                                        <Option value="high">&gt;</Option>
                                                        <Option value="low">&lt;</Option>
                                                        <Option value="equal">=</Option>
                                                        <Option value="highEq">&gt;=</Option>
                                                        <Option value="lowEq">&lt;=</Option>
                                                        <Option value="notEq">≠</Option> 
                                                    </Select>)
                                                }
                                            </Form.Item>
                                            <Form.Item className={styles.end}>
                                                {getFieldDecorator('value', {initialValue:`${v.compareValue}`})
                                                    (<Input placeholder="值" type='text'/>)
                                                }
                                            </Form.Item>
                                            <Icon type="minus"  onClick={this.removes(v)}/>
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
                                        {getFieldDecorator('deviceId1', {initialValue:''})
                                            (
                                            <Select
                                                showSearch
                                                defaultActiveFirstOption={false}
                                                showArrow={false}
                                                filterOption={false}
                                                onSearch={this.handleSearch}
                                                notFoundContent={null}
                                            >
                                                <Option value='' disabled selected style={{display:'none'}}>设备名称/ID</Option>  
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                            </Select>
                                            )
                                        }
                                    </Form.Item>
                                    <Form.Item className={styles.search}>
                                        {getFieldDecorator('switch', {initialValue:''})
                                            (<Select>
                                                <Option value='' disabled selected style={{display:'none'}}>开关阀</Option>  
                                                <Option value="Valve-OpenA">开阀A</Option>
                                                <Option value="Valve-OpenB">开阀B</Option>
                                                <Option value="Valve-Close">关阀</Option>
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
                                                    notFoundContent={null}
                                                >
                                                    <Option value="1">1</Option>
                                                    <Option value="2">2</Option>
                                                    <Option value="3">3</Option>
                                                </Select>
                                                )
                                            }
                                        </Form.Item>
                                        <Form.Item className={styles.search}>
                                            {getFieldDecorator('switch', {initialValue:`${v.execCmd}`})
                                                (<Select>
                                                    <Option value='' disabled selected style={{display:'none'}}>开关阀</Option>  
                                                    <Option value="Valve-OpenA">开阀A</Option>
                                                    <Option value="Valve-OpenB">开阀B</Option>
                                                    <Option value="Valve-Close">关阀</Option>
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
                                                        notFoundContent={null}
                                                    >
                                                        <Option value="1">1</Option>
                                                        <Option value="2">2</Option>
                                                        <Option value="3">3</Option>
                                                    </Select>
                                                    )
                                                }
                                            </Form.Item>
                                            <Form.Item className={styles.search}>
                                                {getFieldDecorator('switch', {initialValue:`${v.execCmd}`})
                                                    (<Select>
                                                        <Option value='' disabled selected style={{display:'none'}}>开关阀</Option>  
                                                        <Option value="Valve-OpenA">开阀A</Option>
                                                        <Option value="Valve-OpenB">开阀B</Option>
                                                        <Option value="Valve-Close">关阀</Option>
                                                    </Select>)
                                                }
                                            </Form.Item>
                                            <Icon 
                                                type="minus"
                                                onClick={this.remove(v)}
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
