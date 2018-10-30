import React, { Component,Fragment } from 'react';
import styles from './index.less'
import {
    Form,
    Button,
    Input,
    Select,
    Table,
    Modal,
    Checkbox,
    Row,
    Col
} from 'antd'
import { Link } from 'dva/router';
const Item = Form.Item
const Option = Select.Option

// post通用设置
let postOption = {
    method: 'POST',
    credentials: "include",
    mode: 'cors',
    headers: new Headers({
        'Content-Type': 'application/json',
    }),
}

// 开发环境
const envNet = 'http://192.168.30.127:88'
// 搜索、翻页接口
const getDataUrl=`${envNet}/api/Device/list`
// 全部title
const totalTitle = [
    '设备ID',
    '设备型号',
    '设备名称',
    '设备安装地',
    '地理坐标',
    '启用日期',
    '运维公司',
    '管护人员',
    '网关地址',
    '出厂编号',
    '预警规则',
    '更新时间'
]
// 源columns拥有编号
const sourceColumns = [
    { title: "设备ID", dataIndex: "deviceId", number: 0 },
    { title: "设备型号", dataIndex: "deviceTypeName", number: 1 },
    { title: "设备名称", dataIndex: "name", number: 2 },
    { title: "设备安装地", dataIndex: "installAddr", number: 3 },
    { title: "地理坐标", dataIndex: "IP", number: 4 },
    { title: "启用日期", dataIndex: "enableTime", number: 5 },
    { title: "运维公司", dataIndex: "opsCompony", number: 6 },
    { title: "管护人员", dataIndex: "managerName", number: 7 },
    { title: "网关地址", dataIndex: "gatewayAddr", number: 8 },
    { title: "出厂编号", dataIndex: "factoryNumber", number: 9 },
    { title: "预警规则", dataIndex: "warningRules", number: 10 },
    { title: "更新时间", dataIndex: "lastRequestTime", number: 11 }
]
export default class extends Component {
    constructor(props) {
        super(props)
        // console.log(props)
        this.state = {
            // 显示设置可见
            showSetVisible: false,
            // showSetVisible: true,
            // 表头
            columns: [],
            // 数据总数
            itemCount: props.data.data.itemCount,
            // 标题
            title: totalTitle,
            // 表格数据源
            data: props.data.data.items,
            // 表格数据
            tableData: [],
            // 搜索框默认值
            searchValue: {
                "deviceId": "",
                "name": "",
                "deviceTypeId": "",
                "installAddrId": "",
                "warningRules": "",
                "areaName": "",
            },
            // 设备安装地列表
            installAddress:props.list.data.data,
            // 过滤后的表头
            filterColumns:sourceColumns
        }
    }
    componentDidMount() {
        // 初始化处理表单数据
        this._getTableData(this.state.title, this.state.data, sourceColumns)
    }
    // 获取表单数据
    _getTableData(title, data, sourceColumns) {
        let columns = []
        // 设置columns
        title.map((v, i) => {
            columns.push({
                title: v,
                // 表头添加字段
                dataIndex: sourceColumns[i].dataIndex,
                align: 'center',
                className: `${styles.tbw}`
            })
        })
        // console.log(columns)
        //操作列
        columns.push({
            title: '操作',
            key: 'action',
            align: 'center',
            fixed: 'right',
            width: 410,
            render: (record) => {
                return (
                    <span>
                        <Button
                            className={styles.scan}
                            icon='scan'
                        >
                            生成二维码
                        </Button>
                        <Link to={`/deviceInformation/warningRules:${record.deviceId}`}>
                        <Button
                            className={styles.warn}
                            icon='exception'
                        >
                            预警机制
                        </Button>
                        </Link>
                        
                        <Button
                            className={styles.edit}
                            icon='edit'
                        >
                            修改
                        </Button>
                        <Button
                            className={styles.delete}
                            icon='delete'
                        >
                            删除
                        </Button>
                    </span>
                )
            }
        })
        let tableData = []
        // 表单数据
        data.map((v, i) => {
            tableData.push({
                deviceId: v.deviceId,
                deviceTypeName: v.deviceTypeName,
                name: v.name,
                installAddr: v.installAddr,
                IP: `(${v.latitude},${v.longitude})`,
                enableTime: v.enableTime,
                opsCompony: v.opsCompony,
                managerName: v.managerName,
                gatewayAddr: v.gatewayAddr,
                factoryNumber: v.factoryNumber,
                warningRules: v.warningRules,
                lastRequestTime: v.lastRequestTime,
                key: i
            })
        })
        this.setState({
            columns,
            tableData,
        })

    }
    //点击显示设置
    _showSetHandler() {
        this.setState({
            showSetVisible: true
        })
    }
    // 翻页
    _pageChange(page) {
        let {searchValue}=this.state
        searchValue.pageIndex=page-1
        // console.log(searchValue)
    }
    // 重置搜索表单
    _resetForm() {
        const form =this.searchForm.props.form;
        // 重置表单
        form.resetFields();
    }
    // 搜索功能
    _searchTableData() {
        const{title,data,filterColumns}=this.state
        const form =this.searchForm.props.form;
        form.validateFields((err, values) => {
            // values即为表单数据
            if (err) {
                return;
            }
            // 未定义时给空值
            values.deviceTypeId=undefined||''
            values.installAddrId=undefined||''
            values.pageIndex=0
            values.pageSize=10
            this.setState({
                searchValue:values
            })
            return fetch(getDataUrl,{
                ...postOption,
                body:JSON.stringify({
                    ...values
                })
            }).then((res)=>{
                Promise.resolve(res.json())
                .then((v)=>{
                    if(v.ret==1){
                        // console.log(v)
                        let {items,itemCount}=v.data
                        this.setState({
                            itemCount,
                            data:items
                        })
                        this._getTableData(title,data,filterColumns)
                    }
                })
            }).catch((err)=>{
                console.log(err)
            })
        })
    }
    // 导出数据
    _uploadHandler() {
        console.log('导出数据')
    }
    //取消显示设置 
    _setShowCancel() {
        this.setState({
            showSetVisible: false
        })
    }
    // 确定显示设置
    _setShowOk() {
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
            console.log(filterColumns)
            this._getTableData(title, this.state.data, filterColumns)
            this.setState({
                showSetVisible: false,
                title,
                filterColumns
            })
        })
        
    }
    render() {
        const { columns, showSetVisible, tableData, itemCount ,installAddress} = this.state
        const paginationProps = {
            showQuickJumper: true,
            total: itemCount,
            // 传递页码
            onChange: (page) => this._pageChange(page)
        };
        return (
            <Fragment>
                <ShowSetForm
                    wrappedComponentRef={(showSetForm) => this.showSetForm = showSetForm}
                    visible={showSetVisible}
                    onCancel={() => this._setShowCancel()}
                    onOk={() => this._setShowOk()}
                    
                />

                <div className={styles.header}>
                    <span>|</span>设备信息
                </div>
                <div className={styles.searchGroup}>
                    <SearchForm
                        wrappedComponentRef={(searchForm) => this.searchForm = searchForm}
                        installAddress={installAddress}
                    />
                    <div className={styles.buttonGroup}
                    >
                        <Button
                            className={styles.searchButton}
                            icon="search"
                            onClick={() => this._searchTableData()}
                        >
                            搜索
                    </Button>
                        <Button
                            icon='reload'
                            className={styles.searchButton}
                            onClick={() => this._resetForm()}
                        >
                            重置</Button>
                        <Button
                            icon='plus'
                        >
                            添加
                    </Button>
                        <Button
                            icon='eye'
                            onClick={() => this._showSetHandler()}
                        >
                            显示设置
                    </Button>
                        <Button
                            icon='upload'
                            onClick={() => this._uploadHandler()}
                        >
                            导出数据
                    </Button>
                    </div>
                </div>
                <Table
                    columns={columns}
                    dataSource={tableData}
                    pagination={paginationProps}
                    scroll={
                        { x: columns.length > 10 ? 2000 : false }
                    }
                />
            </Fragment>
        )
    }
}

