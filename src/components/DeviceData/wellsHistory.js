import React, { Component } from 'react';
import BreadcrumbView from '../PageHeader/breadcrumb';
import { Button, Form, Table, Checkbox, Modal, Row, Col } from 'antd';
import styles from './common.less';
import classnames from 'classnames';
// 开发环境
const envNet = 'http://192.168.30.127:88';
//翻页url
const dataUrl = `${envNet}/api/DeviceData/historyData`;
// post通用设置
let postOption = {
    method: 'POST',
    credentials: "include",
    mode: 'cors',
    headers: new Headers({
        'Content-Type': 'application/json',
    }),
};
//全部title tableTitle
const tableTitle = [
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
// 源columns拥有编号
const sourceColumns = [
    { title: "水位", dataIndex: "WaterLevel", number: 0 },
    { title: "管道压力", dataIndex: "Pressure", number: 1 },
    { title: "瞬时流量", dataIndex: "Flow", number: 2 },
    { title: "本次用电量", dataIndex: "ThisSumPower", number: 3 },
    { title: "本次用水量", dataIndex: "ThisSumWater", number: 4 },
    { title: "本次开泵时间", dataIndex: "ThisStart", number: 5 },
    { title: "本次关泵时间", dataIndex: "ThisStop", number: 6 },
    { title: "三相电压A", dataIndex: "VoltageA", number: 7 },
    { title: "三相电压B", dataIndex: "VoltageB", number: 8 },
    { title: "三相电压C", dataIndex: "VoltageC", number: 9 },
    { title: "三相电流A", dataIndex: "CurrentA", number: 10 },
    { title: "三相电流B", dataIndex: "CurrentB", number: 11 },
    { title: "三相电流C", dataIndex: "CurrentC", number: 12 },
    { title: "工作电压", dataIndex: "Voltage", number: 13 },
    { title: "SIM卡信号强度", dataIndex: "Csq", number: 14 },
    { title: "年用水量", dataIndex: "WaterTotalYear", number: 15 },
    { title: "累计用水量", dataIndex: "WaterTotal", number: 16 },
    { title: "累计用电量", dataIndex: "PowerTotal", number: 17 },
    { title: "设备IC状态", dataIndex: "DeStateIC", number: 18 },
    { title: "设备仪表状态", dataIndex: "DeStateMeter", number: 19 },
    { title: "设备网关状态", dataIndex: "DeStateGate", number: 20 },
    { title: "设备状态(泵)", dataIndex: "DeStatePump", number: 21 },
    { title: "更新时间", dataIndex: "updateTime", number: 22 }
];
export default class extends Component {
    constructor(props) {
        super(props)
        const { wellsHistory } = props;
        //获取设备信息
        let deviceInfo = JSON.parse(localStorage.getItem('deviceInfo'))
        // console.log(deviceInfo)
        // console.log(filtertitle);
        // 获取标题和数据
        this.state = {
            //设备信息
            deviceInfo,
            //数据总数
            itemCount: wellsHistory.data.data.itemCount,
            //列表数据源
            items: wellsHistory.data.data.items,
            //全部title 显示设置
            tableTitle,
            //列表title
            title: tableTitle,
            //表头
            columns: [],
            //表单数据
            tableData: [],
            //显示设置弹窗可见性
            showSetVisible: false,
            // 设置过滤后的表头
            filterColumns: sourceColumns
        }
    }
    componentDidMount() {
        this._getTableData(this.state.title, this.state.items, sourceColumns);
    }
    // componentWillUnmount(){
    //     //移除localStorange
    //     localStorage.removeItem('deviceInfo')
    // }
    //获取表的数据
    _getTableData(title, items, dataIndex) {
        let columns = [];
        title.map((v, i) => {
            columns.push({
                title: v,
                // 给表头添加字段名 必须一一对应
                dataIndex: dataIndex[i].dataIndex,
                align: 'center',
            })
        })
        columns[columns.length - 1].fixed = columns.length > 10 ? 'right' : null;
        columns[columns.length - 1].width = columns.length > 10 ? 300 : null;
        let tableData = [];
        items.map((v, i) => {
            tableData.push({
                WaterLevel: v.WaterLevel,
                Pressure: v.Pressure,
                Flow: v.Flow,
                ThisSumPower: v.ThisSumPower,
                ThisSumWater: v.ThisSumWater,
                ThisStart: v.ThisStart,
                ThisStop: v.ThisStop,
                VoltageA: v.VoltageA,
                VoltageB: v.VoltageB,
                VoltageC: v.VoltageC,
                CurrentA: v.CurrentA,
                CurrentB: v.CurrentB,
                CurrentC: v.CurrentC,
                Voltage: v.Voltage,
                Csq: v.Csq,
                WaterTotalYear: v.WaterTotalYear,
                WaterTotal: v.WaterTotal,
                PowerTotal: v.PowerTotal,
                DeStateIC: v.DeStateIC,
                DeStateMeter: v.DeStateMeter,
                DeStateGate: v.DeStateGate,
                DeStatePump: v.DeStatePump,
                updateTime: v.updateTime,
                key: i,
            });
        })
        this.setState({
            columns,
            tableData,
        });
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
    // 翻页请求数据
    _pageChange(page) {
        const { deviceInfo, title, filterColumns } = this.state;
        let deviceId = deviceInfo.deviceId;
        let PageIndex = page - 1;
        return fetch(dataUrl, {
            ...postOption,
            body: JSON.stringify({
                deviceId,
                deviceTypeId: 2,
                PageIndex,
                pageSize: 10
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    if (v.ret == 1) {
                        //设置页面元素
                        let items = v.data.items;
                        let itemCount = v.data.itemCount;
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
            deviceInfo,
            } = this.state;
        const paginationProps = {
            showQuickJumper: true,
            total: itemCount,
            // 传递页码
            onChange: (page) => this._pageChange(page)
        };
        return (
            <div className={styles.history}>
                <ShowSetForm
                    wrappedComponentRef={(showSetForm) => this.showSetForm = showSetForm}
                    visible={showSetVisible}
                    onCancel={() => this._showSetCancelHandler()}
                    onOk={() => this._showSetOkHandler()}
                />
                <div className={styles.header}>
                    <Button icon="arrow-left"></Button>
                    <BreadcrumbView
                        {...this.props}
                        className={styles.breadcrumb}
                    />
                </div>
                <div className={styles.deviceInfo}>
                <div className={styles.info} title={deviceInfo.deviceId}>
                        <i className={classnames('dyhsicon', 'dyhs-shebeiID', `${styles.deviceId}`)}></i>
                        {deviceInfo.deviceId}
                    </div>
                    <div className={styles.info} title={deviceInfo.name}>
                        <i className={classnames('dyhsicon', 'dyhs-shebeimingcheng', `${styles.name}`)}></i>
                        {deviceInfo.name}
                    </div>
                    <div className={styles.info} title={deviceInfo.installAddr}>
                        <i className={classnames('dyhsicon', 'dyhs-shebeianzhuangdi', `${styles.installAddr}`)}></i>
                        {deviceInfo.installAddr}
                    </div>
                    <Button
                        icon='eye'
                        onClick={() => this._showSetHandler()}
                    >
                        显示设置
                    </Button>
                    <Button
                        icon='upload'
                        onClick={() => this._exportDataHandler()}
                    >
                        导出数据
                    </Button>
                </div>
                <Table
                    columns={columns}
                    className={styles.table}
                    pagination={paginationProps}
                    dataSource={tableData}
                    scroll={{ x: columns.length > 10 ? 2800 : false }}
                />
            </div>
        )
    }
}

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