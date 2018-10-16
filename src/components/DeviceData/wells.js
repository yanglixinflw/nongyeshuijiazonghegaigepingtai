import React, { Component } from 'react';
import styles from './common.less';
import { Input, Button, Form, Cascader, Table, Checkbox, Modal, Row, Col } from 'antd';
import { Link } from 'dva/router';
export default class extends Component {
    constructor(props) {
        super(props)
        const { wells } = props;
        const { data, tableTitle } = wells.data;
        //获取标题和数据
        this.state = {
            data,
            tableTitle,
            title: tableTitle,
            //表头
            columns: [],
            //表单数据
            tableData: [],
            //显示设置弹窗可见性
            showSetVisible: false,
        }
    }
    componentDidMount() {
        this._getTableData(this.state.title, this.state.data);
    }
    //获取表的数据
    _getTableData(title, data) {
        let columns = [];
        let dataIndex = [
            'DeviceId',
            'DeviceName',
            'AreaName',
            'AssociatedBuilding',
            'MesNum',
            'MesType',
            'MesCode',
            'ReportTime',
            'TelemetryTime',
            'WaterLevel',
            'PipelinePressure',
            'InstantaneousFlow',
            'WaterYear',
            'WaterTotal',
            'ElectricityTotal',
            'UserId',
            'ThisPower',
            'ThisWater',
            'PumpingTime',
            'PumpOffTime',
            'DeviceStatus',
            'ThreePhasePower',
            'OperatingPower',
            'SIMCardSignal',
            'UpdateTime',
        ];
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
            fixed:'right',
            width:100,
            render: (record) => {
                return (
                    <span>
                        <Link to={`/daily/history:${record.DeviceId}`}>
                            <Button
                                icon='bar-chart'
                                className={styles.histroy}
                            >
                                历史记录
                        </Button>
                        </Link>
                    </span>
                )
            }
        })
        let tableData = [];
        data.map((v, i) => {
            tableData.push({
                DeviceId: v.DeviceId,
                DeviceName: v.DeviceName,
                AreaName: v.AreaName,
                AssociatedBuilding: v.AssociatedBuilding,
                MesNum: v.MesNum,
                MesType: v.MesType,
                MesCode: v.MesCode,
                ReportTime: v.ReportTime,
                TelemetryTime: v.TelemetryTime,
                WaterLevel: v.WaterLevel,
                PipelinePressure: v.PipelinePressure,
                InstantaneousFlow: v.InstantaneousFlow,
                WaterYear: v.WaterYear,
                WaterTotal: v.WaterTotal,
                ElectricityTotal: v.ElectricityTotal,
                UserId: v.UserId,
                ThisPower: v.ThisPower,
                ThisWater: v.ThisWater,
                PumpingTime: v.PumpingTime,
                PumpOffTime: v.PumpOffTime,
                DeviceStatus: v.DeviceStatus,
                ThreePhasePower: v.ThreePhasePower,
                OperatingPower: v.OperatingPower,
                SIMCardSignal: v.SIMCardSignal,
                UpdateTime:v.UpdateTime,
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
            console.log(values.showSet.length)
            // this.setState({
            //     title:values.showSet,
            //     columns:values.showSet.length
            // })
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
    render() {
        const { columns, tableData, showSetVisible, tableTitle } = this.state;
        const paginationProps = {
            showQuickJumper: true,
        };
        return (
            <div>
                <ShowSetForm
                    wrappedComponentRef={(showSetForm) => this.showSetForm = showSetForm}
                    visible={showSetVisible}
                    onCancel={() => this._showSetCancelHandler()}
                    onOk={() => this._showSetOkHandler()}
                    {...{ tableTitle }}
                />
                <div className={styles.header}>
                    <span>|</span>井电
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
                    scroll={{ x: 2800 }}
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
                        {getFieldDecorator('DeviceId', {})
                            (
                            <Input
                                placeholder='设备ID'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('DeviceName', {})
                            (
                            <Input
                                placeholder='设备名称'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('DeviceName', {})
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
            const { form, visible, onCancel, onOk,tableTitle } = this.props;
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
                >
                    <Form>
                        <Form.Item>
                            {getFieldDecorator('showSet', {})
                                (
                                <CheckboxGroup>
                                     <Row>
                                        {options.map((v,i)=>{
                                            return(
                                                <Col key={i} span={6}>
                                                    <Checkbox  value={v}>{v}</Checkbox>
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