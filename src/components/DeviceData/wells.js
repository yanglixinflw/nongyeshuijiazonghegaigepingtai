import React, { Component } from 'react';
import styles from './common.less';
import { Input, Button, Form, Cascader, Table, Checkbox, Modal, Row, Col } from 'antd';
import { Link } from 'dva/router';
// 开发环境
const envNet = 'http://192.168.30.127:88';
const dataUrl = `${envNet}/api/DeviceData/list`;
//全部title tableTitle
const tableTitle = [
    '设备ID',
    '设备名称',
    '设备安装地',
    '水位',
    '管道压力',
    '瞬时流量',
    '本次用电量',
    '本次用水量',
    '本次开泵时间',
    '本次关泵时间',
    '三相电压A',
    '三相电压B',
    '三相电压C',
    '三相电流A',
    '三相电流B',
    '三相电流C',
    '工作电压',
    'SIM卡信号强度',
    '年用水量',
    '累计用水量',
    '累计用电量',
    '设备IC状态',
    '设备仪表状态',
    '设备网关状态',
    '设备状态(泵)',
    '更新时间',
]
let dataIndex = [
    'deviceId',
    'name',
    'installAddr',
    'WaterLevel',
    'Pressure',
    'Flow',
    'ThisSumPower',
    'ThisSumWater',
    'ThisStart',
    'ThisStop',
    'VoltageA',
    'VoltageB',
    'VoltageC',
    'CurrentA',
    'CurrentB',
    'CurrentC',
    'Voltage',
    'Csq',
    'WaterTotalYear',
    'WaterTotal',
    'PowerTotal',
    'DeStateIC',
    'DeStateMeter',
    'DeStateGate',
    'DeStatePump',
    'updateTime',
];
export default class extends Component {
    constructor(props) {
        super(props)
        const { wells } = props;
        const { items, itemCount } = wells.data.data;
        // console.log(items)
        //获取标题和数据
        this.state = {
            //数据总数
            itemCount,
            //列表数据源
            items,
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
            //title Index
            dataIndex,
            //搜索信息栏
            deviceId: '',
            name: '',
            installAddrId: 0
        }
    }
    componentDidMount() {
        this._getTableData(this.state.title, this.state.items, this.state.dataIndex);
    }
    //获取设备信息 此时使用localStorage
    _getDeviceInfo(value) {
        let deviceInfo = JSON.stringify(value);
        localStorage.setItem('deviceInfo', deviceInfo)
    }
    //获取表的数据
    _getTableData(title, items,dataIndex) {
        let columns = [];
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
            fixed: 'right',
            width: 100,
            render: (record) => {
                return (
                    <span>
                        <Link to={`/wells/history:${record.deviceId}`}>
                            <Button
                                icon='bar-chart'
                                className={styles.btnhistroy}
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
                WaterLevel: v.realTimeData.WaterLevel,
                Pressure: v.realTimeData.Pressure,
                Flow: v.realTimeData.Flow,
                ThisSumPower: v.realTimeData.ThisSumPower,
                ThisSumWater: v.realTimeData.ThisSumWater,
                ThisStart: v.realTimeData.ThisStart,
                ThisStop: v.realTimeData.ThisStop,
                VoltageA: v.realTimeData.VoltageA,
                VoltageB: v.realTimeData.VoltageB,
                VoltageC: v.realTimeData.VoltageC,
                CurrentA: v.realTimeData.CurrentA,
                CurrentB: v.realTimeData.CurrentB,
                CurrentC: v.realTimeData.CurrentC,
                Voltage: v.realTimeData.Voltage,
                Csq: v.realTimeData.Csq,
                WaterTotalYear: v.realTimeData.WaterTotalYear,
                WaterTotal: v.realTimeData.WaterTotal,
                PowerTotal: v.realTimeData.PowerTotal,
                DeStateIC: v.realTimeData.DeStateIC,
                DeStateMeter: v.realTimeData.DeStateMeter,
                DeStateGate: v.realTimeData.DeStateGate,
                DeStatePump: v.realTimeData.DeStatePump,
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
        const form = this.searchForm.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            // console.log(values)
            // 保存搜索信息 翻页
            this.setState({
                deviceId: values.deviceId,
                name: values.name,
                installAddrId: values.installAddrId
            })
            return fetch(dataUrl, {
                method: "POST",
                mode: 'cors',
                headers: new Headers({
                    'Content-Type': 'application/json',
                }),
                credentials: "include",
                body: JSON.stringify({
                    deviceTypeId: 2,
                    ...values,
                    showColumns: [],
                    PageIndex: 0,
                    pageSize: 10
                })
            }).then((res) => {
                Promise.resolve(res.json())
                    .then((v) => {
                        if (v.ret == 1) {
                            // 设置页面显示的元素
                            let { items, itemCount } = v.data;
                            this.setState({
                                itemCount,
                                items
                            })
                            this._getTableData(this.state.title, this.state.items, this.state.dataIndex);
                        }
                    })
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
        const form = this.showSetForm.props.form;
        form.validateFields((err, values) => {
            // values即为表单数据
            if (err) {
                return;
            }
            // console.log(values)
            let {dataIndex} = values
            //显示确定空出
        })
        // 重置表单
        form.resetFields();
        this.setState({
            showSetVisible: false
        })
    }
    //显示设置点击取消
    _showSetCancelHandler() {
        // console.log('点击取消按钮');
        const form = this.showSetForm.props.form;
        // 重置表单
        form.resetFields();
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
        const { deviceId, name, installAddrId } = this.state;
        let PageIndex = page - 1;
        return fetch(dataUrl, {
            method: 'POST',
            mode: 'cors',
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
            credentials: "include",
            body: JSON.stringify({
                deviceTypeId: 2,
                deviceId,
                name,
                installAddrId,
                showColumns: [],
                PageIndex,
                pageSize: 10
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    if (v.ret == 1) {
                        // console.log(v);
                        // 设置页面显示的元素
                        const { items, itemCount } = v.data;
                        //添加key
                        items.map((v, i) => {
                            v.key = i
                        })
                        this.setState({
                            itemCount,
                            items
                        })
                        this._getTableData(this.state.title, this.state.items, this.state.dataIndex);
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        })
    }
    render() {
        const { columns, tableData, showSetVisible, tableTitle, itemCount, dataIndex } = this.state;
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
                    {...{ tableTitle, dataIndex }}
                />
                <div className={styles.header}>
                    <span>|</span>开创井电
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
                        { x: columns.length > 10 ? 3200 : false }
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
                            initialValue: ''
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
            const { form, visible, onCancel, onOk, tableTitle, dataIndex } = this.props;
            // console.log(title)
            const { getFieldDecorator } = form;
            const CheckboxGroup = Checkbox.Group;
            const options = tableTitle
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
                                initialValue: dataIndex
                            })
                                (
                                <CheckboxGroup>
                                    <Row>
                                        {options.map((v, i) => {
                                            return (
                                                <Col key={i} span={8}>
                                                    <Checkbox value={dataIndex[i]}>{v}</Checkbox>
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