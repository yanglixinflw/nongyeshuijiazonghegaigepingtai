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
    '网关地址',
    '管道压力',
    '太阳能电压',
    '瞬时流量',
    '累积流量',
    '供电电压',
    '阀门状态',
];
//通用title
const currentTitle = [
    '设备ID', 
    '设备名称', 
    '设备安装地', 
    '关联建筑物', 
    '更新时间'
];
export default class extends Component {
    constructor(props) {
        super(props)
        const { ball } = props;
        const { items } = ball.data.data;
        //标题数据
        const titleData = ball.title.data.data;
        //需要过滤的title
        let filtertitle = []
        titleData.map((v,i)=>{
            let {displayName} = v;
            filtertitle.push(displayName)
        })
        // 该显示的中间列title
        let showTitle = [];
        showTitle = tableTitle.filter(item => filtertitle.indexOf(item)!==-1);
        //拼接完成全部title
        if (currentTitle.length == 5) {
            showTitle.map((v, i) => {
                currentTitle.splice(4, 0, v);
            })
        };
        // console.log(items)
        // 获取标题和数据
        this.state = {
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
        let dataIndex = [
            'deviceId',
            'name',
            'installAddr',
            'ownerBuilding',
            'GatewayAddr',
            'Press',
            'SunElecPress',
            'InstantNumber',
            'WaterTotalNumber',
            'BatteryPress',
            'ValveStatus',
            'updateTime'
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
                        <Link to={`/ball/history:${record.DeviceId}`}>
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
                GatewayAddr: v.realTimeData.GatewayAddr,
                Press: v.realTimeData.Press,
                SunElecPress: v.realTimeData.SunElecPress,
                InstantNumber: v.realTimeData.InstantNumber,
                WaterTotalNumber: v.realTimeData.WaterTotalNumber,
                BatteryPress: v.realTimeData.BatteryPress,
                ValveStatus:v.realTimeData.ValveStatus,
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
            //console.log(values)
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
            console.log(values.showSet)
            
           
            
            
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
                    <span>|</span>新天通球阀
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
                        {getFieldDecorator('AreaName', {
                            initialValue:''
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
                                <CheckboxGroup >
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