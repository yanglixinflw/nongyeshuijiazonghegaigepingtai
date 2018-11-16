import React, { Component } from 'react';
import styles from './warningDetail.less';
import { Select, Button, Form, Modal, Input, message } from 'antd';
import { timeOut } from '../../utils/timeOut';
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
            selectVisible:false,
            //删除弹窗可见性
            deleteVisible: false,
            //模板表单可见性
            templateVisible:false,
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
            addSearchValue:'',
            //模板预警表单数据
            templateData:''
        }
        console.log(this.state.data)
    }
    //选择预警模板
    _SelectTemplate(){
        this.setState({
            selectVisible:true
        })
    }
    //取消选择
    _selectCancelHandler(){
        this.setState({
            selectVisible:false
        })
    }
    //选择预警规则模板1
    _SelectTem1(){
        this.setState({
            selectVisible:false,
            templateVisible:true
        })
    }
    //选择预警规则模板2
    _SelectTem2(){
        this.setState({
            selectVisible:false,
            templateVisible:true
        })
    }
    //选择预警规则模板3
    _SelectTem3(){
        this.setState({
            selectVisible:false,
            templateVisible:true
        })
    }
    //选择预警规则模板4
    _SelectTem4(){
        this.setState({
            selectVisible:false,
            templateVisible:true
        })
    }
    //取消预警模板
    _temCancelHandler(){
        this.setState({
            templateVisible:false
        })
    }
    //添加自定义规则
    _addRules() {
        this.setState({
            addVisible: true
        })
    }
    //关联设备搜索
    _addSearchHandler(value){
        console.log(value)
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
            if (err) {
                return;
            }
            let smsNotify = {};
            let phoneNotify = {};
            smsNotify.frequency=values.smsFrequency;
            smsNotify.receiverIds=values.smsReceiverIds;
            smsNotify.othersMobile=values.smsOthersMobile;
            phoneNotify.frequency=values.phoneFrequency;
            phoneNotify.receiverIds=values.phoneReceiverIds;
            phoneNotify.othersMobile=values.phoneOthersMobile;
            values.smsNotify=smsNotify
            values.phoneNotify=phoneNotify
            console.log(values)
            // return fetch(addUrl,{
            //     ...postOption,
            //     body:JSON.stringify({
            //         ...values
            //     })
            // }).then((res)=>{
            //     Promise.resolve(res.json())
            //     .then((v)=>{
            //         // 判断是否超时
            //         timeOut(v.ret)
            //         if(v.ret==1){
            //             let data = v.data;
            //             //添加key
            //             data.map((v,i)=>{
            //                 v.key = i
            //             })
            //             this.setState({
            //                 data
            //             })
            //         }
            //     })
            // }).catch((err)=>{
            //     console.log(err)
            // })
        })
        // // 重置表单
        // form.resetFields();
        // this.setState({
        //     addVisible: false
        // })
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
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log(values)
        })
        // 重置表单
        form.resetFields();
        this.setState({
            addVisible: false
        })
    }
    //已有预警规则点击修改
    _modifyHandler(ruleId) {
        return fetch(detailUrl,{
            ...postOption,
            body:JSON.stringify({
                ruleId
            })
        }).then((res)=>{
            Promise.resolve(res.json())
            .then((v)=>{
                // 判断是否超时
                timeOut(v.ret)
                if(v.ret==1){
                    let modifyData = v.data;
                    this.setState({
                        modifyData,
                        modifyVisible: true
                    })
                }
            })
        }).catch((err)=>{
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
        let userIds = [];
        userIds.push(userId);
        return fetch(deleteUrl,{
            ...postOption,
            body:JSON.stringify({
                userIds
            })
        }).then((res)=>{
            Promise.resolve(res.json())
            .then((v)=>{
                // 判断是否超时
                timeOut(v.ret)
                if(v.ret==1){

                }
            })
        })
        message.success('删除成功', 2);
        this.setState({
            deleteVisible: false
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
            addSearchValue,
            templateData, 
        } = this.state;
        const Option = Select.Option;
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
                    title='选择自定义规则'
                    cancelText='取消'
                    okText='确定'
                >
                    <Button
                        onClick={()=>this._SelectTem1()}
                    >预警规则1</Button>
                    <Button
                        onClick={()=>this._SelectTem2()}
                    >预警规则2</Button>
                    <Button
                        onClick={()=>this._SelectTem3()}
                    >预警规则3</Button>
                    <Button
                        onClick={()=>this._SelectTem4()}
                    >预警规则4</Button>
                </Modal>
                <div className={styles.title}>
                    <span className={styles.rulesName}>预警机制</span>
                </div>
                <div className={styles.content}>
                    <Button
                        onClick={()=>this._SelectTemplate()}
                    >选择预警规则</Button>
                    <Button
                        onClick={() => this._addRules()}
                    >添加自定义规则</Button>
                    {/* 预警模板表单 */}
                    {templateVisible?
                           <TemRulesForm 
                                wrappedComponentRef={(temRulesForm) => this.temRulesForm = temRulesForm}
                                onCancel={() => this._temCancelHandler()}
                                onSave={() => this._temSaveHandler()}
                                onSearch={(value)=>this._temSearchHandler(value)}
                                onChange={(value)=>this._temSearchHandler(value)}
                                {...{templateData}}
                           /> 
                        :null
                    }
                    {/* 添加表单 */}
                    {addVisible ?
                        <AddRulesForm
                            wrappedComponentRef={(addRulesForm) => this.addRulesForm = addRulesForm}
                            onCancel={() => this._addCancelHandler()}
                            onSave={() => this._addSaveHandler()}
                            onSearch={(value)=>this._addSearchHandler(value)}
                            onChange={(value)=>this._addSearchHandler(value)}
                        />
                        : null
                    }
                    {/* 修改表单 */}
                    {modifyVisible ?
                        <ModifyRulesForm
                            wrappedComponentRef={(modifyRulesForm) => this.modifyRulesForm = modifyRulesForm}
                            onCancel={() => this._modifyCancelHandler()}
                            onSave={() => this._modifySaveHandler()}
                            {...{ modifyData }}
                        />
                        : null
                    }
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
        render() {
            const { form, onSave, onCancel,onSearch,onChange} = this.props;
            const { getFieldDecorator } = form;
            const Option = Select.Option;
            return (
                <Form layout='inline' className={styles.addForm}>
                    <div className={styles.formTitle}>
                        <div className={styles.formName}>
                            <Form.Item>
                                {getFieldDecorator('name', {
                                    initialValue: '',
                                    rules: [
                                        { required: true,message: '请输入预警规则名称' },
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
                                    initialValue: '0',
                                    rules: [{ required: true, message: '请选择预警类型' },],
                                })(
                                    <Select>
                                        <Option key='0'>功能预警</Option>
                                        <Option key='1'>运营预警</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label='判断规则' className={styles.judgmentRule}>
                                <Form.Item>
                                    {getFieldDecorator('parameterName', {
                                        initialValue: '',
                                        rules: [{ required: true, message: '请选择判断参数名' },],
                                    })(
                                        <Select
                                            className={styles.params}
                                        >
                                            <Option value=''>参数1</Option>
                                        </Select>
                                    )}

                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('operator', {
                                        initialValue: '',
                                        rules: [{ required: true, message: '请选择判断符号' },],
                                    })(
                                        <Select
                                            className={styles.judge}
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
                                        initialValue: '',
                                        rules: [{ required: true, message: '请选择判断值' },],
                                    })(
                                        <Input
                                            placeholder='值'
                                        />
                                    )}
                                </Form.Item>
                            </Form.Item>
                        </div>
                        <div className={styles.items}>
                            <div className={styles.itemName1}>短信</div>
                            <Form.Item label='频率'>
                                {getFieldDecorator('smsFrequency', {
                                    initialValue: '0',
                                    rules: [{ required: true, message: '请选择短信通知频率' },],
                                })(
                                    <Select>
                                        <Option key='0'>不通知</Option>
                                        <Option key='1'>仅通知一次</Option>
                                        <Option key='2'>1小时通知一次</Option>
                                        <Option key='3'>12小时通知一次</Option>
                                        <Option key='4'>一天通知一次</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label='通知人' className={styles.informer}>
                                <Form.Item>
                                    {getFieldDecorator('smsReceiverIds', {
                                        initialValue: '',
                                        rules: [{ required: true, message: '请选择短信通知人' },],
                                    })(
                                        <Select>

                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('smsOthersMobile', {
                                        initialValue: '',
                                        rules: [{ pattern: '^1[3578][0-9]{9}(,1[3578][0-9]{9})*$', message: '请输入正确的手机号码,多个手机号用英文逗号隔开' }],
                                        
                                    })(
                                        <Input
                                            placeholder='需通知的其他联系人'
                                        />
                                    )}
                                </Form.Item>
                            </Form.Item>
                        </div>
                        <div className={styles.items}>
                            <div className={styles.itemName1}>电话</div>
                                <Form.Item label='频率'>
                                    {getFieldDecorator('phoneFrequency', {
                                        initialValue: '0',
                                        rules: [{ required: true, message: '请选择电话通知频率' },],
                                    })(
                                        <Select>
                                            <Option key='0'>不通知</Option>
                                            <Option key='1'>仅通知一次</Option>
                                            <Option key='2'>1小时通知一次</Option>
                                            <Option key='3'>12小时通知一次</Option>
                                            <Option key='4'>一天通知一次</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item label='通知人' className={styles.informer}>
                                    <Form.Item>
                                        {getFieldDecorator('phoneReceiverIds', {
                                            initialValue: '',
                                            rules: [{ required: true, message: '请选择电话通知人' },],
                                        })(
                                            <Select>

                                            </Select>
                                        )}

                                    </Form.Item>
                                    <Form.Item>
                                        {getFieldDecorator('phoneOthersMobile', {
                                            initialValue: '',
                                            rules: [{ pattern: '^1[3578][0-9]{9}(,1[3578][0-9]{9})*$', message: '请输入正确的手机号码,多个手机号用英文逗号隔开' }],
                                        })(
                                            <Input
                                                placeholder='需通知的其他联系人'
                                            />
                                        )}
                                    </Form.Item>
                                </Form.Item>
                        </div>
                        <div className={styles.items}>
                            <div className={styles.itemName2}>通知</div>
                            <Form.Item label='通知范围' >
                                {getFieldDecorator('sysMsgNotify', {
                                    initialValue: [],
                                    rules: [{ required: true, message: '请选择通知范围' },],
                                })(
                                    <Select
                                        mode="multiple"
                                        placeholder='全部'
                                    >
                                        <Option key='0'>超级管理员</Option>
                                        <Option key='1'>一般管理员</Option>

                                    </Select>
                                )}
                            </Form.Item>
                        </div>
                        <div className={styles.items}>
                            <div className={styles.itemName2}>通知内容</div>
                            <Form.Item label='通知内容' >
                                {getFieldDecorator('notifyMsgContent', {
                                    initialValue: '',
                                    rules: [{ required: true, message: '请输入通知内容' },],
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
                                    {getFieldDecorator('deviceId', {
                                        initialValue: [],
                                        rules: [{ required: true, message: '请选择关联设备' },],
                                    })(
                                        <Select
                                            //可搜索
                                            showSearch={true}
                                            placeholder='设备名称/ID'
                                            onSearch={(e)=>onSearch(e)}
                                            onChange={(e)=>onChange(e)}
                                        >

                                        </Select>

                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('fireControlCmd', {
                                        initialValue: '',
                                        rules: [{ required: true, message: '请选择指令' },],
                                    })(
                                        <Select
                                            placeholder='选择指令'
                                        >

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
        render() {
            const { form, onSave, onCancel, modifyData } = this.props;
            const { getFieldDecorator } = form;
            const Option = Select.Option;
            console.log(modifyData)
            return (
                <Form layout='inline' className={styles.addForm}>
                    <div className={styles.formTitle}>
                        <div className={styles.formName}>
                            <Form.Item>
                                {getFieldDecorator('name', {
                                    initialValue: '',
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
                                    initialValue: '0',
                                })(
                                    <Select>
                                        <Option key='0'>功能预警</Option>
                                        <Option key='1'>运营预警</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label='判断规则' className={styles.judgmentRule}>
                                <Form.Item>
                                    {getFieldDecorator('parameterName', {
                                        initialValue: '',
                                    })(
                                        <Select
                                            className={styles.params}
                                        >
                                            <Option value=''>参数1</Option>
                                        </Select>
                                    )}

                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('operator', {
                                        initialValue: ''
                                    })(
                                        <Select
                                            className={styles.judge}
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
                                        initialValue: ''
                                    })(
                                        <Input
                                            placeholder='值'
                                        />
                                    )}
                                </Form.Item>
                            </Form.Item>
                        </div>
                        <div className={styles.items}>
                            <div className={styles.itemName1}>短信</div>
                            <Form.Item label='频率'>
                                {getFieldDecorator('smsFrequency', {
                                    initialValue: '0',
                                })(
                                    <Select>
                                        <Option key='0'>不通知</Option>
                                        <Option key='1'>仅通知一次</Option>
                                        <Option key='2'>1小时通知一次</Option>
                                        <Option key='3'>12小时通知一次</Option>
                                        <Option key='4'>一天通知一次</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label='通知人' className={styles.informer}>
                                <Form.Item>
                                    {getFieldDecorator('smsReceiverIds', {
                                        initialValue: ''
                                    })(
                                        <Select>

                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('smsOthersMobile', {
                                        initialValue: ''
                                    })(
                                        <Input
                                            placeholder='需通知的其他联系人'
                                        />
                                    )}
                                </Form.Item>
                            </Form.Item>
                        </div>
                        <div className={styles.items}>
                            <div className={styles.itemName1}>电话</div>
                            <Form.Item label='频率'>
                                {getFieldDecorator('phoneFrequency', {
                                    initialValue: '0',
                                })(
                                    <Select>
                                        <Option key='0'>不通知</Option>
                                        <Option key='1'>仅通知一次</Option>
                                        <Option key='2'>1小时通知一次</Option>
                                        <Option key='3'>12小时通知一次</Option>
                                        <Option key='4'>一天通知一次</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label='通知人' className={styles.informer}>
                                <Form.Item>
                                    {getFieldDecorator('phoneReceiverIds', {
                                        initialValue: ''
                                    })(
                                        <Select>

                                        </Select>
                                    )}

                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('phoneOthersMobile', {
                                        initialValue: ''
                                    })(
                                        <Input
                                            placeholder='需通知的其他联系人'
                                        />
                                    )}
                                </Form.Item>

                            </Form.Item>
                        </div>
                        <div className={styles.items}>
                            <div className={styles.itemName2}>通知</div>
                            <Form.Item label='通知范围' >
                                {getFieldDecorator('sysMsgNotify', {
                                    initialValue: '',
                                })(
                                    <Select
                                        mode="multiple"
                                        placeholder='全部'
                                    >
                                        <Option key='0'>超级管理员</Option>
                                        <Option key='1'>一般管理员</Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </div>
                        <div className={styles.items}>
                            <div className={styles.itemName2}>通知内容</div>
                            <Form.Item label='通知内容' >
                                {getFieldDecorator('notifyMsgContent', {
                                    initialValue: '',
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
                                    {getFieldDecorator('deviceId', {
                                        initialValue: '',
                                    })(
                                        <Select
                                            showSearch={true}
                                            placeholder='设备名称/ID'
                                        >

                                        </Select>

                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('fireControlCmd', {
                                        //initialValue: '',
                                    })(
                                        <Select
                                            placeholder='选择指令'
                                        >

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
        render() {
            const { form, onSave, onCancel,onSearch,onChange,addSearchValue } = this.props;
            const { getFieldDecorator } = form;
            const Option = Select.Option;
            return (
                <Form layout='inline' className={styles.addForm}>
                    <div className={styles.formTitle}>
                        <div className={styles.formName}>
                            <Form.Item>
                                {getFieldDecorator('name', {
                                    initialValue: '',
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
                                    initialValue: '0',
                                })(
                                    <Select>
                                        <Option key='0'>功能预警</Option>
                                        <Option key='1'>运营预警</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label='判断规则' className={styles.judgmentRule}>
                                <Form.Item>
                                    {getFieldDecorator('parameterName', {
                                        initialValue: '',
                                    })(
                                        <Select
                                            className={styles.params}
                                        >
                                            <Option value=''>参数1</Option>
                                        </Select>
                                    )}

                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('operator', {
                                        initialValue: ''
                                    })(
                                        <Select
                                            className={styles.judge}
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
                                        initialValue: ''
                                    })(
                                        <Input
                                            placeholder='值'
                                        />
                                    )}
                                </Form.Item>
                            </Form.Item>
                        </div>
                        <div className={styles.items}>
                            <div className={styles.itemName1}>短信</div>
                            <Form.Item label='频率'>
                                {getFieldDecorator('smsFrequency', {
                                    initialValue: '0',
                                })(
                                    <Select>
                                        <Option key='0'>不通知</Option>
                                        <Option key='1'>仅通知一次</Option>
                                        <Option key='2'>1小时通知一次</Option>
                                        <Option key='3'>12小时通知一次</Option>
                                        <Option key='4'>一天通知一次</Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label='通知人' className={styles.informer}>
                                <Form.Item>
                                    {getFieldDecorator('smsReceiverIds', {
                                        initialValue: ''
                                    })(
                                        <Select>

                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('smsOthersMobile', {
                                        initialValue: ''
                                    })(
                                        <Input
                                            placeholder='需通知的其他联系人'
                                        />
                                    )}
                                </Form.Item>
                            </Form.Item>
                        </div>
                        <div className={styles.items}>
                            <div className={styles.itemName1}>电话</div>
                                <Form.Item label='频率'>
                                    {getFieldDecorator('phoneFrequency', {
                                        initialValue: '0',
                                    })(
                                        <Select>
                                            <Option key='0'>不通知</Option>
                                            <Option key='1'>仅通知一次</Option>
                                            <Option key='2'>1小时通知一次</Option>
                                            <Option key='3'>12小时通知一次</Option>
                                            <Option key='4'>一天通知一次</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item label='通知人' className={styles.informer}>
                                    <Form.Item>
                                        {getFieldDecorator('phoneReceiverIds', {
                                            initialValue: ''
                                        })(
                                            <Select>

                                            </Select>
                                        )}

                                    </Form.Item>
                                    <Form.Item>
                                        {getFieldDecorator('phoneOthersMobile', {
                                            initialValue: ''
                                        })(
                                            <Input
                                                placeholder='需通知的其他联系人'
                                            />
                                        )}
                                    </Form.Item>
                                </Form.Item>
                        </div>
                        <div className={styles.items}>
                            <div className={styles.itemName2}>通知</div>
                            <Form.Item label='通知范围' >
                                {getFieldDecorator('sysMsgNotify', {
                                    //initialValue: '',
                                })(
                                    <Select
                                        mode="multiple"
                                        placeholder='全部'
                                    >
                                        <Option key='0'>超级管理员</Option>
                                        <Option key='1'>一般管理员</Option>

                                    </Select>
                                )}
                            </Form.Item>
                        </div>
                        <div className={styles.items}>
                            <div className={styles.itemName2}>通知内容</div>
                            <Form.Item label='通知内容' >
                                {getFieldDecorator('notifyMsgContent', {
                                    initialValue: '',
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
                                    {getFieldDecorator('deviceId', {
                                        initialValue: '',
                                    })(
                                        <Select
                                            showSearch={true}
                                            placeholder='设备名称/ID'
                                            onSearch={(e)=>onSearch(e)}
                                            onChange={(e)=>onChange(e)}
                                        >

                                        </Select>

                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('fireControlCmd', {
                                        //initialValue: '',
                                    })(
                                        <Select
                                            placeholder='选择指令'
                                        >

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