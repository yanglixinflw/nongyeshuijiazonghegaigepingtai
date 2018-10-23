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
            data: props.data.data.items
        }
        console.log(this.state.data)

    }
    componentDidMount() {
        // 处理表单数据
        this._getTableData()
    }
    // 获取表单数据
    _getTableData() {
        let { title, data } = this.state
        let columns = []
        let dataIndex = [
            'deviceId',
            'deviceTypeName',
            'name',
            'installAddr',
            'IP',
        ]
    }
    //点击显示设置
    _showSetHandler() {
        this.setState({
            showSetVisible: true
        })
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
        const { columns, showSetVisible } = this.state
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
                    className={styles.table}
                    columns={columns}
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



