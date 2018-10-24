import React, { Component } from 'react';
import styles from './index.less'
import {Button,Table,Form,Input,Cascader} from 'antd'
const tableTitle = [
    '账号', '姓名', '角色', '手机号', '权限', '添加日期'
];

export default class extends Component {
    constructor(props) {
        super(props)
        const { userManagement } = props;
        const { items, itemCount } = userManagement.data.data
        console.log(items)
        //获取标题和数据
        this.state = {
            //数据总数
            itemCount,
            //数据源
            items,
            //总数据列表title
            tableTitle,
            title: tableTitle,
            //表头
            columns: [],
            //表单数据
            tableData: [],
            // 添加弹窗可见性
            addVisible: false,
            // 修改弹窗
            modifyVisible: false,
            // 删除弹窗
            deleteVisible: false,
        }
    }
    componentDidMount() {
        this._getTableData(this.state.title, this.state.items);
    }
    //获取表的数据
    _getTableData(title, items) {
        let columns = [];
        let dataIndex = [
            'loginName',
            'realName',
            'roleName',
            'mobilePhone',
            'department',
        ]
        title.map((v, i) => {
            columns.push({
                title: v,
                // 给表头添加字段名 必须一一对应
                dataIndex: dataIndex[i],
                align: 'center',
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
                            onClick={() => this._modifyHandler(record.Id)}
                        >
                            修改
                        </Button>
                        <Button
                            icon='close'
                            className={styles.btnDelete}
                            onClick={() => this._deleteHandler(record.Id)}
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
                realName: v.realName,
                roleName: v.roleName,
                mobilePhone: v.mobilePhone,
                department: v.department,
                key: i,
            });
        })
        this.setState({
            columns,
            tableData,
        });
    }
    //搜索功能
    _searchTableData() {
        const form = this.searchForm.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            console.log(values)
        })
    }
    //重置
    _resetForm() {
        const form = this.searchForm.props.form;
        // 重置表单
        form.resetFields();
    }
    // 点击添加
    _addHandler() {
        this.setState({
            addVisible: true
        })
    }
    // 点击修改
    _modifyHandler(Id) {
        const { tableData } = this.state;
        let modifydata = {};
        modifydata = tableData.filter(Item => Item.Id === Id);
        this.setState({
            modifyVisible: true,
            Id: Id,
            modifyData: modifydata
        })
    }
    // 点击删除
    _deleteHandler(Id) {
        this.setState({
            deleteVisible: true,
            Id: Id
        })
    }
    render() {
        const { columns,tableData,itemCount} = this.state;
        const paginationProps = {
            showQuickJumper:true,
            total:itemCount,
        }
        return (
            <div>
                <div className={styles.header}>
                    <span>|</span>用户管理
                </div>
                <div className={styles.searchForm}>
                    <SearchForm 
                        wrappedComponentRef={(searchForm) => this.searchForm = searchForm}
                        searchHandler={() => this._searchTableData()}
                        resetHandler={() => this._resetForm()}
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
            </div>
        )
    }
}
//搜索表单
const SearchForm = Form.create()(
    class extends React.Component {
        render() {
            const { form, searchHandler, resetHandler } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Form layout='inline'>
                    <Form.Item>
                        {getFieldDecorator('loginName', {
                            initialValue: ''
                        })
                            (
                            <Input
                                placeholder='设备ID'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('realName', {
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
                        {getFieldDecorator('roleName', {
                            initialValue: ''
                        })
                            (
                            <Cascader
                                placeholder='全部角色'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('mobilePhone', {
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