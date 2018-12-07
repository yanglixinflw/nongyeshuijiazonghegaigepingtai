import React, { Component } from 'react';
import styles from './index.less'
import { Button, Table, Form, Input, Select, Modal, message } from 'antd';
import { timeOut } from '../../utils/timeOut';
import {ENVNet,postOption} from '../../services/netCofig'
////获取用户角色列表url
const roleUrl = `${ENVNet}/api/UserMgr/roleList`;
//获取部门列表url
const deptUrl = `${ENVNet}/api/UserMgr/deptList`;
//搜索 翻页url
const dataUrl = `${ENVNet}/api/UserMgr/list`;
//添加url
const addUrl = `${ENVNet}/api/UserMgr/add`;
//修改url
const updateUrl = `${ENVNet}/api/UserMgr/update`;
//删除url
const deleteUrl = `${ENVNet}/api/UserMgr/delete`;
//点击修改是获取用户详细信息
const detailUrl = `${ENVNet}/api/UserMgr/details`;
// 全部title
const tableTitle = [
    '账号', 
    '姓名', 
    '角色', 
    '手机号', 
    '部门', 
    '添加日期'
];
// 全局提示样式
message.config({
    top: 400,
});
export default class extends Component {
    constructor(props) {
        super(props)
        const { userManagement } = props;
        // console.log(props)
        //获取标题和数据
        this.state = {
            //数据总数
            itemCount: userManagement.data.data.itemCount,
            //数据源
            items: userManagement.data.data.items,
            //总数据列表title
            title: tableTitle,
            //表头
            columns: [],
            //表单数据
            tableData: [],
            // 添加弹窗可见性
            addVisible: false,
            // addVisible: true,
            // 修改弹窗
            modifyVisible: false,
            // modifyVisible: true,
            // 删除弹窗
            deleteVisible: false,
            // 点击修改/删除 数据ID
            userId: 0,
            // 修改对应ID的数据
            modifyData: '',
            //用户角色列表
            roleList: [],
            //部门列表
            deptList: [],
            //搜索框默认值、
            searchValue:{

            }
        }
    }
    componentDidMount() {
        this._getTableData(this.state.title, this.state.items);
        return (
            fetch(roleUrl, {
                ...postOption,
            }).then((res) => {
                Promise.resolve(res.json())
                    .then((v) => {
                        // 判断是否超时
                        timeOut(v.ret)
                        // console.log(v)
                        if (v.ret == 1) {
                            let roleList = v.data
                            this.setState({
                                roleList
                            })
                        }
                    })
            }).catch((err) => {
                console.log(err)
            }),
            fetch(deptUrl, {
                ...postOption,
            }).then((res) => {
                Promise.resolve(res.json())
                    .then((v) => {
                        // 判断是否超时
                        timeOut(v.ret)
                        if (v.ret == 1) {
                            // console.log(v)
                            let deptList = v.data
                            this.setState({
                                deptList
                            })
                        }
                    })
            }).catch((err) => {
                console.log(err)
            })
        )

    }
    //获取表的数据
    _getTableData(title, items) {
        let columns = [];
        let dataIndex = [
            'loginName',
            'realName',
            'roleName',
            'mobilePhone',
            'departmentName',
            'createTime'
        ]
        title.map((v, i) => {
            columns.push({
                title: v,
                // 给表头添加字段名 必须一一对应
                dataIndex: dataIndex[i],
                align: 'center',
                className: `${styles.tbw}`,
            })
        })
        //操作列
        columns.push({
            title: '操作',
            key: 'action',
            align: 'center',
            render: (record) => {
                return (
                    <span>
                        <Button
                            icon='check'
                            className={styles.btnModify}
                            onClick={() => this._modifyHandler(record.userId)}
                        >
                            修改
                        </Button>
                        <Button
                            icon='close'
                            className={styles.btnDelete}
                            onClick={() => this._deleteHandler(record.userId)}
                        >
                            删除
                        </Button>
                    </span>
                )
            }
        })
        let tableData = [];
        items.map((v, i) => {
            tableData.push({
                loginName: v.loginName,
                userId: v.userId,
                realName: v.realName,
                roleName: v.roleName,
                mobilePhone: v.mobilePhone,
                departmentName: v.departmentName,
                createTime: v.createTime,
                key: i,
            });
        })
        this.setState({
            columns,
            tableData,
        });
        // console.log(columns[4])
    }
    //搜索功能
    _searchTableData() {
        const { title } = this.state;
        const form = this.searchForm.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            values.pageIndex = 0;
            values.pageSize = 10;
            // console.log(values)
            //保存搜索框信息
            this.setState({
                searchValue: values
            })
            return fetch(dataUrl, {
                ...postOption,
                body: JSON.stringify({
                    ...values
                })
            }).then((res) => {
                Promise.resolve(res.json())
                    .then((v) => {
                        // 判断是否超时
                        timeOut(v.ret)
                        if (v.ret == 1) {
                            let items = v.data.items;
                            let itemCount = v.data.itemCount;
                            // 给每一条数据添加key
                            items.map((v, i) => {
                                v.key = i
                            })
                            this.setState({
                                itemCount,
                                items
                            })
                            this._getTableData(title, items)
                        }
                    })
            }).catch((err) => {
                console.log(err)
            })
        })
    }
    //重置
    _resetForm() {
        const { title } = this.state;
        const form = this.searchForm.props.form;
        // 重置表单
        form.resetFields();
        return fetch(dataUrl, {
            ...postOption,
            body: JSON.stringify({
                "pageIndex": 0,
                "pageSize": 10
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    // 判断是否超时
                    timeOut(v.ret)
                    if (v.ret == 1) {
                        // console.log(v)
                        let items = v.data.items;
                        let itemCount = v.data.itemCount;
                        // 给每一条数据添加key
                        items.map((v, i) => {
                            v.key = i
                        })
                        this.setState({
                            items,
                            itemCount,
                            searchValue:{}
                        })
                        this._getTableData(title, items);
                    }
                })
        })
    }
    // 点击添加
    _addHandler() {
        this.setState({
            addVisible: true
        })
    }
    // 添加确定
    _addOkHandler() {
        const { title } = this.state
        const form = this.addForm.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            // console.log(values)
            return fetch(addUrl, {
                ...postOption,
                body: JSON.stringify({
                    "departmentId": values.department,
                    "password": values.passWord,
                    "loginName": values.loginName,
                    "realName": values.realName,
                    "mobilePhone": values.mobilePhone,
                    "roleIds": values.roleName

                })
            }).then((res) => {
                Promise.resolve(res.json())
                    .then((v) => {
                        // 判断是否超时
                        timeOut(v.ret)
                        if (v.ret == 1) {
                            // console.log(v)
                            this._searchTableData();
                            message.success('添加成功', 2);
                            form.resetFields();
                            this.setState({
                                addVisible: false
                            })
                            
                        } else {
                            message.error(v.msg, 2);
                        }
                    })
            }).catch((err) => {
                console.log(err)
            })
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
    // 点击修改
    _modifyHandler(userId) {
        // const { items} = this.state;
        // console.log(items)
        return fetch(detailUrl, {
            ...postOption,
            body: JSON.stringify({
                userId
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    // 判断是否超时
                    timeOut(v.ret)
                    if (v.ret == 1) {
                        // console.log(v)
                        let modifydata = v.data;
                        this.setState({
                            userId,
                            modifyData: modifydata,
                            modifyVisible: true,
                        })
                    } else {
                        this.setState({
                            modifyData: []
                        })
                    }
                })
        }).catch((err) => {
            console.log(err)
        })

    }
    // 修改确定
    _modifyOkHandler() {
        const form = this.modifyForm.props.form;
        const { userId, title } = this.state;
        form.validateFields((err, values) => {
            // values即为表单数据
            if (err) {
                return;
            }
            // console.log(values);
            return fetch(updateUrl, {
                ...postOption,
                body: JSON.stringify({
                    roleIds:values.roleName,
                    "departmentId": values.department,
                    userId,
                    "loginName": values.loginName,
                    "realName": values.realName,
                    "mobilePhone": values.mobilePhone,
                    "password": values.passWord,
                })
            }).then((res) => {
                Promise.resolve(res.json())
                    .then((v) => {
                        // 判断是否超时
                        timeOut(v.ret)
                        if (v.ret == 1) {
                            this._searchTableData();
                            this.setState({
                                modifyVisible: false
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
    // 修改取消
    _modifyCancelHandler() {
        // console.log('点击取消按钮');
        const form = this.modifyForm.props.form;
        // 重置表单
        form.resetFields();
        this.setState({
            modifyVisible: false
        })
    }
    // 点击删除
    _deleteHandler(userId) {
        this.setState({
            deleteVisible: true,
            userId
        })
    }
    // 确认删除
    _deleteOkHandler() {
        let { userId } = this.state;
        let userIds = [];
        userIds.push(userId);
        return fetch(deleteUrl, {
            ...postOption,
            body: JSON.stringify({
                userIds
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    // 判断是否超时
                    timeOut(v.ret)
                    if (v.ret == 1) {
                        this._resetForm()
                        this.setState({
                            deleteVisible: false,
                        })
                        message.success('删除成功', 2);
                    } else {
                        message.error(v.msg, 2);
                    }
                })
        }).catch((err) => {
            console.log(err)
        })
    }
    // 取消删除
    _deleteCancelHandler() {
        this.setState({
            deleteVisible: false
        })
    }
    //翻页
    _pageChange(page) {
        const { title,searchValue } = this.state;
        searchValue.pageIndex = page - 1;
        return fetch(dataUrl, {
            ...postOption,
            body: JSON.stringify({
                ...searchValue
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    // 判断是否超时
                    timeOut(v.ret)
                    if (v.ret == 1) {
                        let items = v.data.items;
                        let itemCount = v.data.itemCount;
                        // 给每一条数据添加key
                        items.map((v, i) => {
                            v.key = i
                        });
                        this.setState({
                            items,
                            itemCount
                        })
                        this._getTableData(title, items)
                    }
                })
        }).catch((err) => {
            console.log(err)
        })
    }
    render() {
        const {
            columns,
            tableData,
            itemCount,
            deleteVisible,
            addVisible,
            modifyVisible,
            modifyData,
            //角色列表
            roleList,
            //部门列表
            deptList
        } = this.state;
        const paginationProps = {
            showQuickJumper: true,
            total: itemCount,
            // 传递页码
            onChange: (page) => this._pageChange(page)
        }
        return (
            <div className={styles.userMgr}>
                <Modal
                    centered={true}
                    className={styles.delModal}
                    visible={deleteVisible}
                    onOk={() => this._deleteOkHandler()}
                    onCancel={() => this._deleteCancelHandler()}
                    title='删除'
                    cancelText='取消'
                    okText='确定'
                >
                    <span>删除后用户将无法登陆农业水价综合管理平台，但系统依旧可以查看到该用户的操作日志。</span>
                </Modal>
                <div className={styles.header}>
                    <span>|</span>用户管理
                </div>
                <div className={styles.searchForm}>
                    <SearchForm
                        wrappedComponentRef={(searchForm) => this.searchForm = searchForm}
                        searchHandler={() => this._searchTableData()}
                        resetHandler={() => this._resetForm()}
                        {...{ roleList }}
                    />
                    <Button
                        icon="plus"
                        onClick={() => this._addHandler()}
                    >添加</Button>
                </div>
                <Table
                    pagination={paginationProps}
                    dataSource={tableData}
                    columns={columns}
                />
                {/* 添加弹窗 */}
                <AddForm
                    className={styles.addForm}
                    wrappedComponentRef={(addForm) => this.addForm = addForm}
                    visible={addVisible}
                    onCancel={() => this._addCancelHandler()}
                    onOk={() => this._addOkHandler()}
                    {...{ roleList, deptList }}
                />
                {/* 修改弹窗 */}
                <ModifyForm
                    wrappedComponentRef={(modifyForm) => this.modifyForm = modifyForm}
                    visible={modifyVisible}
                    onCancel={() => this._modifyCancelHandler()}
                    onOk={() => this._modifyOkHandler()}
                    {...{ modifyData, roleList, deptList }}
                />
            </div>
        )
    }
}
//搜索表单
const SearchForm = Form.create()(
    class extends React.Component {
        render() {
            const { form, searchHandler, resetHandler, roleList } = this.props;
            const { getFieldDecorator } = form;
            const Option = Select.Option;
            if (roleList.length == 0) {
                return null
            }
            // console.log(roleList)
            return (
                <Form layout='inline'>
                    <Form.Item>
                        {getFieldDecorator('loginName', {
                            initialValue: ''
                        })
                            (
                            <Input
                                placeholder='账号'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('name', {
                            initialValue: ''
                        })
                            (
                            <Input
                                placeholder='姓名'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('roleId', {
                            initialValue: ''
                        })
                            (
                            <Select
                                placeholder='全部角色'
                            >
                                <Option value=''>全部角色</Option>
                                {roleList.map((v, i) => {
                                    return (
                                        <Option key={i} value={v.id}>{v.name}</Option>
                                    )

                                })}
                            </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('mobile', {
                            initialValue: ''
                        })
                            (
                            <Input
                                placeholder='手机号'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        <Button
                            icon='search'
                            className={styles.searchButton}
                            onClick={() => searchHandler()}
                            htmlType='submit'
                        >
                            搜索</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            icon='reload'
                            className={styles.searchButton}
                            onClick={() => resetHandler()}
                        >
                            重置</Button>
                    </Form.Item>
                </Form>
            )

        }
    }
)
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};
//添加弹窗表单
const AddForm = Form.create()(
    class extends React.Component {
        render() {
            const { visible, onCancel, onOk, form, roleList, deptList } = this.props;
            const { getFieldDecorator } = form;
            const Option = Select.Option;
            if (roleList.length == 0) {
                return null
            }
            if (deptList.length == 0) {
                return null
            }
            // console.log(roleList)
            return (
                <Modal
                    centered={true}
                    className={styles.addModal}
                    visible={visible}
                    title="添加用户信息"
                    onCancel={onCancel}
                    onOk={onOk}
                    cancelText='取消'
                    okText='确定'
                >
                    <Form>
                        <Form.Item {...formItemLayout} label='账号'>
                            {getFieldDecorator('loginName', {
                                initialValue: '',
                                rules: [{ required: true, message: '请输入账号' },],
                            })(
                                <Input
                                    placeholder='建议使用邮箱作为账号'
                                    autoComplete='off'
                                    type='text'
                                />
                            )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label='姓名'>
                            {getFieldDecorator('realName', {
                                initialValue: '',
                                rules: [{ required: true, message: '请输入姓名' },],
                            })(
                                <Input
                                    placeholder='请输入姓名'
                                    autoComplete='off'
                                    type='text'
                                />
                            )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label='密码'>
                            {getFieldDecorator('passWord', {
                                initialValue: '',
                                rules: [
                                    { required: true, message: '请输入密码' },
                                    { min: 6, message: '不要小于6个字符' },
                                    { max: 20, message: '不要超过20个字符' }
                                ],
                            })(
                                <Input
                                    placeholder='密码由6~20位的字母和数字组成'
                                    autoComplete='off'
                                    type='PassWord'
                                />
                            )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label='部门'>
                            {getFieldDecorator('department', {
                                initialValue: deptList[0].id,
                                rules:[
                                    { required: true, message: '请先选择部门' }
                                ]
                            })
                                (
                                <Select
                                // mode="multiple"
                                >
                                    {deptList.map((v, i) => {
                                        return (
                                            <Option key={i} value={v.id}>{v.name}</Option>
                                        )

                                    })}
                                </Select>
                                )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label='角色'>
                            {getFieldDecorator('roleName', {
                                initialValue: [roleList[0].id],
                                rules:[
                                    { required: true, message: '请先创建角色' }
                                ]
                            })
                                (
                                <Select
                                    mode="multiple"
                                >
                                    {roleList.map((v, i) => {
                                        return (
                                            <Option key={i} value={v.id}>{v.name}</Option>
                                        )

                                    })}
                                </Select>
                                )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="手机号">
                            {getFieldDecorator('mobilePhone', {
                                initialValue: '',
                                rules: [{pattern: '^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\\d{8}$', message: '请输入正确的手机号码' }],
                            })(
                                <Input
                                    placeholder='请输入手机号码'
                                    autoComplete='off'
                                />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            )
        }
    }
)
//修改弹窗
const ModifyForm = Form.create()(
    class extends React.Component {
        render() {
            const { visible, onCancel, onOk, form, modifyData, roleList, deptList } = this.props;
            const { getFieldDecorator } = form;
            const Option = Select.Option;
            
            if (!modifyData) {
                return null
            }
            if (roleList.length == 0) {
                return null
            }
            if (deptList.length == 0) {
                return null
            }
            // console.log(modifyData)
            return (
                <Modal
                    centered={true}
                    className={styles.addModal}
                    visible={visible}
                    title="修改用户信息"
                    onCancel={onCancel}
                    onOk={onOk}
                    cancelText='取消'
                    okText='确定'
                >
                    <Form>
                        <Form.Item {...formItemLayout} label='账号'>
                            {getFieldDecorator('loginName', {
                                initialValue: modifyData.loginName,
                                rules: [{ required: true, message: '请输入账号' },],
                            })(
                                <Input
                                    placeholder='建议使用邮箱作为账号'
                                    autoComplete='off'
                                    type='text'
                                />
                            )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label='姓名'>
                            {getFieldDecorator('realName', {
                                initialValue: modifyData.realName,
                                rules: [{ required: true, message: '请输入姓名' },],
                            })(
                                <Input
                                    placeholder='请输入姓名'
                                    autoComplete='off'
                                    type='text'
                                />
                            )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label='密码'>
                            {getFieldDecorator('passWord', {
                                initialValue: "123456",
                                rules: [
                                    { required: true, message: '请输入密码' },
                                    { min: 6, message: '不要小于6个字符' },
                                    { max: 20, message: '不要超过20个字符' }
                                ],
                            })(
                                <Input
                                    placeholder='密码由6~20位的字母和数字组成'
                                    autoComplete='off'
                                    type='PassWord'
                                />
                            )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label='部门'>
                            {getFieldDecorator('department', {
                                initialValue: modifyData.departmentId,
                                rules:[
                                    { required: true, message: '请先选择部门' }
                                ]
                            })
                                (
                                <Select>
                                    {deptList.map((v, i) => {
                                        return (
                                            <Option key={i} value={v.id}>{v.name}</Option>
                                        )

                                    })}
                                </Select>
                                )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label='角色'>
                            {getFieldDecorator('roleName', {
                                initialValue: modifyData.roleIds,
                                rules:[
                                    { required: true, message: '请先创建角色' }
                                ]
                            })
                                (
                                <Select
                                    mode="multiple"
                                >
                                    {roleList.map((v, i) => {
                                        return (
                                            <Option key={i} value={v.id}>{v.name}</Option>
                                        )

                                    })}
                                </Select>
                                )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="手机号">
                            {getFieldDecorator('mobilePhone', {
                                initialValue: modifyData.mobilePhone,
                                rules: [{ pattern: '^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\\d{8}$', message: '请输入正确的手机号码' }],
                            })(
                                <Input
                                    placeholder='请输入手机号码'
                                    autoComplete='off'
                                />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            )
        }
    }
)