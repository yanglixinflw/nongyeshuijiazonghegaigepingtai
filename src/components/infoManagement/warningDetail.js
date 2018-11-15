import React, { Component } from 'react';
import styles from './warningDetail.less';
import { Select, Button, Form, Modal,Input } from 'antd';
export default class extends Component {
    constructor(props) {
        super(props)
        const { warningDetail } = props

        this.state = {
            //数据源
            data: warningDetail.data.data,
            //添加自定义规则弹窗可见性
            addVisible:false,
            // 修改对应ruleId的预警规则
            modifyData: [],
        }
        console.log(this.state.data)
    }
    //添加自定义规则
    _addRules() {
        this.setState({
            addVisible:true
        })
    }
    // 添加取消
    _addCancelHandler() {
        // console.log('点击取消按钮');
        const form = this.addForm.props.form;
        // 重置表单
        form.resetFields();
        this.setState({
            addVisible: false
        })
    }
    //修改
    _modifyHandler(ruleId){
        const { data } = this.state;
        let modifyData= [];
        modifyData = data.filter(item => item.ruleId === ruleId);
        // console.log(modifyData)
        this.setState({
            modifyData,
        })
       
    }
    //删除
    _deleteHandler(ruleId){
        console.log(ruleId)
    }
    render() {
        const { data,addVisible } = this.state;
        const Option = Select.Option;
        return (
            <div className={styles.warningDetail}>
                <div className={styles.title}>
                    <div className={styles.rulesName}>预警机制</div>
                    <div className={styles.border}></div>
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
                    {/* 添加弹窗 */}
                    <AddRulesForm
                        wrappedComponentRef={(addRulesForm) => this.addRulesForm = addRulesForm}
                        visible={addVisible}
                        onCancel={() => this._addCancelHandler()}
                        onSave = {()=>this._addSaveHandler()}
                    />
                    {data.map((v, i) => {
                        return (
                            <RulesForm
                                key={i}
                                wrappedComponentRef={(rulesForm) => this.rulesForm = rulesForm}
                                onModify={(ruleId)=>this._modifyHandler(ruleId)}
                                onDelete={(ruleId)=>this._deleteHandler(ruleId)}
                                {...{ v, i }}
                            />
                        )
                    })}

                </div>
            </div>
        )
    }
}
//自定义预警规则表单
const RulesForm = Form.create()(
    class extends React.Component {
        render() {
            const { form, v, i,onDelete, onModify } = this.props;
            
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
                            onClick={() =>onModify(v.ruleId)}
                        >修改</Button>
                        <Button
                            icon='delete'
                            className={styles.btndelete}
                            onClick={() =>onDelete(v.ruleId) }
                        >删除</Button>
                    </div>

                </Form>
            )
        }
    }
)
//添加自定义规则表单
const AddRulesForm = Form.create()(
    class extends React.Component{
        render(){
            const { visible, form, onSave, onCancel } = this.props;
            const { getFieldDecorator } = form;
            return(
                <Form className={styles.form}>
                    <div className={styles.head}>
                        <div className={styles.flag}></div>
                        <input className={styles.formRule} placeholder='预警规则'/>
                    </div>
                    <div className={styles.type1}>
                        <div className={styles.based}>条件</div>
                        <div className={styles.type}>
                            <div className={styles.typeName}>类型</div>
                            <Form.Item className={styles.standard1}>
                                {getFieldDecorator('type', {initialValue:'fn'})
                                    (<Select>
                                        <Option value="fn">功能预警</Option>
                                        <Option value="run">运营预警</Option>
                                    </Select>)
                                }
                            </Form.Item>
                        </div>
                        <div className={styles.limited}>
                            <div className={styles.limitedName}>判断规则</div>
                            <Form.Item className={styles.standard1}>
                                {getFieldDecorator('param', {initialValue:'param1'})
                                    (<Select>
                                        <Option value="param1">参数1</Option>
                                        <Option value="param2">参数2</Option>
                                    </Select>)
                                }
                            </Form.Item>
                            <Form.Item className={styles.standard2}>
                                {getFieldDecorator('condition', {initialValue:'judge'})
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
                            <Form.Item className={styles.standard2}>
                                {getFieldDecorator('value', {initialValue:''})
                                    (<Input placeholder="值" type='number'/>)
                                }
                            </Form.Item>
                        </div>
                    </div>
                    <div className={styles.type1}>
                        <div className={styles.based}>短信</div>
                        <div className={styles.type}>
                            <div className={styles.typeName}>频率</div>
                            <Form.Item className={styles.standard1}>
                                {getFieldDecorator('frequency', {initialValue:'no'})
                                    (<Select>
                                        <Option value="no">不通知</Option>
                                        <Option value="one">仅通知一次</Option>
                                        <Option value="five">五分钟通知一次</Option>
                                    </Select>)
                                }
                            </Form.Item>
                        </div>
                        <div className={styles.limited}>
                            <div className={styles.limitedName}>通知人</div>
                            <Form.Item className={styles.standard1}>
                                {getFieldDecorator('people', {initialValue:'people1'})
                                    (<Select>
                                        <Option value="people1">慧水老李</Option>
                                        <Option value="people2">慧水老王</Option>
                                    </Select>)
                                }
                            </Form.Item>
                            <Form.Item className={styles.standard3}>
                                {getFieldDecorator('other', {initialValue:''})
                                    (<Input placeholder="需通知的其他人" type='text'/>)
                                }
                            </Form.Item>
                        </div>
                    </div>
                    <div className={styles.type1}>
                        <div className={styles.based}>电话</div>
                        <div className={styles.type}>
                            <div className={styles.typeName}>频率</div>
                            <Form.Item className={styles.standard1}>
                                {getFieldDecorator('frequency', {initialValue:'no'})
                                    (<Select>
                                        <Option value="no">不通知</Option>
                                        <Option value="one">仅通知一次</Option>
                                        <Option value="five">五分钟通知一次</Option>
                                    </Select>)
                                }
                            </Form.Item>
                        </div>
                        <div className={styles.limited}>
                            <div className={styles.limitedName}>通知人</div>
                            <Form.Item className={styles.standard1}>
                                {getFieldDecorator('people', {initialValue:'people1'})
                                    (<Select>
                                        <Option value="people1">慧水老李</Option>
                                        <Option value="people2">慧水老王</Option>
                                    </Select>)
                                }
                            </Form.Item>
                            <Form.Item className={styles.standard3}>
                                {getFieldDecorator('other', {initialValue:''})
                                    (<Input placeholder="需通知的其他人" type='text'/>)
                                }
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            )
        }
    }
)