import React, { Component } from 'react';
import BreadcrumbView from '../PageHeader/breadcrumb';
import styles from './common.less';
import { Button, Input, Form, Table, Checkbox, Modal, Row, Col } from 'antd';
const tableTitle = [
    '温度', 
    '湿度', 
    '光照', 
    '大气压', 
    '蒸发量', 
    '风向', 
    '风速', 
    '雨量',
    '更新时间', ];
export default class extends Component {
    constructor(props) {
        super(props)
        // console.log(props)
        const { meteorologyhistory } = props;
        const { data,total } = meteorologyhistory.data;
       
        // 获取标题和数据
        this.state = {
            total,
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
        let url = window.location.hash;
        const regexHistory = /history:(.+)/gm;
        let DeviceId = regexHistory.exec(url)[1];
        this.setState({
            DeviceId,
        })
        this._getTableData(this.state.title, this.state.data);
    }
    //获取表的数据
    _getTableData(title, data) {
        let columns = [];
        let dataIndex = [
            'Temperature',
            'Humidity',
            'Illumination',
            'AirPressure',
            'Evaporation',
            'WindDirection',
            'WindSpeed',
            'Rainfall',
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
        columns[columns.length - 1].fixed = columns.length>10?'right':null;
        columns[columns.length - 1].width = columns.length>10?'right':null;
        let tableData = [];
        data.map((v, i) => {
            tableData.push({
                Temperature: v.Temperature,
                Humidity: v.Humidity,
                Illumination: v.Illumination,
                AirPressure: v.AirPressure,
                Evaporation: v.Evaporation,
                WindDirection: v.WindDirection,
                WindSpeed: v.WindSpeed,
                Rainfall: v.Rainfall,
                UpdateTime: v.UpdateTime,
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
    _pageChange(page){
        const {DeviceId} = this.state;
        let PageIndex = page-1;
    }
    render() {
        const { columns, tableData, showSetVisible, tableTitle,total } = this.state;
        const paginationProps = {
            showQuickJumper: true,
            total,
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
                    {...{ tableTitle }}
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
                    scroll={{x:columns.length>10?2800:false}}
                />
            </div>
        )
    }
}

//设备信息表单
const InfoForm = Form.create()(
    class extends React.Component {
        render() {
            const { form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Form layout='inline'>
                    <Form.Item>
                        {getFieldDecorator('DeviceId', {
                            initialValue: '003242'
                        })
                            (
                            <Input
                                disabled
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('DeviceName', {
                            initialValue: '宁圩村气象站'
                        })
                            (
                            <Input
                                disabled
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('AreaName', {
                            initialValue: '杭州市-萧山区-宁围街道'
                        })
                            (
                            <Input
                                disabled
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('AssociatedBuilding', {
                            initialValue: '三号气象点'
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