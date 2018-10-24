import React, { Component } from 'react';
import BreadcrumbView from '../PageHeader/breadcrumb';
import { Button, Form, Table, Checkbox, Modal, Row, Col } from 'antd';
import styles from './common.less';
import classnames from 'classnames';
// 开发环境
const envNet = 'http://192.168.30.127:88';
const dataUrl = `${envNet}/api/DeviceData/historyData`;
//全部title
const tableTitle = [
    "网关地址",
    "管道压力",
    "太阳能电压",
    "瞬时流量",
    "累积流量",
    "供电电压",
    "阀门状态",
    '更新时间'
];
let dataIndex = [
    'GatewayAddr',
    'Press',
    'SunElecPress',
    'InstantNumber',
    'WaterTotalNumber',
    'BatteryPress',
    'ValveStatus',
    'updateTime',
];

export default class extends Component {
    constructor(props) {
        super(props)
        const { ballHistory } = props;
        const { items, itemCount } = ballHistory.data.data;
        //获取设备信息
        let deviceInfo = JSON.parse(localStorage.getItem('deviceInfo'));
        // console.log(deviceInfo)
        // console.log(filtertitle);
        // 获取标题和数据
        this.state = {
            //设备信息
            deviceInfo,
            //数据总数
            itemCount,
            //列表数据源
            items,
            // 全部title 显示设置
            tableTitle,
            //列表title
            title: tableTitle,
            //表头
            columns: [],
            //表单数据
            tableData: [],
            //显示设置弹窗可见性
            showSetVisible: false,
            //title index
            dataIndex,
        }
    }
    componentDidMount() {
        //初始化数据
        this._getTableData(this.state.title, this.state.items, this.state.dataIndex);
    }
    // componentWillUnmount(){
    //     //移除localStorange
    //     localStorage.removeItem('deviceInfo')
    // }
    //获取表的数据
    _getTableData(title, items, dataIndex) {
        let columns = [];
        // console.log(dataIndex)
        title.map((v, i) => {
            columns.push({
                title: v,
                // 给表头添加字段名 必须一一对应
                dataIndex: dataIndex[i],
                align: 'center',
            })
        })
        columns[columns.length - 1].fixed = columns.length > 10 ? 'right' : null;
        columns[columns.length - 1].width = columns.length > 10 ? 300 : null;
        let tableData = [];
        items.map((v, i) => {
            tableData.push({
                GatewayAddr: v.GatewayAddr,
                BatteryPress: v.BatteryPress,
                InstantNumber: v.InstantNumber,
                Press: v.Press,
                SunElecPress: v.SunElecPress,
                WaterTotalNumber: v.WaterTotalNumber,
                ValveStatus: v.ValveStatus,
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
        const form = this.showSetForm.props.form;
        form.validateFields((err, values) => {
            // values即为表单数据
            if (err) {
                return;
            }
            let { dataIndex } = values;
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
    // 翻页请求数据
    _pageChange(page) {
        const { deviceInfo } = this.state;
        let deviceId = deviceInfo.deviceId;
        // console.log(deviceId)
        let PageIndex = page - 1;
        return fetch(dataUrl, {
            method: 'POST',
            mode: 'cors',
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
            credentials: "include",
            body: JSON.stringify({
                deviceId,
                deviceTypeId: 1,
                PageIndex,
                pageSize: 10
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    if (v.ret == 1) {
                        const { items, itemCount } = v.data;
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
        }).catch((err) => {
            console.log(err)
        })
    }
    render() {
        const {
            columns,
            tableData,
            showSetVisible,
            tableTitle,
            itemCount,
            deviceInfo,
            dataIndex } = this.state;
        const paginationProps = {
            showQuickJumper: true,
            total: itemCount,
            // 传递页码
            onChange: (page) => this._pageChange(page)
        };
        // console.log(deviceInfo)
        return (
            <div className={styles.history}>
                <ShowSetForm
                    wrappedComponentRef={(showSetForm) => this.showSetForm = showSetForm}
                    visible={showSetVisible}
                    onCancel={() => this._showSetCancelHandler()}
                    onOk={() => this._showSetOkHandler()}
                    {...{ tableTitle, dataIndex }}
                />
                <div className={styles.header}>
                    <Button icon="arrow-left"></Button>
                    <BreadcrumbView
                        {...this.props}
                        className={styles.breadcrumb}
                    />
                </div>
                <div className={styles.deviceInfo}>
                    <div className={styles.info}>
                        <i className={classnames('dyhsicon', 'dyhs-shebeiID', `${styles.deviceId}`)}></i>
                        {deviceInfo.deviceId}
                    </div>
                    <div className={styles.info}>{deviceInfo.name}</div>
                    <div className={styles.info}>{deviceInfo.installAddr}</div>
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
                    scroll={
                        { x: columns.length > 10 ? 2800 : false }

                    }
                />
            </div>
        )

    }
}
//显示设置弹窗表单
const ShowSetForm = Form.create()(
    class extends React.Component {
        render() {
            const { form, visible, onCancel, onOk, tableTitle, dataIndex } = this.props;
            // console.log(this.props)
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
                                    {/* 全选空出 */}
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