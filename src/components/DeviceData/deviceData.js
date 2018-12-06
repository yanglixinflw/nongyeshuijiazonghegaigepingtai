import React, { Component } from 'react';
import styles from './common.less';
import { Input, Button, Form, Select, Table, Checkbox, Modal, Row, Col } from 'antd';
import { Link } from 'dva/router';
import _ from 'lodash';
import { timeOut } from '../../utils/timeOut';
import {ENVNet} from '../../services/netCofig'
//搜索 翻页url
const dataUrl = `${ENVNet}/api/DeviceData/list`;
// post通用设置
let postOption = {
    method: 'POST',
    credentials: "include",
    mode: 'cors',
    headers: new Headers({
        'Content-Type': 'application/json',
    }),
}
const Option = Select.Option
export default class extends Component {
    constructor(props) {
        super(props)
        let { pageTitle, deviceTypeId, title, InstallList } = props
        // console.log(props)
        // 公用Columns
        let commonColumns = [
            { name: "deviceId", displayName: "设备ID" },
            { name: "name", displayName: "设备名称" },
            { name: "installAddr", displayName: "设备安装地" },
            { name: "updateTime", displayName: "更新时间" }
        ]
        // 中间段columns
        let difColumns = title.data.data
        commonColumns.splice(3, 0, ...difColumns)
        // 添加序号
        commonColumns.map((v, i) => {
            v.number = i
        })
        //获取标题和数据
        this.state = {
            // 页面标题
            pageTitle,
            //数据总数
            itemCount: this.props.data.data.itemCount,
            // 拼接后的表头
            commonColumns,
            //表头
            columns: [],
            //表单数据
            tableData: this.props.data.data.items,
            //显示设置弹窗可见性
            showSetVisible: false,
            // 搜索框默认值
            searchValue: {
                "deviceTypeId": deviceTypeId,
                "deviceId": "",
                "name": "",
                "installAddrId": '',
                "showColumns": [],
                "pageIndex": 0,
                "pageSize": 10
            },
            // 页面typeId
            deviceTypeId,
            // 历史记录路径
            history: '',
            // 设置过滤后的表头
            filterColumns: commonColumns,
            // 设备安装地列表
            installAddress: InstallList.data.data,
        }
    }
    componentDidMount() {
        this._getTableData(this.state.tableData, this.state.commonColumns);
    }
    //获取设备信息 此时使用localStorage
    _getDeviceInfo(value) {
        let deviceInfo = JSON.stringify(value);
        localStorage.setItem('deviceInfo', deviceInfo)
    }
    //获取表的数据
    _getTableData(tableData, commonColumns) {
        const { deviceTypeId } = this.props
        let columns = [];
        commonColumns.map((v, i) => {
            // console.log(v.name)
            columns.push({
                title: v.displayName,
                // 给表头添加字段名 必须一一对应
                dataIndex: v.name,
                align: 'center',
                className: `${styles.tbw}`,
            })
        })
        //操作列
        columns.push({
            title: '操作',
            key: 'action',
            align: 'center',
            fixed: 'right',
            width: 100,
            className: `${styles.action}`,
            render: (record) => {
                return (
                    <span>
                        <Link to={`/device:${deviceTypeId}/history:${record.deviceId}`}>
                            <Button
                                icon='bar-chart'
                                onClick={() => this._getDeviceInfo(record)}
                            >
                                历史记录
                        </Button>
                        </Link>
                    </span>
                )
            }
        })
        // 操作数据源
        tableData.map((v, i) => {
            if (v.realTimeData != null) {
                let realTimeKeys = Object.keys(v.realTimeData)
                let realTimeData = Object.values(v.realTimeData)
                realTimeKeys.map((val, i) => {
                    v[val] = realTimeData[i]
                })
                v.key = i
            }
        })
        this.setState({
            columns,
            tableData
        });
    }
    // 搜索功能
    _searchTableData() {
        const { filterColumns, deviceTypeId } = this.state;
        const form = this.searchForm.props.form;
        form.validateFields((err, values) => {
            // console.log(values)
            if (err) {
                return
            }
            // console.log(deviceTypeId)
            // 未定义时给空值
            if (!values.installAddrId) {
                values.installAddrId = ''
            }
            values.deviceTypeId = deviceTypeId
            values.showColumns = undefined || []
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
            }).then((res) => {
                Promise.resolve(res.json())
                    .then((v) => {
                        //超时判断
                        timeOut(v.ret)
                        if (v.ret == 1) {
                            // 设置页面显示的元素
                            let { items, itemCount } = v.data;
                            this.setState({
                                itemCount,
                                tableData: items
                            })
                            this._getTableData(items, filterColumns);
                        }
                    })
            }).catch((err) => {
                console.log(err)
            })
        })
    }
    //重置
    _resetForm() {
        const { filterColumns, deviceTypeId } = this.state;
        const form = this.searchForm.props.form;
        console.log(deviceTypeId)
        // 重置表单
        form.resetFields();
        return fetch(dataUrl, {
            ...postOption,
            body: JSON.stringify({
                "deviceId": "",
                "name": "",
                "deviceTypeId": deviceTypeId,
                "installAddrId": "",
                "warningRules": "",
                "relatedBuildingId": "",
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    // console.log(v)
                    //超时判断
                    timeOut(v.ret)
                    if (v.ret == 1) {
                        let { items, itemCount } = v.data
                        this.setState({
                            itemCount,
                            data: items,
                            searchValue: {
                                "deviceTypeId": deviceTypeId,
                                "deviceId": "",
                                "name": "",
                                "installAddrId": '',
                                "showColumns": [],
                                "pageIndex": 0,
                                "pageSize": 10
                            },
                        })
                        this._getTableData(items, filterColumns)
                    }
                })
        }).catch((err) => {
            console.log(err)
        })

    }
    //点击显示设置
    _showSetHandler(type) {
        this.setState({
            showSetVisible: type
        })
    }
    //显示设置点击确定
    _showSetOkHandler() {
        const { tableData, commonColumns } = this.state;
        const form = this.showSetForm.props.form;
        form.validateFields((err, values) => {
            // values即为表单数据
            if (err) {
                return;
            }
            let { dataIndex } = values
            // 过滤后的columns
            let filterColumns = []
            // 比对dataIndex
            dataIndex.map((v, i) => {
                filterColumns.push(...commonColumns.filter(item => item === v))
            })
            // 排序函数
            let compare = function (prop) {
                return function (obj1, obj2) {
                    let val1 = obj1[prop];
                    let val2 = obj2[prop];
                    if (val1 < val2) {
                        return -1;
                    } else if (val1 > val2) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            }
            // 排序
            filterColumns.sort(compare('number'))
            this._getTableData(tableData, filterColumns)
            this.setState({
                showSetVisible: false,
                filterColumns
            })
        })
    }

    //导出数据
    _exportDataHandler() {
        console.log("导出数据")
    }
    //翻页
    _pageChange(page) {
        const { searchValue, filterColumns } = this.state;
        searchValue.pageIndex = page - 1;
        return fetch(dataUrl, {
            ...postOption,
            body: JSON.stringify({
                ...searchValue
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    //超时判断
                    timeOut(v.ret)
                    if (v.ret == 1) {
                        // console.log(v);
                        // 设置页面显示的元素
                        let items = v.data.items;
                        let itemCount = v.data.itemCount;
                        //添加key
                        items.map((v, i) => {
                            v.key = i
                        })
                        this.setState({
                            itemCount,
                            tableData: items
                        })
                        this._getTableData(items, filterColumns);
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
            showSetVisible,
            itemCount,
            pageTitle,
            installAddress,
            commonColumns } = this.state;
        const paginationProps = {
            showQuickJumper: true,
            total: itemCount,
            // 传递页码
            onChange: (page) => this._pageChange(page)
        };
        return (
            <div className={styles.deviceData}>
                <ShowSetForm
                    wrappedComponentRef={(showSetForm) => this.showSetForm = showSetForm}
                    visible={showSetVisible}
                    commonColumns={commonColumns}
                    onCancel={() => this._showSetHandler(false)}
                    onOk={() => this._showSetOkHandler()}
                />
                <div className={styles.header}>
                    <span>|</span>{pageTitle}
                </div>
                <div className={styles.searchForm}>
                    <SearchForm
                        wrappedComponentRef={(searchForm) => this.searchForm = searchForm}
                        searchHandler={() => this._searchTableData()}
                        resetHandler={() => this._resetForm()}
                        installAddress={installAddress}
                    />
                    <Button
                        icon='eye'
                        onClick={() => this._showSetHandler(true)}
                    >
                        显示设置
                    </Button>
                    <Button
                        icon='upload'
                        onClick={() => this._exportDataHandler()}
                    >导出数据
                    </Button>
                </div>
                <Table
                    columns={columns}
                    className={styles.table}
                    pagination={paginationProps}
                    dataSource={tableData}
                    rowKey={record => record.deviceId}
                    scroll={
                        { x: columns.length < 4 ? false : 3000 }
                    }
                />
            </div>
        )
    }
}
//搜索表单
const SearchForm = Form.create()(
    class extends React.Component {
        render() {
            const { form, searchHandler, resetHandler, installAddress } = this.props;
            const { getFieldDecorator } = form;
            // console.log(installAddress)
            return (
                <Form layout='inline'>
                    <Form.Item>
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
                    </Form.Item>
                    <Form.Item>
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
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('installAddrId')
                            (
                            <Select
                                placeholder='设备安装地'
                            >
                                <Option value=''>全部</Option>
                                {
                                    installAddress.length === 0 ? null
                                        :
                                        installAddress.map((v, i) => {
                                            return (
                                                <Option
                                                    value={v.id}
                                                    key={v.id}>
                                                    {v.addr}
                                                </Option>
                                            )

                                        })
                                }
                            </Select>
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
                            htmlType='submit'
                        >
                            重置</Button>
                    </Form.Item>
                </Form>
            )

        }
    }
)
//显示设置弹窗表单
const ShowSetForm = Form.create()(
    class extends React.Component {
        render() {
            const { form, visible, onCancel, onOk, commonColumns } = this.props;
            const { getFieldDecorator } = form;
            const CheckboxGroup = Checkbox.Group;
            return (
                <Modal
                    centered={true}
                    className={styles.showSetModal}
                    visible={visible}
                    title="显示设置"
                    onCancel={onCancel}
                    onOk={onOk}
                    cancelText='取消'
                    okText='确定'
                >
                    <Form>
                        <Form.Item>
                            {getFieldDecorator('dataIndex', {
                                initialValue: commonColumns
                            })
                                (
                                <CheckboxGroup>
                                    <Row>
                                        {commonColumns.map((v, i) => {
                                            return (
                                                <Col key={i} span={8}>
                                                    <Checkbox value={commonColumns[i]}>{v.displayName}</Checkbox>
                                                </Col>
                                            )
                                        })}
                                    </Row>
                                </CheckboxGroup>
                                )
                            }
                        </Form.Item>
                    </Form>
                </Modal>
            )
        }
    }
)