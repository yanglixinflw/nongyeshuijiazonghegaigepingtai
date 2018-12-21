import React,{Component} from 'react';
import styles from './farmersInfo.less';
import { Input,Button,Form,Select,Table,Modal,message} from 'antd';
import classnames from 'classnames';
import { timeOut } from '../../utils/timeOut';
import {ENVNet,postOption} from '../../services/netCofig'
//翻页调用
const dataUrl=`${ENVNet}/api/PeasantMgr/list`;
//删除调用
const delUrl=`${ENVNet}/api/PeasantMgr/delete`;
//添加调用
const addUrl=`${ENVNet}/api/PeasantMgr/add`;
//修改农户信息调用
const updateUrl=`${ENVNet}/api/PeasantMgr/update`;
//修改密码调用
const changePwdUrl=`${ENVNet}/api/PeasantMgr/changePwd`;
//获取归属地地址
const areaUrl=`${ENVNet}/api/Area/list`;
//头信息
const tableTitle=[
    {index:"realName",item:"姓名"},
    {index:"mobilePhone",item:"电话"},
    {index:"idCard",item:"身份证"},
    {index:"areaName",item:"归属地区"},
    {index:"isActivated",item:"是否激活"},
]
const { Option } = Select;
export default class extends Component{
    constructor(props) {
        super(props)
        const { farmersInfo } = props;
        this.state = {
            title:tableTitle,
            itemCount:farmersInfo.data.data.itemCount,//总数据数
            data:farmersInfo.data.data.items,//表格数据源
            //表的每一列
            columns: [],
            //用于增删改查标识字段
            userId:"",
            //删除的弹出框显示
            delVisible: false,
            //修改用户信息的弹出框显示
            editvisible: false,
            //修改所对应的信息
            editData:[],
            //修改用户密码弹出框提示
            editPwdvisible: false,
            //密码是否一致
            confirmDirty:false,
            //添加用户信息的弹出框显示
            addvisible:false,
            //归属片区列表
            areaList:[],
            //是否激活
            isActivated:'',
            //搜索框默认值、
            searchValue:{},
            //初始页数
            current:1
          };
    }
    componentDidMount() {
        this._getTableDatas(this.state.title, this.state.data);
        return (
            fetch(areaUrl, {
                ...postOption,
            }).then((res) => {
                Promise.resolve(res.json())
                    .then((v) => {
                        //超时判断
                        timeOut(v.ret)
                        if (v.ret == 1) {
                            let areaList = v.data
                            this.setState({
                                areaList
                            })
                        }
                    })
            }).catch((err) => {
                console.log(err)
            })
        )
    }
    _getTableDatas(title, data) {
        let columns = [];
        title.map(v => {
            columns.push({
                title: v.item,
                // 给表头添加字段名 必须一一对应
                dataIndex: v.index,
                align: 'center',
                className: `${styles.tbw}`
            })
        })
        //操作列
        columns.push({
            title: '操作',
            key: 'action',
            align: 'center',
            // fixed:"right",
            className: `${styles.action}`,
            width: 200,
            render: (record) => {
                return (
                    <span className={styles.option}>
                        <Button
                            className={styles.edit}
                            onClick={() => this.editInfo(record.userId)}
                            icon='edit'
                        >
                            修改
                        </Button>
                        <Button
                            className={styles.delete}
                            onClick={()=>this._deleteInfo(record.userId)}
                            icon='delete'
                        >
                            删除
                        </Button>
                        <Button
                            className={styles.editPsw}
                            onClick={() => this.editPwdInfo(record.userId)}
                            icon='form'
                        >
                            修改密码
                        </Button>
                    </span>
                )
            }
        })
        let tableDatas = [];
        //表单数据
        data.map((v, i) => {
            if(v.isActivated==false){
                tableDatas.push({
                    realName:v.realName,
                    mobilePhone:v.mobilePhone,
                    idCard:v.idCard,
                    areaName:v.areaName,
                    isActivated:"未激活",
                    userId:v.userId,
                    key: i,
                });
            }else{
                tableDatas.push({
                    realName:v.realName,
                    mobilePhone:v.mobilePhone,
                    idCard:v.idCard,
                    areaName:v.areaName,
                    isActivated:"已激活",
                    userId:v.userId,
                    key: i,
                });
            }
        })
        this.setState({
            columns,
            tableDatas,
        });
    }
    //删除按钮点击
    _deleteInfo(userId){ 
      this.setState({
        delVisible: true,
        userId
      });
    }
    //删除的弹框点击确定
    delHandleOk(){
        let {userId,title}=this.state;
        let userIds = [];
        userIds.push(userId);
        return fetch(delUrl,{
            ...postOption,
            body: JSON.stringify({
                userIds
            })
        }).then(res=>{
            Promise.resolve(res.json())
            .then(v => {
                  //超时判断
                timeOut(v.ret)
                if (v.ret == 1) {
                    this._resetForm();
                    this.setState({
                        delVisible: false
                    });
                    form.resetFields();
                    message.success('删除成功', 2);
                } else {
                    message.error(v.msg, 2);
                }
            })
        }).catch(err => {
            console.log(err)
        })
    }
    //删除的弹框点击取消
    delHandleCancel(){
      this.setState({
        delVisible: false,
      });
    }
    //修改用户信息的弹出框
    editInfo(index){
        // console.log(userId)
        return fetch(dataUrl, {
            ...postOption,
            body: JSON.stringify({
                "userId":index
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                      //超时判断
                    timeOut(v.ret)
                    if (v.ret == 1) {
                        // console.log(v)
                        let data = v.data.items;
                        let editdata=[];
                        data.map(val=>{
                            if(val.userId==index){
                                editdata.push(val)
                            }
                        })
                        this.setState({
                            userId:index,
                            editData: editdata,
                            editvisible: true,
                        })
                    } else {
                        this.setState({
                            editData: []
                        })
                    }
                })
        }).catch((err) => {
            console.log(err)
        })
    }
    //修改用户信息的弹出框点击确定
    editOkHandler (){
        const form = this.editForm.props.form;
        let {userId,title}=this.state;
        form.validateFields((err,values) => {
            // values即为表单数据
            if (err) {
                return;
            }
            // console.log(values);
            return fetch(updateUrl, {
                ...postOption,
                body: JSON.stringify({
                    "userId":userId,
                    "realName": values.realName,
                    "mobilePhone": values.mobilePhone,
                    "idCard": values.idCard,
                    // "password":values.password,
                    "areaId": values.areaId
                })
            }).then((res) => {
                Promise.resolve(res.json())
                    .then((v) => {
                          //超时判断
                        timeOut(v.ret)
                        if (v.ret == 1) {
                            this._resetForm();
                            this.setState({
                                editvisible: false
                            });
                            form.resetFields();
                            message.success('修改成功', 2);
                        } else {
                            message.error(v.msg, 2);
                        }
                    })
            }).catch((err) => {
                console.log(err)
            })
        })
    }
    //修改用户信息的弹出框点击取消
    editCancelHandler(){
        const form = this.editForm.props.form;
        // 重置表单
        form.resetFields();
        this.setState({
            editvisible: false,
        });
    }
    //修改密码点击
    editPwdInfo(userId){
        this.setState({
            userId:userId,
            editPwdvisible: true,
        })
    }
    //修改密码点击确定
    editPwdOkHandler(){
        const form = this.editPwdForm.props.form;
        let {userId,title}=this.state;
        form.validateFields((err,values) => {
            // values即为表单数据
            if (err) {
                return;
            }
            return fetch(changePwdUrl, {
                ...postOption,
                body: JSON.stringify({
                    "userId":userId,
                    "newPwd":values.password
                })
            }).then((res) => {
                Promise.resolve(res.json())
                    .then((v) => {
                          //超时判断
                        timeOut(v.ret)
                        if (v.ret == 1) {
                            this._resetForm();
                            this.setState({
                                editPwdvisible: false
                            });
                            form.resetFields();
                            message.success('密码修改成功', 2);
                        } else {
                            message.error(v.msg, 2);
                        } 
                    })
            }).catch((err) => {
                console.log(err)
            })
        })
    }
    //修改密码点击取消
    editPwdCancelHandler(){
        const form = this.editPwdForm.props.form;
        // 重置表单
        form.resetFields();
        this.setState({
            editPwdvisible: false,
        });
    }
    //添加用户信息的弹出框
    add(){
        this.setState({
          addvisible: true,
        });
    }
    //添加用户信息确认
    addhandleOk(){
        const form = this.addForm.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            return fetch(addUrl, {
                ...postOption,
                body: JSON.stringify({
                    "realName": values.realName,
                    "mobilePhone": values.mobilePhone,
                    "idCard":values.idCard,
                    "areaId":values.areaName
                })
            }).then(res => {
                Promise.resolve(res.json())
                    .then(v => {
                          //超时判断
                        timeOut(v.ret)
                        if (v.ret == 1) {
                            this._resetForm("add");
                            this.setState({
                                addvisible: false
                            });
                            form.resetFields();
                            message.success('添加成功', 2);
                        } else {
                            message.error(v.msg, 2);
                        }
                    })
            }).catch(err => {
                console.log(err)
            })
        })
    }
    //添加用户信息取消
    addhandleCancel () {
        const form = this.addForm.props.form;
        // 重置表单
        form.resetFields();
        this.setState({
            addvisible: false,
        });
    }
    // 搜索功能
    _searchTableData() {
        const { title } = this.state;
        const form = this.searchForm.props.form;
        form.validateFields((err, values) => {
            // 未定义时给空值
            if (err) {
                return
            }
            return fetch(dataUrl, {
                ...postOption,
                body: JSON.stringify({
                    "name": values.realName,
                    "mobile": values.mobilePhone,
                    "idCard": values.idCard,
                    "areaId": values.areaId,
                    "isActivated": values.isActivated,
                    "pageIndex": 0,
                    "pageSize": 10
                })
            }).then(res => {
                Promise.resolve(res.json())
                    .then(v => {
                          //超时判断
                        timeOut(v.ret)
                        if (v.ret == 1) {
                            // 设置页面显示的元素
                            let itemCount = v.data.itemCount
                            let data = v.data.items
                            this.setState({
                                itemCount,
                                data
                            })
                            this._getTableDatas(title,data);
                        }
                    })
            }).catch(err => {
                console.log(err)
            })
        })
    }
    //重置
    _resetForm(type) {
        const { title,current } = this.state;
        const form = this.searchForm.props.form;
        // 重置表单
        form.resetFields();
        return fetch(dataUrl, {
            ...postOption,
            body: JSON.stringify({
                "pageIndex": type=="add"?0:this.state.current-1,
                "pageSize": 10
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                      //超时判断
                    timeOut(v.ret)
                    if (v.ret == 1) {
                        // console.log(v)
                        let data = v.data.items;
                        let itemCount = v.data.itemCount;
                        // 给每一条数据添加key
                        data.map((v, i) => {
                            v.key = i
                        })
                        this.setState({
                            data,
                            itemCount,
                            searchValue:{},
                            current:type=="add"?1:current
                        })
                        this._getTableDatas(title, data);
                    }
                })
        })
    }
    //导出数据
    _exportDataHandler() {
        console.log("导出数据")
    }
    //换页
    _pageChange(page){
        const { title,searchValue } = this.state;
        searchValue.pageIndex = page - 1;
        searchValue.pageSize=10
        return fetch(dataUrl, {
            ...postOption,
            body: JSON.stringify({
                ...searchValue
            })
        }).then(res=>{
            Promise.resolve(res.json())
            .then(v=>{
                  //超时判断
                timeOut(v.ret)
                if(v.ret==1){
                    // console.log(v);
                    // 设置页面显示的元素
                    let data = v.data.items;
                    //添加key
                    data.map((v, i) => {
                        v.key = i
                    })
                    this.setState({
                        itemCount:v.data.itemCount,
                        data,
                        current:page
                    })
                    this._getTableDatas(title, data);
                }
            })
            .catch(err=>{
                console.log(err)
            })
        })
    }
    render(){
        const { delVisible,columns,current,tableDatas,itemCount,addvisible,areaList,editvisible,editData,editPwdvisible} = this.state;
        const paginationProps = {
            current:current,
            showQuickJumper: true,
            total:itemCount,
            // 传递页码
            onChange: (page) => this._pageChange(page)
        };
        return(      
            <React.Fragment>
                <div className={styles.farmersInfo}>
                    <div className={styles.header}>
                        <span>|</span>农户信息
                    </div>
                    <div className={styles.searchForm}>
                        {/* 表单信息 */}
                        <SearchForm
                            wrappedComponentRef={(searchForm) => this.searchForm = searchForm}
                            {...{areaList}}
                        />
                        <div className={styles.buttonGroup}>
                            <Button
                                className={styles.fnButton}
                                // icon="search"
                                onClick={() => this._searchTableData()}
                            >
                                <i className={classnames('dyhsicon', 'dyhs-sousuo', `${styles.searchIcon}`)}></i>
                                搜索
                            </Button>
                            <Button
                                // icon='reload'
                                className={styles.fnButton}
                                onClick={() => this._resetForm()}
                            >
                                <i className={classnames('dyhsicon', 'dyhs-zhongzhi', `${styles.resetIcon}`)}></i>
                                重置
                            </Button>
                            <Button
                                icon='plus'
                                className={styles.fnButton}
                                onClick={() =>this.add()}
                            >
                                添加
                            </Button>
                            {/* <Button
                                // icon='upload'
                                className={styles.fnButton2}
                                onClick={() => this._exportDataHandler()}
                            >
                                <i className={classnames('dyhsicon', 'dyhs-daochu', `${styles.exportIcon}`)}></i>
                                导出数据
                            </Button> */}
                        </div> 
                    </div>
                    <Table
                        columns={columns}
                        className={styles.table}
                        pagination={paginationProps}
                        dataSource={tableDatas}
                        // scroll={{ x: 1000}}
                    />
                    {/* 添加弹窗 */}
                    <AddForm
                        wrappedComponentRef={(addForm) => this.addForm = addForm}
                        visible={addvisible}
                        onCancel={() => this.addhandleCancel()}
                        onOk={() => this.addhandleOk()}
                        {...{ areaList }}
                    />
                    {/* 修改弹窗 */}
                    <EditForm
                        wrappedComponentRef={(editForm) => this.editForm = editForm}
                        visible={editvisible}
                        onCancel={() => this.editCancelHandler()}
                        onOk={() => this.editOkHandler()}
                        {...{ editData, areaList }}
                    />
                    {/* 修改密码弹窗 */}
                    <EditPwdForm
                        wrappedComponentRef={(editPwdForm) => this.editPwdForm = editPwdForm}
                        visible={editPwdvisible}
                        onCancel={() => this.editPwdCancelHandler()}
                        onOk={() => this.editPwdOkHandler()}
                    />
                    {/* 删除弹窗 */}
                    <Modal 
                        title="删除"
                        visible={delVisible}
                        className={styles.delModal}
                        onOk={()=>this.delHandleOk()}
                        onCancel={()=>this.delHandleCancel()}
                        okText="确认"
                        cancelText="取消"
                        centered//居中显示
                    >
                        <p>删除后信息将无法恢复，是否确认删除。</p>
                    </Modal>
                </div>
            </React.Fragment>
        )
    }
}
//搜索表单
const SearchForm = Form.create()(
    class extends React.Component {
        render() {
            const { form, areaList} = this.props;
            const { getFieldDecorator } = form;
            const Option = Select.Option;
            if (areaList.length == 0) {
                return null
            }
            return (
                <Form 
                    layout='inline'
                    style={{
                        display: 'flex',
                        alignItems:"center",
                        flexWrap:"wrap",
                        marginRight:'10px'
                    }}>
                    <Form.Item>
                        {getFieldDecorator('realName', {})
                            (
                            <Input
                                placeholder='姓名'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('mobilePhone', {})
                            (
                            <Input
                                placeholder='手机'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('idCard', {})
                            (
                            <Input
                                placeholder='身份证'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('areaId', {})
                            (
                            <Select
                                placeholder='归属地区'
                            >
                                <Option value="">全部</Option>
                                {areaList.map((v, i) => {
                                    return (
                                        <Option key={i} value={v.areaId}>{v.areaName}</Option>
                                    )

                                })}
                            </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('isActivated', {})
                            (
                            <Select
                                placeholder='是否激活'
                            >
                                <Option value="">全部</Option>
                                <Option value="true" key='1'>激活</Option>
                                <Option value="false" key='2'>未激活</Option>
                            </Select>
                            )
                        }
                    </Form.Item>
                </Form>
            )
        }
    }
)
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};
//添加弹窗表单
const AddForm = Form.create()(
    class extends React.Component {
        render() {
            const { visible, onCancel, onOk, form,areaList} = this.props;
            const { getFieldDecorator } = form;
            if (areaList.length == 0) {
                return null
            }
            return (
                <Modal
                    className={styles.addModal}
                    visible={visible}
                    title="添加农户信息"
                    onCancel={onCancel}
                    onOk={onOk}
                    cancelText='取消'
                    okText='确定'
                    centered
                >
                    <Form>
                        <Form.Item {...formItemLayout} label='姓名'>
                            {getFieldDecorator('realName', {
                                initialValue: '',
                                rules: [{ required: true, message: '姓名不能为空' },],
                            })(
                                <Input
                                    placeholder='请输入农户的姓名'
                                    autoComplete='off'
                                    type='text'
                                />
                            )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="手机号">
                            {getFieldDecorator('mobilePhone', {
                                initialValue: '',
                                rules: [{ required: true, pattern: '^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\\d{8}$', message: '请输入正确的手机号码' }],
                            })(
                                <Input
                                    placeholder='请输入农户的手机号码'
                                    autoComplete='off'
                                />
                            )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="身份证">
                            {getFieldDecorator('idCard', {
                                initialValue: '',
                                rules: [
                                    { pattern:'^(^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$)|(^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])((\\d{4})|\\d{3}[Xx])$)$',message:"请输入正确的身份证号"}
                                ],
                            })(
                                <Input
                                    placeholder='请输入农户的身份证号'
                                    autoComplete='off'
                                />
                            )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label='归属片区'>
                            {getFieldDecorator('areaName', {
                                initialValue: '请选择归属片区',
                                rules: [{ required: true}]
                            })(
                                <Select>
                                    {areaList.map((v, i) => {
                                        return (
                                            <Option key={i} value={v.areaId}>{v.areaName}</Option>
                                        )
                                    })}
                                </Select>
                                )}
                        </Form.Item>
                    </Form>
                </Modal>
            )
        }
    }
)
//修改弹窗
const EditForm = Form.create()(
    class extends React.Component {
        render() {
            const { visible, onCancel, onOk, form,areaList,editData} = this.props;
            const { getFieldDecorator } = form;
            const Option = Select.Option;
            if (areaList.length == 0) {
                return null
            }
            if (editData.length == 0) {
                return null
            }
            // console.log(editData)
            return (
                <Modal
                    centered={true}
                    className={styles.editModal}
                    visible={visible}
                    title="修改农户信息"
                    onCancel={onCancel}
                    onOk={onOk}
                    cancelText='取消'
                    okText='确定'
                >
                    <Form>
                        <Form.Item {...formItemLayout} label='姓名'>
                            {getFieldDecorator('realName', {
                                initialValue: editData[0].realName,
                                rules: [{ required: true, message: '姓名不能为空' },],
                            })(
                                <Input
                                    placeholder='请输入农户的姓名'
                                    autoComplete='off'
                                    type='text'
                                />
                            )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="手机号">
                            {getFieldDecorator('mobilePhone', {
                                initialValue: editData[0].mobilePhone,
                                rules: [{ required: true, pattern: '^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\\d{8}$', message: '请输入正确的手机号码' }],
                            })(
                                <Input
                                    placeholder='请输入农户的手机号码'
                                    autoComplete='off'
                                />
                            )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="身份证">
                            {getFieldDecorator('idCard', {
                                initialValue: editData[0].idCard,
                                rules: [
                                    { pattern:'^(^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$)|(^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])((\\d{4})|\\d{3}[Xx])$)$',message:"请输入正确的身份证号"}
                                ],
                            })(
                                <Input
                                    placeholder='请输入农户的身份证号'
                                    autoComplete='off'
                                />
                            )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label='归属片区'>
                            {getFieldDecorator('areaName', {
                                initialValue: editData[0].areaName,
                                rules: [{ required: true}]
                            })(
                                <Select>
                                    {areaList.map((v, i) => {
                                        return (
                                            <Option key={i} value={v.areaId}>{v.areaName}</Option>
                                        )
                                    })}
                                </Select>
                                )}
                        </Form.Item>
                    </Form>
                </Modal>
            )
        }
    }
)
//修改密码弹窗
const EditPwdForm = Form.create()(
    class extends React.Component {
        state = {
            confirmDirty: false,
          };
          handleSubmit = (e) => {
            e.preventDefault();
            this.props.form.validateFieldsAndScroll((err, values) => {
              if (!err) {
                // console.log('Received values of form: ', values);
              }
            });
          }
        
          handleConfirmBlur = (e) => {
            const value = e.target.value;
            this.setState({ confirmDirty: this.state.confirmDirty || !!value });
          }
        
          compareToFirstPassword = (rule, value, callback) => {
            const form = this.props.form;
            if (value && value !== form.getFieldValue('password')) {
              callback('两次输入密码不一致!');
            } else {
              callback();
            }
          }
        
          validateToNextPassword = (rule, value, callback) => {
            const form = this.props.form;
            if (value && this.state.confirmDirty) {
              form.validateFields(['confirm'], { force: true });
            }
            callback();
          }
        render() {
            const { visible, onCancel, onOk, form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    centered={true}
                    className={styles.editPwdModal}
                    visible={visible}
                    title="修改密码"
                    onCancel={onCancel}
                    onOk={onOk}
                    cancelText='取消'
                    okText='确定'
                >
                    <Form>
                        <Form.Item
                            {...formItemLayout}
                            label="新密码"
                            >
                            {getFieldDecorator('password', {
                                rules: [{
                                required: true, pattern: '^[0-9a-zA-Z]{6,20}$', message: '请输入新密码'}, 
                                { min: 6, message: '不要小于6个字符' },
                                { max: 20, message: '不要超过20个字符'},
                                {validator: this.validateToNextPassword}
                            ],
                            })(
                                <Input placeholder='密码由6~20位字母和数字组成' type="password"/>
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="确认密码"
                            >
                            {getFieldDecorator('confirm', {
                                rules: [
                                    {required: true, message: '请再次输入新密码',}, 
                                    {validator: this.compareToFirstPassword}
                                ],
                            })(
                                <Input type="password" placeholder='确认新密码' onBlur={this.onBlur}/>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            )
        }
    }
)