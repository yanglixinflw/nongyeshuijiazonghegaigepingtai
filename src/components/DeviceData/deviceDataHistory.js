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
// 源columns拥有编号
const sourceColumns = [
    { title: "网关地址", dataIndex: "GatewayAddr", number: 0 },
    { title: "管道压力", dataIndex: "Press", number: 1 },
    { title: "太阳能电压", dataIndex: "SunElecPress", number: 2 },
    { title: "瞬时流量", dataIndex: "InstantNumber", number: 3 },
    { title: "累积流量", dataIndex: "WaterTotalNumber", number: 4 },
    { title: "供电电压", dataIndex: "BatteryPress", number: 5 },
    { title: "阀门状态", dataIndex: "ValveStatus", number: 6 },
    { title: "更新时间", dataIndex: "updateTime", number: 7 }
];
export default class extends Component {
    constructor(props) {
        super(props)
        // console.log(props)
        let {title}=this.props
        // 公用Columns
        let commonColumns = [
            { name: "updateTime", displayName: "更新时间" }
        ]
        // 插入其他段
        let difColumns=title.data.data
        commonColumns.splice(0,0,...difColumns)
        // 添加序号
        commonColumns.map((v,i)=>{
            v.number=i
        })
        //获取设备信息
        let deviceInfo = JSON.parse(localStorage.getItem('deviceInfo'));
        // console.log(filtertitle);
        // 获取标题和数据
        this.state = {
            //设备信息
            deviceInfo,
            //数据总数
            itemCount: 100,
            // 拼接后的表头
            commonColumns,
            //表头
            columns: [],
            //表单数据
            tableData: this.props.data.data.items,
            //显示设置弹窗可见性
            showSetVisible: false,
            // 设置过滤后的表头
            filterColumns: sourceColumns
        }
    }
    componentDidMount() {
        //初始化数据
        this._getTableData(this.state.tableData, this.state.commonColumns);
    }
    // componentWillUnmount(){
    //     //移除localStorange
    //     localStorage.removeItem('deviceInfo')
    // }
    //获取表的数据
    _getTableData(tableData, commonColumns) {
        let columns = [];
        commonColumns.map((v, i) => {
            
            columns.push({
                title: v.displayName,
                // 给表头添加字段名 必须一一对应
                dataIndex: v.name,
                align: 'center',
                className: `${styles.tbw}`
            })
        })
        columns[columns.length - 1].fixed = columns.length > 10 ? 'right' : null;
        tableData.map((v, i) => {
            v.key = i
        })
        // console.log(tableData)
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
        const { tableData ,commonColumns } = this.state;
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
            this._getTableData( tableData, filterColumns)
            this.setState({
                showSetVisible: false,
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
        // console.log(deviceId)
        let PageIndex = page - 1;
        return fetch(dataUrl, {
            ...postOption,
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
            commonColumns
            } = this.state;
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
                    commonColumns={commonColumns}
                    onCancel={() => this._showSetCancelHandler()}
                    onOk={() => this._showSetOkHandler()}
                />
                <div className={styles.header}>
                    <Button icon="arrow-left"
                    onClick={()=>{window.history.back()}}
                    >
                    </Button>
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
                    <div className={styles.info}>
                        <i className={classnames('dyhsicon', 'dyhs-shebeimingcheng', `${styles.name}`)}></i>
                        {deviceInfo.name}
                    </div>
                    <div className={styles.info}>
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
                    rowKey={record => record.updateTime}
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
            const { form, visible, onCancel, onOk ,commonColumns} = this.props;
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