// 搜索表单
const SearchForm = Form.create()(
    class extends Component {
        render() {
            const { form ,installAddress} = this.props;
            const { getFieldDecorator } = form;
            return (
                <Form
                    layout='inline'
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap'
                    }}
                >
                    <Item
                    >
                        {getFieldDecorator('deviceId', {
                            initialValue: ''
                        })
                            (
                            <Input
                                placeholder='设备ID'
                                type='text'
                            />
                            )
                        }
                    </Item>
                    <Item>
                        {getFieldDecorator('deviceTypeId', {
                        })
                            (
                            <Select
                                placeholder='设备类型'
                            >
                                <Option value=''>全部</Option>
                            </Select>
                            )
                        }
                    </Item>
                    <Item>
                        {getFieldDecorator('name', {
                            initialValue: ''
                        })
                            (
                            <Input
                                placeholder='设备名称'
                                type='text'
                            />
                            )
                        }
                    </Item>
                    <Item>
                        {getFieldDecorator('installAddrId', {
                        })
                            (
                            <Select
                                placeholder='设备安装地'
                            >
                                <Option value=''>全部</Option>
                            </Select>
                            )
                        }
                    </Item>
                    <Item>
                        {getFieldDecorator('areaName', {
                            initialValue: ''
                        })
                            (
                            <Input
                                placeholder='关联建筑物'
                                type='text'
                            />
                            )
                        }
                    </Item>
                    <Item>
                        {getFieldDecorator('warningRules', {
                            initialValue: ''
                        })
                            (
                            <Input
                                placeholder='预警规则'
                                type='text'
                            />
                            )
                        }
                    </Item>
                </Form>
            )
        }
    }
)
// 显示设置弹窗表单
const ShowSetForm = Form.create()(
    class extends React.Component {
        render() {
            const { visible, form, onOk, onCancel } = this.props
            const { getFieldDecorator } = form;
            const CheckboxGroup = Checkbox.Group;
            return (
                <Modal
                    visible={visible}
                    title="显示设置"
                    cancelText='取消'
                    okText='确定'
                    onOk={onOk}
                    onCancel={onCancel}
                >
                    <Form>
                        <Form.Item>
                            {getFieldDecorator('dataIndex', {
                                initialValue: sourceColumns
                            })
                                (
                                <CheckboxGroup>
                                    <Row>
                                        {/* <Col><Checkbox value='q'>q</Checkbox></Col> */}
                                        {totalTitle.map((v, i) => {
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


