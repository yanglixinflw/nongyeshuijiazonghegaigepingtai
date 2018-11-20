import React, { Component } from 'react';
import styles from './warningRecords.less';
import { Input, Button, Form, Row, Col, Table, Modal, Select, Checkbox } from 'antd';
import { Link } from 'dva/router';
//开发地址
const envNet = 'http://192.168.30.127:88';
//生产环境
// const envNet='';
//翻页调用
const dataUrl = `${envNet}/api/DeviceWaringRule/eventList`;
//设备安装地列表
const installAddrUrl=`${envNet}/api/BaseInfo/installAddrList`;
//关闭预警事件
const closeWarningUrl=`${envNet}/api/DeviceWaringRule/eventClose`;
// post通用设置
let postOption = {
    method: 'POST',
    credentials: "include",
    mode: 'cors',
    headers: new Headers({
        'Content-Type': 'application/json',
    }),
}
//头信息
const tableTitle = [
    { index: "time", item: "预警时间" },
    { index: "waringType", item: "预警类型" },
    { index: "name", item: "预警名称" },
    { index: "eventContent", item: "事件内容" },
    { index: "warningStatus", item: "状态" },
    { index: "dealWithOpinion", item: "处理结果" },
    { index: "dealWithUser", item: "处理人" },
    { index: "dealWithTime", item: "处理时间" },
    { index: "deviceId", item: "设备ID" },
    { index: "buildingName", item: "关联建筑物" },
    { index: "installAddress", item: "设备安装地" }
]
tableTitle.map((v, i) => {
    v.number = i
})
const { Option } = Select
export default class extends Component {
    constructor(props) {
        super(props)
        const { warningRecords } = props;
        this.state = {
            itemCount: warningRecords.data.data.itemCount,//总数据数
            data: warningRecords.data.data.items,//表格数据源
            //表的每一列
            columns: [],
            //筛选后的显示设置表
            title: tableTitle,
            //是否弹出显示设置
            showvisible: false,
            //设备安装地列表
            installAddrList: [],
            //搜索框初始值
            searchValue: {},
            //关闭预警字段
            deviceId: '',
            //是否显示关闭预警显示
            closeShowvisible: false
        };
        console.log(this.state.data)
    }
    componentDidMount() {
        this._getTableDatas(this.state.title, this.state.data);
        fetch(installAddrUrl, {
            method: 'GET',
            mode: 'cors',
            credentials: "include",
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    if (v.ret == 1) {
                        let installAddrList = v.data
                        this.setState({
                            installAddrList
                        })
                    }
                })
        }).catch((err) => {
            console.log(err)
        })
    }
    _getTableDatas(title, data) {
        let columns = [];
        title.map(v => {
            columns.push({
                title: v.item,
                // 给表头添加字段名 必须一一对应
                dataIndex: v.index,
                align: 'center',
                className: `${styles.tbw}`
            })
        })
        //操作列
        columns.push({
            title: '操作',
            key: 'action',
            align: 'center',
            fixed: "right",
            className: `${styles.action}`,
            width: 200,
            render: (record) => {
                return (
                    <span className={styles.option}>
                        <Button
                            className={styles.edit}
                            onClick={() => this.closeWarning(record.deviceId)}
                            icon='stop'
                        >
                            关闭预警
                        </Button>
                        <Link to={`/warning/map:${record.deviceId}`} target='_blank'>
                            <Button
                                className={styles.delete}
                                icon='environment'
                            >
                                定位至事件地点
                        </Button>
                        </Link>
                    </span>
                )
            }
        })
        let tableDatas = [];
        //表单数据
        data.map((v, i) => {
            tableDatas.push({
                time: v.time,
                waringType: v.waringType,
                name: v.name,
                eventContent: v.eventContent,
                deviceId: v.deviceId,
                buildingName: v.buildingName,
                warningStatus: v.warningStatus,
                dealWithOpinion: v.dealWithOpinion,
                dealWithUser: v.dealWithUser,
                dealWithTime: v.dealWithTime,
                installAddress: v.installAddress,
                key: i,
            });
        })
        this.setState({
            columns,
            tableDatas,
        });
    }
    _pageChange(page) {
        const { searchValue } = this.state;
        searchValue.pageIndex = page - 1;
        return fetch(dataUrl, {
            ...postOption,
            body: JSON.stringify({
                ...searchValue
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    if (v.ret == 1) {
                        // console.log(v);
                        // 设置页面显示的元素
                        let data = v.data.items;
                        //添加key
                        data.map((v, i) => {
                            v.key = i
                        })
                        this.setState({
                            itemCount: v.data.itemCount,
                            data
                        })
                        this._getTableDatas(this.state.title, this.state.data);
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        })
    }
    // 搜索功能
    _searchTableData() {
        const { title } = this.state;
        const form = this.searchForm.props.form;
        form.validateFields((err, values) => {
            // 未定义时给空值
            if (err) {
                return
            }
            if (values.waringType == "waringType") {
                values.waringType = ''
            }
            if (values.warningStatus == "state") {
                values.warningStatus = ''
            }
            if (values.deviceId == undefined) {
                values.deviceId = ''
            }
            if (values.installAddr == 'installAddress') {
                values.installAddr = ''
            }
            if (values.building == undefined) {
                values.building = ''
            }
            return fetch(dataUrl, {
                ...postOption,
                body: JSON.stringify({
                    "waringType": values.waringType,
                    "warningStatus": values.warningStatus,
                    "deviceId": values.deviceId,
                    "installAddr": values.installAddr,
                    "building": values.building,
                    "pageIndex": 0,
                    "pageSize": 10
                })
            }).then(res => {
                Promise.resolve(res.json())
                    .then(v => {
                        if (v.ret == 1) {
                            // 设置页面显示的元素
                            let itemCount = v.data.itemCount
                            let data = v.data.items
                            this.setState({
                                itemCount,
                                data
                            })
                            this._getTableDatas(title, data);
                        }
                    })
            }).catch(err => {
                console.log(err)
            })
        })
    }
    //重置
    _resetForm() {
        const { title } = this.state;
        const form = this.searchForm.props.form;
        form.resetFields(); // 重置表单
        return fetch(dataUrl, {
            ...postOption,
            body: JSON.stringify({
                "pageIndex": 0,
                "pageSize": 10
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    if (v.ret == 1) {
                        // console.log(v)
                        let data = v.data.items;
                        let itemCount = v.data.itemCount;
                        // 给每一条数据添加key
                        data.map((v, i) => {
                            v.key = i
                        })
                        this.setState({
                            data,
                            itemCount,
                            searchValue: {}
                        })
                        this._getTableDatas(title, data);
                    }
                })
        })
    }
    //点击关闭预警
    closeWarning(deviceId) {
        this.setState({
            closeShowvisible: true,
            deviceId
        })
    }
    //确定关闭预警
    closeOk(){
        const form = this.searchForm.props.form;
        form.validateFields((err, values) => {
            // 未定义时给空值
            if (err) {
                return
            }
            fetch(closeWarningUrl,{
                ...postOption,
                body:JSON.stringify({
                    "logId": this.state.deviceId,
                    "dealWithOpinion": values.reason,
                    "isCreateRepairOrder": values.print,
                    "repairOrderToUserId": values.people
                })                                                                                                                                                                                                                                                                                                                                                                                                                                                             
            }).then(res=>{
                Promise.resolve(res.json())
                .then(v=>{
                    if(v.ret==1){
                        this.setState({
                            closeShowvisible:false
                        })
                    }
                })
            }).catch((err) => {
                console.log(err)
            })
        })
    }
    //取消关闭预警
    closeCancel() {
        this.setState({
            closeShowvisible: false
        })
    }
    //点击显示设置
    onShow() {
        this.setState({
            showvisible: true
        })
    }
    // 确定显示设置
    showOk() {
        const form = this.showSetForm.props.form;
        form.validateFields((err, values) => {
            // values即为表单数据
            let { dataIndex } = values
            // 过滤后的columns
            let title = []
            // 定义一个title
            let titles = []
            // 比对dataIndex
            dataIndex.map((v, i) => {
                title.push(...tableTitle.filter(item => item === v))
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
            title.sort(compare('number'))
            // 保存标题
            title.map((v, i) => {
                titles.push(v.item)
            })
            this._getTableDatas(title, this.state.data)
            this.setState({
                showvisible: false,
                titles,
                title
            })
        })

    }
    //取消显示设置 
    showCancel() {
        this.setState({
            showvisible: false
        })
    }
    render() {
        const { columns, tableDatas, itemCount, showvisible, installAddrList, closeShowvisible } = this.state;
        const paginationProps = {
            showQuickJumper: true,
            total: itemCount,
            // 传递页码
            onChange: (page) => this._pageChange(page)
        };
        return (
            <React.Fragment>
                <div className={styles.warningRecords}>
                    <div className={styles.header}>
                        <span>|</span>预警事件记录
                    </div>
                    <div className={styles.searchForm}>
                        {/* 表单信息 */}
                        <SearchForm
                            wrappedComponentRef={(searchForm) => this.searchForm = searchForm}
                            {...{ installAddrList }}
                        />
                        <div className={styles.buttonGroup}>
                            <Button
                                icon='search'
                                className={styles.fnButton}
                                onClick={() => this._searchTableData()}
                            >
                                搜索
                            </Button>
                            <Button
                                icon='reload'
                                className={styles.fnButton}
                                onClick={() => this._resetForm()}
                            >
                                重置
                            </Button>
                            <Button
                                icon='eye'
                                className={styles.fnButton}
                                onClick={() => this.onShow()}
                            >
                                显示设置
                            </Button>
                            <Button
                                icon='upload'
                                className={styles.fnButton}
                            >
                                数据导出
                            </Button>
                        </div>
                    </div>
                    {/* 显示设置 */}
                    <ShowSetForm
                        wrappedComponentRef={(showSetForm) => this.showSetForm = showSetForm}
                        visible={showvisible}
                        onCancel={() => this.showCancel()}
                        onOk={() => this.showOk()}
                    />
                    {/* 关闭预警 */}
                    <CloseWarningForm
                        wrappedComponentRef={(closeWarningForm) => this.closeWarningForm = closeWarningForm}
                        visible={closeShowvisible}
                        onCancel={() => this.closeCancel()}
                        onOk={() => this.closeOk()}
                    />
                    <Table
                        columns={columns}
                        className={styles.table}
                        pagination={paginationProps}
                        dataSource={tableDatas}
                        scroll={
                            { x: columns.length < 4 ? false : 2000 }
                        }
                    />
                </div>
            </React.Fragment>
        )
    }
}
//搜索表单
const SearchForm = Form.create()(
    class extends React.Component {
        render() {
            const { form, installAddrList } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Form
                    layout='inline'
                    style={{
                        display: 'flex',
                        alignItems: "center",
                        flexWrap: "wrap",
                        marginRight: '10px'
                    }}>
                    <Form.Item>
                        {getFieldDecorator('waringType', { initialValue: 'waringType' })
                            (
                            <Select>
                                <Option value='waringType'>预警类型</Option>
                                <Option value=''></Option>
                            </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('warningStatus', { initialValue: 'state' })
                            (
                            <Select>
                                <Option value='state'>所有状态</Option>
                                <Option value=''></Option>
                            </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('deviceId', {})
                            (
                            <Input
                                placeholder='设备ID'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('installAddr', { initialValue: 'installAddress' })
                            (
                            <Select>
                                <Option value='installAddress'>设备安装地</Option>
                                {
                                    installAddrList.map((v, i) => {
                                        return (<Option key={i} value={v.id}>{v.addr}</Option>)
                                    })
                                }
                            </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('building', {})
                            (
                            <Input
                                placeholder='关联建筑物'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                </Form>
            )
        }
    }
)
//显示设置弹窗
const ShowSetForm = Form.create()(
    class extends React.Component {
        render() {
            const { visible, form, onOk, onCancel } = this.props
            const { getFieldDecorator } = form;
            const CheckboxGroup = Checkbox.Group;
            return (
                <Modal
                    className={styles.showSetModal}
                    visible={visible}
                    title="显示设置"
                    cancelText='取消'
                    okText='确定'
                    onOk={onOk}
                    onCancel={onCancel}
                    centered={true}
                >
                    <Form>
                        {getFieldDecorator('dataIndex', {
                            initialValue: tableTitle
                        })
                            (
                            <CheckboxGroup>
                                <Row>
                                    {tableTitle.map((v, i) => {
                                        return (
                                            <Col key={i} span={8}>
                                                <Checkbox value={tableTitle[i]}>{v.item}</Checkbox>
                                            </Col>
                                        )
                                    })}
                                </Row>
                            </CheckboxGroup>
                            )
                        }

                    </Form>
                </Modal>
            )
        }
    }
)
//关闭预警弹窗
const CloseWarningForm = Form.create()(
    class extends React.Component {
        render() {
            const { visible, form, onOk, onCancel } = this.props
            const { getFieldDecorator } = form;
            return (
                <Modal
                    className={styles.closeWarningModal}
                    visible={visible}
                    title="关闭预警"
                    cancelText='取消'
                    okText='确定'
                    onOk={onOk}
                    onCancel={onCancel}
                    centered={true}
                >
                    <Form>
                        <Form.Item label='关闭理由'>
                            {getFieldDecorator('reason', {rules: [{ required: true, message: '关闭预警理由必填' }]})
                                (
                                <Input
                                    placeholder='请填写关闭理由'
                                    type='text'
                                />
                                )
                            }
                        </Form.Item >
                        <Form.Item label='处理人'>
                            {getFieldDecorator('people', { initialValue: 'lisi' })
                                (
                                <Select>
                                    <Option value='lisi'>李四</Option>
                                    <Option value='zhangsan'>张三</Option>
                                    {/* {
                                        installAddrList.map((v,i)=>{
                                            return(<Option key={i} value={v.id}>{v.addr}</Option>)
                                        })
                                    } */}
                                </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('print', {
                                valuePropName: 'checked',
                            })(
                                <Checkbox>生成报修订单</Checkbox>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            )
        }
    }
)