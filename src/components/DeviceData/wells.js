import React, { Component } from 'react';
import styles from './common.less';
import { Input, Button, Form, Cascader, Table, Checkbox, Modal, Row, Col } from 'antd';
import { Link } from 'dva/router';
//全部的title
const tableTitle = [
    '设备ID',
    '设备名称',
    '设备安装地',
    '关联建筑物',
    '报文类型',
    '报文编号',
    '上报时间',
    '遥测时间',
    '水位',
    '管道压力',
    '瞬时流量',
    '年用水量',
    '累计用水量',
    '累计用电量',
    '用户编号',
    '本次用电量',
    '本次用水量',
    '本次开泵时间',
    '本次关泵时间',
    '设备状态',
    '三相电压A',
    '三相电压B',
    '三相电压C',
    '三相电流A',
    '三相电流B',
    '三相电流C',
    '工作电压',
    'SIM卡信号强度',
    '设备IC状态',
    '设备仪表状态',
    '设备网关状态',
    '设备状态(泵)',
    '更新时间'];
//通用title
const currentTitle = [
    '设备ID',
    '设备名称',
    '设备安装地',
    '关联建筑物',
    '更新时间'
]
export default class extends Component {
    constructor(props) {
        super(props)
        const { wells } = props;
        const { items } = wells.data.data;
        const { itemCount } = wells.data.data;
        //标题数据
        const titleData = wells.title.data.data;
        //需要过滤出来的title
        let filterTitle = [];
        //需要过滤出来的title Index
        let titleIndex = [];
        titleData.map((v, i) => {
            let { displayName, name } = v;
            filterTitle.push(displayName);
            titleIndex.push(name);
        })
        // 该显示的中间列title
        let showTitle = [];
        showTitle = tableTitle.filter(item => filterTitle.indexOf(item) !== -1);
        //拼接完成全部title
        if (currentTitle.length == 5) {
            showTitle.map((v, i) => {
                currentTitle.splice(4, 0, v);
            })
        };
        // console.log(wells.data)
        //获取标题和数据
        this.state = {
            //数据总数
            itemCount,
            //显示列表title Index
            titleIndex,
            //列表数据源
            items,
            //总数据列表title
            tableTitle,
            //显示的数据列表title中文
            title: currentTitle,
            //表头
            columns: [],
            //表单数据
            tableData: [],
            //显示设置弹窗可见性
            showSetVisible: false,
        }
    }
    componentDidMount() {
        this._getTableData(this.state.title, this.state.items);
    }
    //获取表的数据
    _getTableData(title, items) {
        let columns = [];
        //通用title Index
        let dataIndex = [
            'deviceId',
            'name',
            'installAddr',
            'ownerBuilding',
            'updateTime',
        ];
        // 与显示title Index 合并 完成完整title Index
        this.state.titleIndex.map((v, i) => {
            dataIndex.splice(4, 0, v)
        })
        // console.log(dataIndex)
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
                        <Link to={`/wells/history:${record.DeviceId}`}>
                            <Button
                                icon='bar-chart'
                                className={styles.btnhistroy}
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
                ownerBuilding: v.ownerBuilding,
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
    _pageChange(page){
        
    }
    render() {
        const { columns, tableData, showSetVisible, tableTitle,itemCount } = this.state;
        const paginationProps = {
            showQuickJumper: true,
            total:itemCount,
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
                    {...{ tableTitle }}
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
            const { form, visible, onCancel, onOk, tableTitle } = this.props;
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
                                        {options.map((v, i) => {
                                            return (
                                                <Col key={i} span={6}>
                                                    <Checkbox value={v}>{v}</Checkbox>
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