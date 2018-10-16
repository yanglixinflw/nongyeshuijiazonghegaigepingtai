import React, { Component } from 'react';
import styles from './common.less';
import { Input, Button, Form, Cascader, Table } from 'antd';
import { Link } from 'dva/router';
const tableTitle = ['设备ID', '设备名称', '设备安装地', '关联建筑物', '土表温度', '10cm深温度', '10cm深湿度', '20cm深温度', '20cm深湿度', '30cm深温度', '30cm深湿度', '40cm深温度', '40cm深湿度', '更新时间']
export default class extends Component {
    constructor(props) {
        super(props)

        const { moisture } = props;
        const { data } = moisture.data
        console.log(data)
        // 获取标题和数据
        this.state = {
            title: tableTitle,
            data,
            //表头
            columns: [],
            //表单数据
            tableData: [],
        }
    }
    componentDidMount() {
        this._getTableData(this.state.title, this.state.data);
    }
    获取表的数据
    _getTableData(title, data) {
        let columns = [];
        let dataIndex = [
            'DeviceId',
            'DeviceName',
            'AreaName',
            'AssociatedBuilding',
            'SurfaceTemp',
            'UnderTenTemp',
            'UnderTenHumidity',
            'UnderTweTemp',
            'UnderTweHumidity',
            'UnderThrTemp',
            'UnderThrHumidity',
            'UnderForTemp',
            'UnderForHumidity',
            'UpdateTime'
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
            render: (record) => {
                return (
                    <span>
                        <Link to={`/daily/history:${record.DeviceId}`}>
                            <Button
                                icon='bar-chart'
                                className={styles.check}
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
                SurfaceTemp: v.SurfaceTemp,
                UnderTenTemp: v.UnderTenTemp,
                UnderTenHumidity: v.UnderTenHumidity,
                UnderTweTemp: v.UnderTweTemp,
                UnderTweHumidity: v.UnderTweHumidity,
                UnderThrTemp: v.UnderThrTemp,
                UnderThrHumidity: v.UnderThrHumidity,
                UnderForTemp: v.UnderForTemp,
                UnderForHumidity: v.UnderForHumidity,
                UpdateTime: v.UpdateTime,
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

    render() {
        const { columns, tableData } = this.state;
        const paginationProps = {
            showQuickJumper: true,
        };
        return (
            <div>
                <div className={styles.header}>
                    <span>|</span>清易墒情
                </div>
                <div className={styles.searchForm}>
                    <SearchForm
                        wrappedComponentRef={(searchForm) => this.searchForm = searchForm}
                        searchHandler={() => this._searchTableData()}
                        resetHandler={() => this._resetForm()}
                    />
                    <Button icon='eye' >显示设置</Button>
                    <Button icon='upload'>导出数据</Button>
                </div>
                <Table
                    columns={columns}
                    className={styles.table}
                    pagination={paginationProps}
                    dataSource={tableData}
                   
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
                <Form 
                layout='inline'
                >
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