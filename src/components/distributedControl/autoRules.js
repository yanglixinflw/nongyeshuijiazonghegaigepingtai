import React, { Component } from 'react';
import styles from './autoRules.less';
import { Input, Button, Form, Select,Icon} from 'antd';
import {Link} from 'dva/router';
const Option = Select.Option;
export default class extends Component {
    constructor(props) {
        super(props)
        this.state={
            //遍历数组增删表格行
            arr:[]
        }
    }
    //可输入的select框执行的方法
    handleChange(value) {
        console.log(`selected ${value}`);
    }
    handleBlur() {
        console.log('blur');
    } 
    handleFocus() {
        console.log('focus');
    }
    _save () {
        this.ruleForm.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
      }
    render() {
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
                        onChange={()=>this.handleChange()}
                        onFocus={()=>this.handleFocus()}
                        onBlur={()=>this.handleBlur()}
                    />
                </div>
            </React.Fragment>
        )
    }
}

//搜索表单
const RuleForm = Form.create()(
    class extends React.Component {
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
            const { getFieldDecorator, getFieldValue,handleChange,handleFocus,handleBlur} = this.props.form;
            getFieldDecorator('keys', { initialValue: [] });
            const keys = getFieldValue('keys');
            getFieldDecorator('key', { initialValue: [] });
            const key = getFieldValue('key');
            const formItem = key.map((v,i) => {
                return (
                    <div className={styles.line} key={v}>
                        <Form.Item className={styles.search}>
                            {getFieldDecorator('deviceId', {initialValue:'设备名称/ID'})
                                (
                                <Select
                                    showSearch
                                    // style={{ width: 200 }}
                                    // placeholder=""
                                    optionFilterProp="children"
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value="1">1</Option>
                                    <Option value="2">2</Option>
                                    <Option value="3">3</Option>
                                </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item className={styles.search}>
                        {getFieldDecorator('switch', {initialValue:'open'})
                                (<Select>
                                    <Option value="open">开阀</Option>
                                    <Option value="close">关阀</Option>
                                </Select>)
                            }
                        </Form.Item>
                        <Icon 
                            type="minus-circle" 
                            theme="filled" 
                            onClick={() => this.removes(v)}
                        />
                    </div>
                );
              });
            const formItems = keys.map((v,i) => {
                return (
                    <div className={styles.line} key={v}>
                        <Form.Item className={styles.search}>
                            {getFieldDecorator(`deviceId${v}`, {initialValue:'设备名称/ID'})
                                (
                                <Select
                                    showSearch
                                    // style={{ width: 200 }}
                                    // placeholder=""
                                    optionFilterProp="children"
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Option value="1">1</Option>
                                    <Option value="2">2</Option>
                                    <Option value="3">3</Option>
                                </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item className={styles.search}>
                            {getFieldDecorator(`variate${v}`, {initialValue:'power'})
                                (<Select>
                                    <Option value="power">电量</Option>
                                    <Option value="water">水量</Option>
                                    <Option value="state">状态</Option>
                                </Select>)
                            }
                        </Form.Item>
                        <Form.Item className={styles.end}>
                            {getFieldDecorator(`condition${v}`, {initialValue:'judge'})
                                (<Select>
                                    <Option value="judge">判断</Option>
                                    <Option value="high">&gt;</Option>
                                    <Option value="low">&lt;</Option>
                                    <Option value="equal">=</Option>
                                    <Option value="heq">&gt;=</Option>
                                    <Option value="leq">&lt;=</Option>
                                    <Option value="neq">≠</Option>
                                </Select>)
                            }
                        </Form.Item>
                        <Form.Item className={styles.end}>
                            {getFieldDecorator(`value${v}`, {initialValue:''})
                                (<Input placeholder="值" type='number'/>)
                            }
                        </Form.Item>
                        <Icon 
                            type="minus-circle" 
                            theme="filled" 
                            onClick={() => this.remove(v)}
                        />
                    </div>
                );
              });
            return (
                <Form className={styles.form}>
                    <div className={styles.Rules}>
                        <input type='text' className={styles.rulesName} placeholder='蓄水池自动化蓄水规则'/>
                        <div className={styles.border}></div>
                    </div>
                    <div className={styles.inner}>
                        <div className={styles.if}>条件</div>
                        <Form.Item className={styles.all}>
                            {getFieldDecorator('condition', {initialValue:'all'})
                                (
                                <Select>
                                    <Option value="all">所有条件</Option>
                                </Select>
                                )
                            }
                        </Form.Item>
                        {formItems}
                        <div className={styles.line}>
                            <Form.Item className={styles.search}>
                                {getFieldDecorator('deviceId', {initialValue:'设备名称/ID'})
                                    (
                                    <Select
                                        showSearch
                                        // style={{ width: 200 }}
                                        // placeholder=""
                                        optionFilterProp="children"
                                        onChange={handleChange}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        <Option value="1">1</Option>
                                        <Option value="2">2</Option>
                                        <Option value="3">3</Option>
                                    </Select>
                                    )
                                }
                            </Form.Item>
                            <Form.Item className={styles.search}>
                                {getFieldDecorator('variate', {initialValue:'参数'})
                                    (
                                    <Select>
                                        <Option value="param1">参数1</Option>
                                        <Option value="param2">参数2</Option>
                                    </Select>
                                    )
                                }
                            </Form.Item>
                            <Form.Item className={styles.end}>
                                {getFieldDecorator('judge', {initialValue:'judge'})
                                    (
                                    <Select>
                                        <Option value="judge">判断</Option>
                                        <Option value="high">&gt;</Option>
                                        <Option value="low">&lt;</Option>
                                        <Option value="equal">=</Option>
                                        <Option value="heq">&gt;=</Option>
                                        <Option value="leq">&lt;=</Option>
                                        <Option value="neq">≠</Option>
                                    </Select>
                                    )
                                }
                            </Form.Item>
                            <Form.Item className={styles.end}>
                                {getFieldDecorator('value', {initialValue:''})
                                    (
                                    <Input placeholder="值" type="number"/>
                                    )
                                }
                            </Form.Item>
                            <Icon 
                                type="plus-circle" 
                                theme="filled" 
                                onClick={this.add}/>
                        </div>
                        <div className={styles.do}>执行</div>
                        {formItem}
                        <div className={styles.line}>
                            <Form.Item className={styles.search}>
                                {getFieldDecorator('deviceId', {initialValue:'设备名称/ID'})
                                    (
                                    <Select
                                        showSearch
                                        // style={{ width: 200 }}
                                        // placeholder=""
                                        optionFilterProp="children"
                                        onChange={handleChange}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        <Option value="1">1</Option>
                                        <Option value="2">2</Option>
                                        <Option value="3">3</Option>
                                    </Select>
                                    )
                                }
                            </Form.Item>
                            <Form.Item className={styles.search}>
                                {getFieldDecorator('switch', {initialValue:'open'})
                                    (<Select>
                                        <Option value="open">开阀</Option>
                                        <Option value="close">关阀</Option>
                                    </Select>)
                                }
                            </Form.Item>
                            <Icon 
                                type="plus-circle" 
                                theme="filled" 
                                onClick={this.adds}
                            />
                        </div>
                    </div>
                </Form>
            )
        }
    }
)
