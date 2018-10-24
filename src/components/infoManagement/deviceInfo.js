import React, { Component } from 'react';
import styles from './index.less'
import { Form, Button, Input, Select, Cascader, Table } from 'antd'
const Item = Form.Item
const Option = Select.Option
// 全部title
const totalTitle = [
    '设备ID',
    '设备型号',
    '设备名称',
    '设备安装地',
    '地理坐标',
    '启用日期',
    '运维公司',
    '管护人员',
    '网关地址',
    '出厂编号',
    '预警规则',
    '更新时间'
]
// 全部dataindex
const dataIndex = [
    'deviceId',
    'deviceTypeName',
    'name',
    'installAddr',
    // 地理坐标
    'IP',
    // 启用日期
    'enableTime',
    // 运维公司
    'opsCompony',
    'managerName',
    'gatewayAddr',
    'factoryNumber',
    'warningRules',
    'lastRequestTime'

]
export default class extends Component {
    constructor(props) {
        super(props)
        // console.log(props)
        this.state = {
            // 显示设置可见
            showSetVisible: false,
            // 表头
            columns: [],
            // 数据总数
            itemCount: props.data.data.itemCount,
            // 标题
            title: totalTitle,
            // 表格数据源
            data: props.data.data.items,
            // 表格数据
            tableData:[],
        }
        console.log(this.state.data)

    }
    componentDidMount() {
        // 初始化处理表单数据
        this._getTableData(this.state.title, this.state.data, dataIndex)
    }
    // 获取表单数据
    _getTableData(title, data, dataIndex) {
        let columns = []

        // 设置columns
        title.map((v, i) => {
            columns.push({
                title: v,
                // 表头添加字段
                dataIndex: dataIndex[i],
                align: 'center'
            })
        })
        // console.log(columns)
        //操作列
        columns.push({
            title: '操作',
            key: 'action',
            align: 'center',
            fixed: 'right',
            width: 410,
            render: (record) => {
                return (
                    <span>
                        <Button
                            className={styles.scan}
                            icon='scan'
                        >
                            生成二维码
                        </Button>
                        <Button
                            className={styles.warn}
                            icon='exception'
                        >
                            预警机制
                        </Button>
                        <Button
                            className={styles.edit}
                            icon='edit'
                        >
                            修改
                        </Button>
                        <Button
                            className={styles.delete}
                            icon='delete'
                        >
                            删除
                        </Button>
                    </span>
                )
            }
        })
        let tableData=[]
        // 表单数据
        data.map((v,i)=>{
            tableData.push({
                deviceId:v.deviceId,
                deviceTypeName:v.deviceTypeName,
                name:v.name,
                installAddr:v.installAddr,
                IP:`(${v.latitude},${v.longitude})`,
                enableTime:v.enableTime,
                opsCompony:v.opsCompony,
                managerName:v.managerName,
                gatewayAddr:v.gatewayAddr,
                factoryNumber:v.factoryNumber,
                warningRules:v.warningRules,
                lastRequestTime:v.lastRequestTime,
                key:i
            })
        })
        this.setState({
            columns,
            tableData,
        })

    }
    //点击显示设置
    _showSetHandler() {
        this.setState({
            showSetVisible: true
        })
    }
    // 翻页
    _pageChange(page){
        console.log(page)
    }
    // 重置搜索表单
    _resetForm() {
        console.log(123)
    }
    // 搜索功能
    _searchTableData() {
        console.log(456)
    }
    render() {
        const { columns, showSetVisible ,tableData,itemCount} = this.state
        const paginationProps = {
            showQuickJumper: true,
            total:itemCount,
            // 传递页码
            onChange: (page) => this._pageChange(page)
        };
        return (
            <div>

                <div className={styles.header}>
                    <span>|</span>设备信息
                </div>
                <div className={styles.searchGroup}>
                    <SearchForm
                        wrappedComponentRef={(searchForm) => this.searchForm = searchForm}
                    />
                    <div className={styles.buttonGroup}
                    >
                        <Button
                            className={styles.searchButton}
                            icon="search"
                            onClick={() => this._searchTableData()}
                        >
                            搜索
                    </Button>
                        <Button
                            icon='reload'
                            className={styles.searchButton}
                            onClick={() => this._resetForm()}
                        >
                            重置</Button>
                        <Button
                            icon='plus'
                        >
                            添加
                    </Button>
                        <Button
                            icon='eye'
                            onClick={() => this._showSetHandler()}
                        >
                            显示设置
                    </Button>
                        <Button
                            icon='upload'

                        >
                            导出数据
                    </Button>
                    </div>
                </div>
                <Table
                    columns={columns}
                    dataSource={tableData}
                    pagination={paginationProps}
                    scroll={
                        { x: columns.length > 10 ? 2000 : false }
                    }
                />
            </div>
        )
    }
}

// 搜索表单

const SearchForm = Form.create()(
    class extends Component {
        render() {
            const { form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Form
                    layout='inline'
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap'
                    }}
                >
                    <Item
                    >
                        {getFieldDecorator('deviceId', {
                            initialValue: ''
                        })
                            (
                            <Input
                                placeholder='设备ID'
                                type='text'
                            />
                            )
                        }
                    </Item>
                    <Item>
                        {getFieldDecorator('deviceTypeId', {
                        })
                            (
                            <Select
                                placeholder='设备类型'
                            >
                                <Option value=''>全部</Option>
                            </Select>
                            )
                        }
                    </Item>
                    <Item>
                        {getFieldDecorator('name', {
                            initialValue: ''
                        })
                            (
                            <Input
                                placeholder='设备名称'
                                type='text'
                            />
                            )
                        }
                    </Item>
                    <Item>
                        {getFieldDecorator('installAddrId', {
                            initialValue: ''
                        })
                            (
                            <Cascader
                                placeholder='设备安装地'
                            >
                            </Cascader>
                            )
                        }
                    </Item>
                    <Item>
                        {getFieldDecorator('areaName', {
                            initialValue: ''
                        })
                            (
                            <Input
                                placeholder='关联建筑物'
                                type='text'
                            />
                            )
                        }
                    </Item>
                    <Item>
                        {getFieldDecorator('warningRules', {
                            initialValue: ''
                        })
                            (
                            <Input
                                placeholder='预警规则'
                                type='text'
                            />
                            )
                        }
                    </Item>
                </Form>
            )
        }
    }
)



