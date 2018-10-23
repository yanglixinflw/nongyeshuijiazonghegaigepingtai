import React, { Component } from 'react';
import BreadcrumbView from '../PageHeader/breadcrumb';
import styles from './common.less';
import { Button, Input, Form, Table, Checkbox, Modal, Row, Col } from 'antd';
// const tableTitle = [
//     '温度', 
//     '湿度', 
//     '光照', 
//     '大气压', 
//     '蒸发量', 
//     '风向', 
//     '风速', 
//     '雨量',
//     '更新时间', ];
// 开发环境
const envNet = 'http://192.168.30.127:88';
const dataUrl = `${envNet}/api/DeviceData/historyData`;
//通用title
const currentTitle = [
    '更新时间'
];
export default class extends Component {
    constructor(props) {
        super(props)
        // console.log(props)
        const { meteorologyHistory } = props;
        const { items, itemCount } = meteorologyHistory.data.data;
        //标题数据
        const titleData = meteorologyHistory.title.data.data;
        //需要过滤的title
        let filtertitle = []
        titleData.map((v, i) => {
            let { displayName } = v;
            filtertitle.push(displayName)
        })
        //拼接完成全部title  //显示设置
        if (currentTitle.length == 1) {
            filtertitle.map((v, i) => {
                currentTitle.splice(0, 0, v);
            })
        };
        //获取设备信息
        let deviceInfo = JSON.parse(localStorage.getItem('deviceInfo'))
        // 获取标题和数据
        this.state = {
            //设备信息
            deviceInfo,
            //数据总数
            itemCount,
            //列表数据源
            items,
            //显示设置
            currentTitle,
            //列表title
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
            'AirTemperature',
            'AirHumidity',
            'Illumination',
            'Pressure',
            'Evaporate',
            'WindDirection',
            'WindSpeed',
            'Rainfall',
            'updateTime',
        ];
        title.map((v, i) => {
            columns.push({
                title: v,
                // 给表头添加字段名 必须一一对应
                dataIndex: dataIndex[i],
                align: 'center',
            })
        })
        columns[columns.length - 1].fixed = columns.length > 10 ? 'right' : null;
        columns[columns.length - 1].width = columns.length > 10 ? 'right' : null;
        let tableData = [];
        items.map((v, i) => {
            tableData.push({
                AirTemperature: v.AirTemperature,
                AirHumidity: v.AirHumidity,
                Illumination: v.Illumination,
                Pressure: v.Pressure,
                Evaporate: v.Evaporate,
                WindDirection: v.WindDirection,
                WindSpeed: v.WindSpeed,
                Rainfall: v.Rainfall,
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
            console.log(values.showSet)
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
    // 翻页请求数据
    _pageChange(page) {
        const { deviceInfo } = this.state;
        let deviceId = deviceInfo.deviceId
        let PageIndex = page - 1;
        return fetch(dataUrl,{
            method:'POST',
            mode:'cors',
            headers:new Headers({
                'Content-Type': 'application/json',
            }),
            credentials: "include",
            body:JSON.stringify({
                deviceId,
                deviceTypeId:3,
                PageIndex,
                pageSize: 10
            })
        }).then((res)=>{
            Promise.resolve(res.json())
            .then((v)=>{
                if(v.ret==1){
                    // console.log(v)
                    // 设置页面显示的元素
                    const {items,itemCount} = v.data;
                    //添加key
                    items.map((v,i)=>{
                        v.key = i
                    })
                    this.setState({
                        itemCount,
                        items
                    })
                    this._getTableData(this.state.title, this.state.items);
                }
            })
        }).catch((err)=>{
            console.log(err)
        })
    }
    render() {
        const { columns, tableData, showSetVisible, currentTitle,itemCount, deviceInfo } = this.state;
        const paginationProps = {
            showQuickJumper: true,
            total:itemCount,
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
                    {...{ currentTitle }}
                />
                <div className={styles.header}>
                    <Button icon="arrow-left"></Button>
                    <BreadcrumbView
                        {...this.props}
                        className={styles.breadcrumb}
                    />
                </div>
                <div className={styles.deviceInfo}>
                    <InfoForm
                        {...{ deviceInfo }}
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

//设备信息表单
const InfoForm = Form.create()(
    class extends React.Component {
        render() {
            const { form, deviceInfo } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Form layout='inline'>
                    <Form.Item>
                        {getFieldDecorator('deviceId', {
                            initialValue: deviceInfo.deviceId
                        })
                            (
                            <Input
                                disabled
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('name', {
                            initialValue: deviceInfo.name
                        })
                            (
                            <Input
                                disabled
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('installAddr', {
                            initialValue: deviceInfo.installAddr
                        })
                            (
                            <Input
                                disabled
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('ownerBuilding', {
                            initialValue: deviceInfo.ownerBuilding
                        })
                            (
                            <Input
                                disabled
                            />
                            )
                        }
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
            const { form, visible, onCancel, onOk, currentTitle } = this.props;
            // console.log(this.props)
            const { getFieldDecorator } = form;
            const CheckboxGroup = Checkbox.Group;
            const options = currentTitle
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
                            {getFieldDecorator('showSet', {
                                initialValue: currentTitle
                            })
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