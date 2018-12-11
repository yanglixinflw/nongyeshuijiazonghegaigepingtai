import React, { Component } from 'react';
import { Button, Form, Table, Checkbox, Modal, Row, Col } from 'antd';
import styles from './common.less';
import classnames from 'classnames';
import { timeOut } from '../../utils/timeOut';
import {ENVNet,postOption} from '../../services/netCofig'
//翻页url
const dataUrl = `${ENVNet}/api/DeviceData/historyData`;
export default class extends Component {
    constructor(props) {
        super(props)
        let { title, deviceTypeId } = this.props
        // 公用Columns
        let commonColumns = [
            { name: "updateTime", displayName: "更新时间" }
        ]
        // 插入其他段
        let difColumns = title
        commonColumns.splice(0, 0, ...difColumns)
        // 添加序号
        commonColumns.map((v, i) => {
            v.number = i
        })
        //获取设备信息
        let deviceInfo = JSON.parse(localStorage.getItem('deviceInfo'));
        // console.log(this.props.deviceDataHistory.data);
        // 获取标题和数据
        this.state = {
            // 页面typeId
            deviceTypeId,
            //设备信息
            deviceInfo,
            //数据总数
            itemCount: this.props.deviceDataHistory.data.data.itemCount,
            // 拼接后的表头
            commonColumns,
            //表头
            columns: [],
            //表单数据
            tableData: this.props.deviceDataHistory.data.data.items,
            //显示设置弹窗可见性
            showSetVisible: false,
            // 设置过滤后的表头
            filterColumns: commonColumns
        }
    }
    componentDidMount() {
        //初始化数据
        this._getTableData(this.state.tableData, this.state.commonColumns);
    }
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
        // columns[columns.length - 1].fixed = columns.length > 10 ? 'right' : null;
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
    // 翻页请求数据
    _pageChange(page) {
        const { commonColumns, deviceTypeId, deviceInfo } = this.state;
        let deviceId = deviceInfo.deviceId;
        // console.log(deviceId)
        let PageIndex = page - 1;
        return fetch(dataUrl, {
            ...postOption,
            body: JSON.stringify({
                deviceId,
                deviceTypeId,
                PageIndex,
                pageSize: 10
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    //超时判断
                    timeOut(v.ret)
                    if (v.ret == 1) {
                        //设置页面元素
                        let tableData = v.data.items;
                        let itemCount = v.data.itemCount;
                        tableData.map((v, i) => {
                            v.key = i
                        })
                        this.setState({
                            itemCount,
                            tableData
                        })
                        this._getTableData(tableData, commonColumns);
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
                    onCancel={() => this._showSetHandler(false)}
                    onOk={() => this._showSetOkHandler()}
                />
                <div className={styles.deviceInfo}>
                    <div className={styles.info} title={deviceInfo.deviceId}>
                        <i className={classnames('dyhsicon', 'dyhs-shebeiID1', `${styles.deviceId}`)}></i>
                        {deviceInfo.deviceId}
                    </div>
                    <div className={styles.info} title={deviceInfo.name}>
                        <i className={classnames('dyhsicon', 'dyhs-shebeimingcheng1', `${styles.name}`)}></i>
                        {deviceInfo.name}
                    </div>
                    <div className={styles.info} title={deviceInfo.installAddr}>
                        <i className={classnames('dyhsicon', 'dyhs-shebeianzhuangdi1', `${styles.installAddr}`)}></i>
                        {deviceInfo.installAddr}
                    </div>
                    <Button
                        // icon='eye'
                        className={styles.showSet}
                        onClick={() => this._showSetHandler(true)}
                    >
                        <i className={classnames('dyhsicon', 'dyhs-xianshi', `${styles.showIcon}`)}></i>
                        显示设置
                    </Button>
                    <Button
                        // icon='upload'
                        className={styles.export}
                        onClick={() => this._exportDataHandler()}
                    >
                        <i className={classnames('dyhsicon', 'dyhs-daochu', `${styles.exportIcon}`)}></i>
                        导出数据
                    </Button>
                </div>
                <Table
                    columns={columns}
                    className={styles.table}
                    pagination={paginationProps}
                    dataSource={tableData}
                    // rowKey={record => record.key}
                    rowKey={() => Math.random()}
                    scroll={
                        // { x: columns.length > 10 ? 2800 : false }
                        { x: columns.length < 4 ? false : true }
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
            const { form, visible, onCancel, onOk, commonColumns } = this.props;
            // console.log(this.props)
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