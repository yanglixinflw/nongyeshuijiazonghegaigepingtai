import React, { Component } from 'react';
import styles from './common.less';
import { Input, Button, Form, Cascader, Table, Checkbox, Modal, Row, Col } from 'antd';
import { Link } from 'dva/router';
// 开发环境
const envNet = 'http://192.168.30.127:88';
//搜索 翻页url
const dataUrl = `${envNet}/api/DeviceData/list`;
let postOption = {
    method: 'POST',
    credentials: "include",
    mode: 'cors',
    headers: new Headers({
        'Content-Type': 'application/json',
    }),
}
//全部的title
const tableTitle = [
    '设备ID',
    '设备名称',
    '设备安装地',
    '空气温度',
    '空气湿度',
    '光照',
    '大气压力',
    '蒸发',
    '风向',
    '风速',
    '雨量',
    '更新时间'
];
// 源columns拥有编号
const sourceColumns = [
    { title: "设备ID", dataIndex: "deviceId", number: 0 },
    { title: "设备名称", dataIndex: "name", number: 1 },
    { title: "设备安装地", dataIndex: "installAddr", number: 2 },
    { title: "空气温度", dataIndex: "AirTemperature", number: 3 },
    { title: "空气湿度", dataIndex: "AirHumidity", number: 4 },
    { title: "光照", dataIndex: "Illumination", number: 5 },
    { title: "大气压力", dataIndex: "Pressure", number: 6 },
    { title: "蒸发", dataIndex: "Evaporate", number: 7 },
    { title: "风向", dataIndex: "WindDirection", number: 8 },
    { title: "风速", dataIndex: "WindSpeed", number: 9 },
    { title: "雨量", dataIndex: "Rainfall", number: 10 },
    { title: "更新时间", dataIndex: "updateTime", number: 11 }
];
export default class extends Component {
    constructor(props) {
        super(props)
        const { meteorology } = props;
        // console.log(currentTitle)
        // 获取标题和数据
        this.state = {
            //数据总数
            itemCount: meteorology.data.data.itemCount,
            //列表数据源
            items: meteorology.data.data.items,
            //总数据列表title
            tableTitle,
            //显示的数据列表title中文
            title: tableTitle,
            //表头
            columns: [],
            //表单数据
            tableData: [],
            //显示设置弹窗可见性
            showSetVisible: false,
            // 搜索框默认值
            searchValue: {
                "deviceTypeId": 3,
                "deviceId": "",
                "name": "",
                "installAddrId": 0,
                "showColumns": [],
                "pageIndex": 0,
                "pageSize": 10
            },
            // 设置过滤后的表头
            filterColumns: sourceColumns
        }
    }
    componentDidMount() {
        this._getTableData(this.state.title, this.state.items, sourceColumns);
    }
    //获取设备信息 此时使用localStorage
    _getDeviceInfo(value) {
        let deviceInfo = JSON.stringify(value);
        localStorage.setItem('deviceInfo', deviceInfo)
    }
    //获取表的数据
    _getTableData(title, items, dataIndex) {
        let columns = [];
        title.map((v, i) => {
            columns.push({
                title: v,
                // 给表头添加字段名 必须一一对应
                dataIndex: dataIndex[i].dataIndex,
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
            width: 100,
            render: (record) => {
                return (
                    <span>
                        <Link to={`/meteorology/history:${record.deviceId}`}>
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
        let tableData = [];
        items.map((v, i) => {
            tableData.push({
                deviceId: v.deviceId,
                name: v.name,
                installAddr: v.installAddr,
                AirTemperature: v.realTimeData.AirTemperature,
                AirHumidity: v.realTimeData.AirHumidity,
                Illumination: v.realTimeData.Illumination,
                Pressure: v.realTimeData.Pressure,
                Evaporate: v.realTimeData.Evaporate,
                WindDirection: v.realTimeData.WindDirection,
                WindSpeed: v.realTimeData.WindSpeed,
                Rainfall: v.realTimeData.Rainfall,
                updateTime: v.updateTime,
                key: i,
            });
        })
        this.setState({
            columns,
            tableData,
        });
    }
    // 搜索功能
    _searchTableData() {
        const { title, filterColumns } = this.state;
        const form = this.searchForm.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            // 未定义时给空值
            values.deviceTypeId = undefined || 3
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
                    ...values,
                })
            }).then((res) => {
                Promise.resolve(res.json())
                    .then((v) => {
                        if (v.ret == 1) {
                            // 设置页面显示的元素
                            // 设置页面显示的元素
                            let items = v.data.items;
                            let itemCount = v.data.itemCount;
                            this.setState({
                                itemCount,
                                items
                            })
                            this._getTableData(title, items, filterColumns);
                        }
                    })
            }).catch((err) => {
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
    //点击显示设置
    _showSetHandler() {
        this.setState({
            showSetVisible: true
        })
    }
    //显示设置点击确定
    _showSetOkHandler() {
        const { items } = this.state;
        const form = this.showSetForm.props.form;
        form.validateFields((err, values) => {
            // values即为表单数据
            if (err) {
                return;
            }
            let { dataIndex } = values
            // 过滤后的columns
            let filterColumns = []
            // 定义一个title
            let title = []
            // 比对dataIndex
            dataIndex.map((v, i) => {
                filterColumns.push(...sourceColumns.filter(item => item === v))
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
            // 保存标题
            filterColumns.map((v, i) => {
                title.push(v.title)
            })
            this._getTableData(title, items, filterColumns)
            this.setState({
                showSetVisible: false,
                title,
                filterColumns
            })
        })

    }
    //显示设置点击取消
    _showSetCancelHandler() {
        this.setState({
            showSetVisible: false
        })
    }
    //导出数据
    _exportDataHandler() {
        console.log("导出数据")
    }
    //翻页
    _pageChange(page) {
        const { searchValue, title, filterColumns } = this.state;
        searchValue.pageIndex = page - 1;
        return fetch(dataUrl, {
            ...postOption,
            body: JSON.stringify({
                ...searchValue
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
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
                            items
                        })
                        this._getTableData(title, items, filterColumns);
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        })
    }
    render() {
        const { columns, tableData, showSetVisible, itemCount } = this.state;
        const paginationProps = {
            showQuickJumper: true,
            total: itemCount,
            // 传递页码
            onChange: (page) => this._pageChange(page)
        };
        return (
            <div>
                <ShowSetForm
                    wrappedComponentRef={(showSetForm) => this.showSetForm = showSetForm}
                    visible={showSetVisible}
                    onCancel={() => this._showSetCancelHandler()}
                    onOk={() => this._showSetOkHandler()}
                />
                <div className={styles.header}>
                    <span>|</span>清易气象
                </div>
                <div className={styles.searchForm}>
                    <SearchForm
                        wrappedComponentRef={(searchForm) => this.searchForm = searchForm}
                        searchHandler={() => this._searchTableData()}
                        resetHandler={() => this._resetForm()}
                    />
                    <Button
                        icon='eye'
                        onClick={() => this._showSetHandler()}
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
                    scroll={
                        { x: columns.length > 10 ? 2200 : false }
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
            const { form, searchHandler, resetHandler } = this.props;
            const { getFieldDecorator } = form;
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
                        {getFieldDecorator('installAddrId', {
                            initialValue: 0
                        })
                            (
                            <Cascader
                                placeholder='设备安装地'
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
//显示设置弹窗表单
const ShowSetForm = Form.create()(
    class extends React.Component {
        render() {
            const { form, visible, onCancel, onOk } = this.props;
            // console.log(this.props)
            const { getFieldDecorator } = form;
            const CheckboxGroup = Checkbox.Group;
            return (
                <Modal
                    className={styles.showSet}
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
                                initialValue: sourceColumns
                            })
                                (
                                <CheckboxGroup>
                                    <Row>
                                        {tableTitle.map((v, i) => {
                                            return (
                                                <Col key={i} span={8}>
                                                    <Checkbox value={sourceColumns[i]}>{v}</Checkbox>
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