import React, { Component } from 'react';
import styles from './common.less';
import { Input, Button, Form, Cascader, Table, Checkbox, Modal, Row, Col } from 'antd';
import { Link } from 'dva/router';
// 开发环境
const envNet = 'http://192.168.30.127:88';
//搜索 翻页url
const dataUrl = `${envNet}/api/DeviceData/list`;
// post通用设置
let postOption = {
    method: 'POST',
    credentials: "include",
    mode: 'cors',
    headers: new Headers({
        'Content-Type': 'application/json',
    }),
};
//全部的title
const tableTitle = [
    '设备ID',
    '设备名称',
    '设备安装地',
    '土表温度',
    '土壤温度10cm',
    '土壤湿度10cm',
    '土壤温度20cm',
    '土壤湿度20cm',
    '土壤温度30cm',
    '土壤湿度30cm',
    '土壤温度40cm',
    '土壤湿度40cm',
    '更新时间'
];
// 源columns拥有编号
const sourceColumns = [
    { title: "设备ID", dataIndex: "deviceId", number: 0 },
    { title: "设备名称", dataIndex: "name", number: 1 },
    { title: "设备安装地", dataIndex: "installAddr", number: 2 },
    { title: "土表温度", dataIndex: "SurfaceTemperature", number: 3 },
    { title: "土壤温度10cm", dataIndex: "SoilTemperature1", number: 4 },
    { title: "土壤湿度10cm", dataIndex: "SoilHumidity1", number: 5 },
    { title: "土壤温度20cm", dataIndex: "SoilTemperature2", number: 6 },
    { title: "土壤湿度20cm", dataIndex: "SoilHumidity2", number: 7 },
    { title: "土壤温度30cm", dataIndex: "SoilTemperature3", number: 8 },
    { title: "土壤湿度30cm", dataIndex: "SoilHumidity3", number: 9 },
    { title: "土壤温度40cm", dataIndex: "SoilTemperature4", number: 10 },
    { title: "土壤湿度40cm", dataIndex: "SoilHumidity4", number: 11 },
    { title: "更新时间", dataIndex: "updateTime", number: 12 }
];

export default class extends Component {
    constructor(props) {
        super(props)
        const { moisture } = props;
        // console.log(props)
        // 获取标题和数据
        this.state = {
            //数据总数
            itemCount: moisture.data.data.itemCount,
            //列表数据源
            items: moisture.data.data.items,
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
                "deviceTypeId": 4,
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
        // this._getTableData();
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
                        <Link to={`/moisture/history:${record.deviceId}`}>
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
                SurfaceTemperature: v.realTimeData.SurfaceTemperature,
                SoilTemperature1: v.realTimeData.SoilTemperature1,
                SoilHumidity1: v.realTimeData.SoilHumidity1,
                SoilTemperature2: v.realTimeData.SoilTemperature2,
                SoilHumidity2: v.realTimeData.SoilHumidity2,
                SoilTemperature3: v.realTimeData.SoilTemperature3,
                SoilHumidity3: v.realTimeData.SoilHumidity3,
                SoilTemperature4: v.realTimeData.SoilTemperature4,
                SoilHumidity4: v.realTimeData.SoilHumidity4,
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
            values.deviceTypeId = undefined || 4
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
                        if (v.ret == 1) {
                            let { items, itemCount } = v.data;
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
        const { items } = this.state
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
        // 重置表单
        form.resetFields();
        this.setState({
            showSetVisible: false
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
                        //添加key
                        items.map((v, i) => {
                            v.key = i
                        })
                        this.setState({
                            itemCount: v.data.itemCount,
                            items
                        })
                        this._getTableData(title, items, filterColumns);
                    }
                })
        }).catch((err) => {
            console.log(err)
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
                    <span>|</span>清易墒情
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
                        { x: columns.length > 10 ? 2800 : false }
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
                <Form
                    layout='inline'
                >
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
                                    {/* 全选空出 */}
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