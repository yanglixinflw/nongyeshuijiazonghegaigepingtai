import React,{Component} from 'react';
import styles from './farmersInfo.less';
import { Input, Button, Form, Select,Table, Modal,message} from 'antd';
//开发地址
const envNet='http://192.168.30.127:88';
//生产环境
// const envNet='';
//翻页调用
const dataUrl=`${envNet}/api/PeasantMgr/list`;
//删除调用
const delUrl=`${envNet}/api/PeasantMgr/delete`;
//添加调用
const addUrl=`${envNet}/api/PeasantMgr/add`;
//获取地址
const areaUrl=`${envNet}/api/Area/list`;
// post通用设置
let postOption = {
    method: 'POST',
    credentials: "include",
    mode: 'cors',
    headers: new Headers({
        'Content-Type': 'application/json',
    }),
}
//头信息
const tableTitle=[
    {index:"realName",item:"姓名"},
    {index:"mobilePhone",item:"电话"},
    {index:"idCard",item:"身份证"},
    {index:"areaId",item:"归属地区"},
    {index:"userType",item:"用户类型"},
    {index:"orgId",item:"所属机构"}
]
const { Option } = Select;
export default class extends Component{
    constructor(props) {
        super(props)
        const { farmersInfo } = props;
        this.state = {
            //表头数据
            tableTitle,
            title:tableTitle,
            itemCount:farmersInfo.data.data.itemCount,//总数据数
            data:farmersInfo.data.data.items,//表格数据源
            //表的每一列
            columns: [],
            //搜索框初始值
            searchValue: {
                "name": "",
                "mobile": "",
                "roleId": 0,
                "pageIndex": 0,
                "pageSize":10
            },
            //用于增删改查标识字段
            idCard:'',
            userId:"",
            //删除弹框显示的内容
            delModalText: '删除后信息将无法恢复，是否确认删除。',
            //删除的弹出框显示
            delVisible: false,
            //修改用户信息的弹出框显示
            editvisible: false,
            //添加用户信息的弹出框显示
            addvisible:false,
            //归属片区列表
            areaList:[]
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
            fixed: 'right',
            width: 200,
            render: (record) => {
                return (
                    <span className={styles.option}>
                        <Button
                            className={styles.edit}
                            onClick={() => this.editInfo(record.idCard)}
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
            tableDatas.push({
                realName:v.realName,
                mobilePhone:v.mobilePhone,
                idCard:v.idCard,
                areaId:v.areaId,
                userType:v.userType,
                orgId:v.orgId,
                userId:v.userId,
                key: i,
            });
        })
        this.setState({
            columns,
            tableDatas,
        });
    }
    //修改功能
    _editFarmerInfo(){
        console.log("修改")
    }
    //删除功能
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
                if (v.ret == 1) {
                    return fetch(dataUrl, {
                        ...postOption,
                        body: JSON.stringify({
                            "name": "",
                            "mobile": "",
                            "roleId": 0,
                            "pageIndex": 0,
                            "pageSize": 10
                        })
                    }).then(res => {
                        Promise.resolve(res.json())
                            .then(v => {
                                if (v.ret == 1) {
                                    let data = v.data.items;
                                    let itemCount = v.data.itemCount;
                                    // 给每一条数据添加key
                                    data.map((v, i) => {
                                        v.key = i
                                    });
                                    this.setState({
                                        data,
                                        itemCount,
                                        delVisible: false
                                    });
                                    this._getTableDatas(title, data);
                                    message.success('删除成功', 2);
                                } else {
                                    this.setState({
                                        items: []
                                    })
                                }
                            })
                    })
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
    showModal(){
        this.setState({
          visible: true,
        });
    }
    //修改用户信息的弹出框点击确定
    handleOk (){
        this.setState({
            ModalText: '',
            confirmLoading: true,
        });
    }
    //修改用户信息的弹出框点击取消
    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    }
    //添加用户信息的弹出框
    add(){
        this.setState({
          addvisible: true,
        });
    }
    addhandleOk(){
        const { title } = this.state
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
                    "areaId":values.areaId
                })
            }).then(res => {
                Promise.resolve(res.json())
                    .then(v => {
                        if (v.ret == 1) {
                            return fetch(dataUrl, {
                                ...postOption,
                                body: JSON.stringify({
                                    "name": "",
                                    "mobile": "",
                                    "roleId": 0,
                                    "pageIndex": 0,
                                    "pageSize": 10
                                })
                            }).then(res => {
                                Promise.resolve(res.json())
                                    .then(v => {
                                        if (v.ret == 1) {
                                            let items = v.data.items;
                                            let itemCount = v.data.itemCount;
                                            // 给每一条数据添加key
                                            items.map((v, i) => {
                                                v.key = i
                                            })
                                            this.setState({
                                                addvisible: false,
                                                itemCount,
                                                items,
                                            });
                                            this._getTableDatas(title, items);
                                            form.resetFields();
                                            message.success('添加成功', 2);
                                        } else {
                                            this.setState({
                                                items: []
                                            })
                                        }
                                    })
                            })
                        } else {
                            message.error(v.msg, 2);
                        }
                    })
            }).catch(err => {
                console.log(err)
            })
        })
    }
    addhandleCancel () {
        console.log('Clicked cancel button');
        this.setState({
            addvisible: false,
        });
    }
    // 搜索功能
    _searchTableData() {
        const { title } = this.state;
        const form = this.searchForm.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            // 未定义时给空值
            values.idCard = undefined || ""
            values.realName = undefined || ""
            values.pageIndex = 0;
            values.pageSize = 10;
            // console.log(values)
            // 保存搜索信息 翻页
            this.setState({
                searchValue: values
            })
            return fetch(dataUrl, {
                ...postOption,
                body: JSON.stringify({
                    ...values
                })
            }).then(res => {
                Promise.resolve(res.json())
                    .then(v => {
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
    _resetForm() {
        const form = this.searchForm.props.form;
        // 重置表单
        form.resetFields();
    }
    //导出数据
    _exportDataHandler() {
        console.log("导出数据")
    }
    //换页
    _pageChange(page){
        const { searchValue } = this.state;
        searchValue.pageIndex = page - 1;
        return fetch(dataUrl, {
            ...postOption,
            body: JSON.stringify({
                ...searchValue
            })
        }).then(res=>{
            Promise.resolve(res.json())
            .then(v=>{
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
                        data
                    })
                    this._getTableDatas(this.state.title, this.state.data);
                }
            })
            .catch(err=>{
                console.log(err)
            })
        })
    }
    render(){
        const { delVisible,columns, tableDatas,itemCount,delModalText,addvisible,areaList} = this.state;
        const paginationProps = {
            showQuickJumper: true,
            total:itemCount,
            // 传递页码
            onChange: (page) => this._pageChange(page)
        };
        return(      
            <React.Fragment>
                <div className={styles.header}>
                    <span>|</span>农户信息
                </div>
                <div className={styles.searchForm}>
                    {/* 表单信息 */}
                    <SearchForm
                        wrappedComponentRef={(searchForm) => this.searchForm = searchForm}
                    />
                    <div className={styles.buttonGroup}>
                        <Button
                            className={styles.fnButton}
                            icon="search"
                            onClick={() => this._searchTableData()}
                        >
                            搜索
                        </Button>
                        <Button
                            icon='reload'
                            className={styles.fnButton}
                            onClick={() => this._resetForm()}
                        >
                            重置
                        </Button>
                        <Button
                            icon='plus'
                            className={styles.fnButton}
                            onClick={() =>this.add()}
                        >
                            添加
                        </Button>
                        <Button
                            icon='upload'
                            className={styles.fnButton}
                            onClick={() => this._exportDataHandler()}
                        >
                            导出数据
                        </Button>
                    </div> 
                </div>
                <Table
                    columns={columns}
                    className={styles.table}
                    pagination={paginationProps}
                    dataSource={tableDatas}
                    scroll={{ x: 1000}}
                />
                <AddForm
                    wrappedComponentRef={(addForm) => this.addForm = addForm}
                    visible={addvisible}
                    onCancel={() => this.addhandleCancel()}
                    onOk={() => this.addhandleOk()}
                    {...{ areaList }}
                />
                <Modal 
                    title="删除"
                    visible={delVisible}
                    onOk={()=>this.delHandleOk()}
                    onCancel={()=>this.delHandleCancel()}
                    okText="确认"
                    cancelText="取消"
                    centered//居中显示
                >
                    <p>{delModalText}</p>
                </Modal>
            </React.Fragment>
        )
    }
}
//搜索表单
const SearchForm = Form.create()(
    class extends React.Component {
        render() {
            const { form } = this.props;
            const { getFieldDecorator } = form;
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
                        {getFieldDecorator('areaId', {initialValue:'area'})
                            (
                            <Select>
                                <Option value="area">归属地区</Option>
                                <Option value="all">全部</Option>
                            </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('state', {initialValue:'all'})
                            (
                            <Select>
                                <Option value="all">全部状态</Option>
                                <Option value="jihuo">激活</Option>
                                <Option value="weijihuo">未激活</Option>
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
                    //className={styles.addModal}
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
                            {getFieldDecorator('areaId', {
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
