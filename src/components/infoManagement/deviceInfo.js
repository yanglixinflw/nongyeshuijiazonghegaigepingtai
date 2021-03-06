import React, { Component } from 'react';
import styles from './deviceInfo.less'
import QRCode from 'qrcode.react'
import classnames from 'classnames';
import {
    Form,
    Button,
    Input,
    Select,
    Table,
    Modal,
    Checkbox,
    Row,
    Col,
    DatePicker,
    message,
    Divider
} from 'antd'
import moment from 'moment'
import {routerRedux} from 'dva/router'
import { timeOut } from '../../utils/timeOut';
import _ from 'lodash';
import {  getDeviceParameters, } from '../../services/api';
const Item = Form.Item
const Option = Select.Option
import { ENVNet, postOption } from '../../services/netCofig'
// 搜索、翻页接口、重置表单
const getDataUrl = `${ENVNet}/api/Device/list`
// 获取公司管护人列表
const getManagerUserUrl = `${ENVNet}/api/BaseInfo/orgUserList`
const addDataUrl = `${ENVNet}/api/device/add`
const deleteUrl = `${ENVNet}/api/device/delete`
// 获取修改信息
const detailsUrl = `${ENVNet}/api/device/details`
const updataUrl = `${ENVNet}/api/device/update`
//关联建筑接口
const buildingUrl = `${ENVNet}/api/Building/list`
// 源columns拥有编号
const sourceColumns = [
    { title: "设备ID", dataIndex: "deviceId" },
    { title: "设备型号", dataIndex: "deviceTypeName" },
    { title: "设备名称", dataIndex: "name" },
    { title: "设备安装地", dataIndex: "installAddr" },
    { title: "关联建筑物", dataIndex: "relatedBuilding" },
    { title: "地理坐标(纬，经)", dataIndex: "IP" },
    { title: "启用日期", dataIndex: "enableTime" },
    { title: "运维公司", dataIndex: "managedCompony" },
    { title: "管护人员", dataIndex: "managerName" },
    { title: "网关地址", dataIndex: "gatewayAddr" },
    { title: "出厂编号", dataIndex: "deviceSerial" },
    { title: "预警规则", dataIndex: "warningRules" },
    { title: "更新时间", dataIndex: "lastRequestTime" }
]
// 按顺序给定序号
sourceColumns.map((v, i) => {
    v.number = i
})
export default class extends Component {
    constructor(props) {
        super(props)
        // console.log(props)
        const { DeviceTypeList,
            InstallList,
            CompanyList,
            RelatedBuilding
        } = this.props.deviceInformation
        // console.log(RelatedBuilding)
        this.state = {
            // 显示设置可见
            showSetVisible: false,
            // showSetVisible: true,
            // 表头
            columns: [],
            // 数据总数
            itemCount: props.deviceInformation.data.data.itemCount,
            // 表格数据源
            data: props.deviceInformation.data.data.items,
            // 表格数据
            tableData: [],
            // 搜索框默认值
            searchValue: {
                "deviceId": "",
                "name": "",
                "deviceTypeId": "",
                "installAddrId": "",
                "warningRules": "",
                "relatedBuildingId": "",
            },
            // 设备安装地列表
            installAddress: InstallList.data.data,
            // 过滤后的表头
            filterColumns: sourceColumns,
            // 设备类型列表
            deviceTypeList: DeviceTypeList.data.data,
            // 添加弹窗设置
            addModalVisible: false,
            // addModalVisible: true,
            // 关联建筑物列表
            relatedBuilding: RelatedBuilding.data.data,
            // 公司列表
            companyList: CompanyList.data.data,
            // 删除弹窗
            deleteModalVisible: false,
            // deleteModalVisible:true,
            // 修改、删除设备ID
            modifyDeviceId: '',
            // 修改数据
            modifyData: {},
            // 二维码弹窗
            qrcodeModalVisible: false,
            // qrcodeModalVisible:true,
            // 修改弹窗
            modifyModalVisible: false,
            // modifyModalVisible: true,
            // 修改弹窗管理人员列表
            modifyAdminList: [],
            // 当前页
            pageNumber: 1
        }
    }
    componentDidMount() {
        // 初始化处理表单数据
        this._getTableData(this.state.data, this.state.filterColumns)
    }
    //保存当前设备的类型ID
    _saveDeviceTypeId(deviceTypeId,deviceId) {
        // console.log(deviceTypeId)
        let parameterList = getDeviceParameters(
            {
                deviceTypeId:deviceTypeId
            })
        Promise.resolve(parameterList).then((v) => {
            // console.log(v)
            //超时判断
            timeOut(v.data.ret)
            if (v.data.ret === 1) {
                if (v.data.data.length == 0) {
                    alert('该设备暂不支持预警规则设置')
                } else {
                    const {dispatch} = this.props;
                    localStorage.setItem('selectDeviceTypeId', deviceTypeId)
                    dispatch(routerRedux.push(`/deviceInformation/warningDetail:${deviceId}`))
                }
            }

        })

    }
    // 获取表单数据
    _getTableData(data, sourceColumns) {
        let columns = []
        // 设置columns
        sourceColumns.map((v, i) => {
            columns.push({
                title: v.title,
                // 表头添加字段
                dataIndex: v.dataIndex,
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
            width: 363,
            className: `${styles.action}`,
            render: (record) => {
                return (
                    <span>
                        <Button
                            className={styles.scan}
                            icon='scan'
                            onClick={() => this.qrcodeHandler(true, record.deviceId)}
                        >
                            生成二维码
                        </Button>
                        <Button
                            className={styles.warn}
                            icon='exception'
                            onClick={() => this._saveDeviceTypeId(record.deviceTypeId,record.deviceId)}
                        >
                            预警机制
                        </Button>
                        <Button
                            className={styles.edit}
                            icon='edit'
                            onClick={() => this._modifyHandler(record.deviceId)}
                        >
                            修改
                        </Button>
                        <Button
                            className={styles.delete}
                            icon='delete'
                            onClick={() => this._deleteHandler(true, record.deviceId)}
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
                managedCompony: v.managedCompony,
                managerName: v.managerName,
                gatewayAddr: v.gatewayAddr,
                deviceSerial: v.deviceSerial,
                relatedBuilding: v.relatedBuilding,
                warningRules: v.warningRules,
                lastRequestTime: v.lastRequestTime,
                deviceTypeId: v.deviceTypeId,
                key: i
            })
        })
        this.setState({
            columns,
            tableData,
        })
        // console.log(columns)

    }
    //点击显示设置
    _showSetHandler() {
        this.setState({
            showSetVisible: true
        })
    }
    // 设置管理员列表
    setAdminList(v) {
        // console.log(v.data)
        this.setState({
            modifyAdminList: v.data
        })
    }
    // 点击删除
    _deleteHandler(show, deviceId) {
        // 点击删除
        if (show) {
            this.setState({
                deleteModalVisible: show,
                modifyDeviceId: deviceId
            })
        } else {
            this.setState({
                deleteModalVisible: show,
            })
        }
    }
    // 确认删除
    _deleteOk() {
        const { modifyDeviceId, searchValue } = this.state
        let deviceIds = modifyDeviceId
        return fetch(deleteUrl, {
            ...postOption,
            body: JSON.stringify({
                deviceIds
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    //判断超时
                    timeOut(v.ret);
                    if (v.ret == 1) {
                        message.success('删除成功', 2)
                        // 重置数据
                        this._resetForm(false, searchValue)
                        this.setState({
                            deleteModalVisible: false,
                        })
                    } else {
                        message.error(v.msg, 3)
                        // // 重置数据
                        // this._resetForm()
                        // this.setState({
                        //     deleteModalVisible: false,
                        // })
                    }
                }).catch((err) => {
                    console.log(err)
                })
        })
    }

    // 翻页
    _pageChange(page) {
        // console.log(page)
        let { searchValue, filterColumns } = this.state
        searchValue.pageIndex = page - 1
        // console.log(searchValue)
        return fetch(getDataUrl, {
            ...postOption,
            body: JSON.stringify({
                ...searchValue
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    //判断超时
                    timeOut(v.ret);
                    if (v.ret == 1) {
                        // console.log(v);
                        // 设置页面显示的元素
                        let items = v.data.items;
                        let itemCount = v.data.itemCount;
                        //添加key
                        items.map((v, i) => {
                            v.key = i
                        })
                        this.setState({
                            itemCount,
                            tableData: items,
                            pageNumber: page
                        })
                        this._getTableData(items, filterColumns);
                    }
                })
        }).catch((err) => {
            console.log(err)
        })
    }
    // 重置搜索表单
    _resetForm(backToZero, searchValue) {
        const { filterColumns, pageNumber } = this.state
        // console.log(searchValue)
        const form = this.searchForm.props.form;
        if (searchValue) {
            this.setState({
                searchValue
            })
        } else {
            let searchValue = {
                "deviceId": "",
                "name": "",
                "deviceTypeId": "",
                "installAddrId": "",
                "warningRules": "",
                "relatedBuildingId": "",
            }
            // 重置表单
            form.resetFields();
            this.setState({
                searchValue
            })
        }
        return fetch(getDataUrl, {
            ...postOption,
            body: JSON.stringify({
                ...searchValue,
                "pageIndex": backToZero ? 0 : pageNumber - 1
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    //判断超时
                    timeOut(v.ret);

                    if (v.ret == 1) {
                        let { items, itemCount } = v.data
                        // 当前页为最后一页且不是第一页
                        if (items.length == 0 && pageNumber != 1) {
                            this.setState({
                                itemCount,
                                data: items,
                                pageNumber: pageNumber - 2
                            })
                            this._pageChange(pageNumber - 2)
                        } else {
                            this.setState({
                                itemCount,
                                data: items,
                                pageNumber: backToZero ? 1 : pageNumber
                            })
                        }
                        // console.log(items)
                        this._getTableData(items, filterColumns)
                    }
                })
        }).catch((err) => {
            console.log(err)
        })
    }
    // 搜索功能
    _searchTableData() {
        const { filterColumns } = this.state
        const form = this.searchForm.props.form;
        form.validateFields((err, values) => {
            // 未定义时给空值
            if (!values.deviceTypeId) {
                values.deviceTypeId = ''
            }
            if (!values.installAddrId) {
                values.installAddrId = ''
            }
            if (!values.relatedBuildingId) {
                values.relatedBuildingId = ''
            }
            values.pageIndex = 0
            values.pageSize = 10
            this.setState({
                searchValue: values
            })
            return fetch(getDataUrl, {
                ...postOption,
                body: JSON.stringify({
                    ...values
                })
            }).then((res) => {
                Promise.resolve(res.json())
                    .then((v) => {
                        // console.log(v)
                        //判断超时
                        timeOut(v.ret);
                        if (v.ret == 1) {
                            let { items, itemCount } = v.data
                            this.setState({
                                itemCount,
                                data: items,
                                // 重置当前页码
                                pageNumber: 0
                            })
                            this._getTableData(items, filterColumns)
                        }
                    })
            }).catch((err) => {
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
            this._getTableData(this.state.data, filterColumns)
            this.setState({
                showSetVisible: false,
                title,
                filterColumns
            })
        })

    }
    // 添加弹窗
    _addHandler() {
        const form = this.addForm.props.form;
        form.resetFields()
        this.setState({
            addModalVisible: true
        })
    }
    // 确认添加
    _addOk() {
        const form = this.addForm.props.form;
        form.validateFields((err, values) => {
            // console.log(values)
            if (err) {
                return
            } else {
                let enableTime = values.enableTime.format('YYYY-MM-DD')
                values.enableTime = enableTime
                fetch(addDataUrl, {
                    ...postOption,
                    body: JSON.stringify({
                        ...values
                    })
                }).then((res) => {
                    Promise.resolve(res.json())
                        .then((v) => {
                            //判断超时
                            timeOut(v.ret);
                            if (v.ret == 1) {
                                message.success('添加成功', 2)
                                this._resetForm(true)
                                this.setState({
                                    addModalVisible: false
                                })
                            }
                        })
                }).catch((err) => {
                    message.error('服务器出错', 2)
                })
            }
        })


    }
    _addCancel() {
        const form = this.addForm.props.form;
        // 重置表单
        form.resetFields();
        this.setState({
            addModalVisible: false
        })
    }
    // 二维码弹窗
    qrcodeHandler(show, deviceId) {
        // console.log(deviceId)
        if (show) {
            this.setState({
                qrcodeModalVisible: true,
                modifyDeviceId: deviceId
            })
        } else {
            this.setState({
                qrcodeModalVisible: false
            })
        }

    }
    // 修改按钮
    _modifyHandler(deviceId) {
        fetch(detailsUrl, {
            ...postOption,
            body: JSON.stringify({
                deviceId
            })
        }).then((res) => {
            // console.log(res)
            Promise.resolve(res.json())
                .then((v) => {
                    //判断超时
                    timeOut(v.ret);
                    if (v.ret == 1) {
                        // 初始化管理人员列表
                        fetch(`${getManagerUserUrl}?orgId=${v.data.managedCompanyId}`, {
                            method: 'GET',
                            mode: 'cors',
                            credentials: "include",
                        }).then((res) => {
                            Promise.resolve(res.json())
                                .then((v) => {
                                    if (v.ret == 1) {
                                        // console.log(v);
                                        this.setState({
                                            modifyAdminList: v.data
                                        })

                                    }
                                })
                        }).catch((err) => {
                            // console.log(err)
                            message.error('服务器出错', 2)
                        })
                        this.setState({
                            modifyModalVisible: true,
                            modifyDeviceId: deviceId,
                            modifyData: v.data,
                        })
                    } else {

                    }
                })
        })
        // 重置关联建筑物列表
        this.handleSearch('')
    }
    // 确认修改
    _modifyOk() {
        const { searchValue } = this.state
        const form = this.modifyForm.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return
            } else {
                // console.log(values)
                let enableTime = values.enableTime.format('YYYY-MM-DD')
                values.enableTime = enableTime
                fetch(updataUrl, {
                    ...postOption,
                    body: JSON.stringify({
                        ...values
                    })
                }).then((res) => {
                    Promise.resolve(res.json())
                        .then((v) => {
                            //判断超时
                            timeOut(v.ret);
                            if (v.ret == 1) {
                                message.success('修改成功', 2)
                                // console.log(searchValue)
                                this._resetForm(false, searchValue)
                                this.setState({
                                    modifyModalVisible: false
                                })
                            }
                        })
                }).catch((err) => {
                    console.log(err)
                })
            }

        })
    }
    // 取消修改
    _modifyCancel() {
        const form = this.modifyForm.props.form;
        // 重置表单
        form.resetFields();
        this.setState({
            modifyModalVisible: false,
            modifyDeviceId: '',
        })
    }
    // 获取设备安装地列表
    handleSearch(value) {
        fetch(buildingUrl, {
            ...postOption,
            body: JSON.stringify({
                "name": value,
            })
        }).then(res => {
            Promise.resolve(res.json())
                .then(v => {
                    //判断超时
                    timeOut(v.ret);
                    if (v.ret == 1) {
                        // 设置页面显示的元素
                        // console.log(v.data)
                        this.setState({
                            relatedBuilding: v.data,
                        })
                    }
                })
        }).catch(err => {
            console.log(err)
        })
    }
    render() {
        const {
            columns,
            showSetVisible,
            tableData,
            itemCount,
            installAddress,
            deviceTypeList,
            addModalVisible,
            relatedBuilding,
            companyList,
            deleteModalVisible,
            qrcodeModalVisible,
            modifyDeviceId,
            modifyData,
            modifyModalVisible,
            modifyAdminList,
            pageNumber
        } = this.state
        const paginationProps = {
            showQuickJumper: true,
            total: itemCount,
            current: pageNumber,
            // 传递页码
            onChange: (page) => this._pageChange(page)
        };
        // console.log(companyList)
        return (
            <div className={styles.deviceInfoTable}>
                <ShowSetForm
                    wrappedComponentRef={(showSetForm) => this.showSetForm = showSetForm}
                    visible={showSetVisible}
                    onCancel={() => this._setShowCancel()}
                    onOk={() => this._setShowOk()}
                />
                <AddForm
                    wrappedComponentRef={(addForm) => this.addForm = addForm}
                    visible={addModalVisible}
                    onCancel={() => this._addCancel()}
                    onOk={() => this._addOk()}
                    installAddress={installAddress}
                    deviceTypeList={deviceTypeList}
                    relatedBuilding={relatedBuilding}
                    companyList={companyList}
                    handleSearch={(v) => this.handleSearch(v)}
                />
                {/* 删除弹窗 */}
                <Modal
                    visible={deleteModalVisible}
                    title="删除"
                    cancelText='取消'
                    okText='确定'
                    onOk={() => this._deleteOk()}
                    onCancel={() => this._deleteHandler(false)}
                    className={styles.deleteModal}
                    centered={true}
                >
                    <span>删除后信息将无法恢复，是否确认删除</span>
                </Modal>
                {/* 二维码弹窗 */}
                <Modal
                    className={styles.qrcodeModal}
                    visible={qrcodeModalVisible}
                    onCancel={() => this.qrcodeHandler(false)}
                    centered={true}
                    destroyOnClose={true}
                    closable={false}
                    footer={null}
                >
                    <QRCode value={`device:${modifyDeviceId}`}> </QRCode>
                    <div>设备ID为:{modifyDeviceId}</div>
                </Modal>
                {/* 修改弹窗 */}
                <ModifyForm
                    wrappedComponentRef={(modifyForm) => this.modifyForm = modifyForm}
                    visible={modifyModalVisible}
                    onCancel={() => this._modifyCancel()}
                    onOk={() => this._modifyOk()}
                    modifyData={modifyData}
                    installAddress={installAddress}
                    deviceTypeList={deviceTypeList}
                    relatedBuilding={relatedBuilding}
                    companyList={companyList}
                    modifyAdminList={modifyAdminList}
                    handleSearch={(v) => this.handleSearch(v)}
                    setAdminList={(v) => this.setAdminList(v)}
                />
                <div className={styles.header}>
                    <span>|</span>设备信息
                </div>
                <div className={styles.searchGroup}>
                    <SearchForm
                        wrappedComponentRef={(searchForm) => this.searchForm = searchForm}
                        installAddress={installAddress}
                        deviceTypeList={deviceTypeList}
                        handleSearch={(v) => this.handleSearch(v)}
                        relatedBuilding={relatedBuilding}
                    />
                    <div className={styles.buttonGroup}>
                        <Button
                            className={styles.searchButton}
                            // icon="search"
                            onClick={() => this._searchTableData()}
                        >
                            <i className={classnames('dyhsicon', 'dyhs-sousuo', `${styles.searchIcon}`)}></i>
                            搜索
                        </Button>
                        <Button
                            // icon='reload'
                            className={styles.searchButton}
                            onClick={() => this._resetForm(true)}
                        >
                            <i className={classnames('dyhsicon', 'dyhs-zhongzhi', `${styles.resetIcon}`)}></i>
                            重置</Button>
                        <Button
                            icon='plus'
                            className={styles.searchButton}
                            onClick={() => this._addHandler()}
                        >
                            添加
                        </Button>
                        <Button
                            // icon='eye'
                            className={styles.showSet}
                            onClick={() => this._showSetHandler()}
                        >
                            <i className={classnames('dyhsicon', 'dyhs-xianshi', `${styles.showIcon}`)}></i>
                            显示设置
                        </Button>
                        {/* <Button
                            // icon='upload'
                            className={styles.showSet}
                            onClick={() => this._uploadHandler()}
                        >
                            <i className={classnames('dyhsicon', 'dyhs-daochu', `${styles.exportIcon}`)}></i>
                            导出数据
                        </Button> */}
                    </div>
                </div>
                <Table

                    columns={columns}
                    dataSource={tableData}
                    pagination={paginationProps}
                    scroll={
                        // { x: columns.length > 10 ?2000: false }
                        { x: columns.length < 4 ? false : true }
                        // { x: 2000 }
                    }
                />
            </div>
        )
    }
}

// 搜索表单
const SearchForm = Form.create()(
    class extends Component {
        render() {
            const { form,
                installAddress,
                deviceTypeList,
                relatedBuilding,
                handleSearch } = this.props;
            const { getFieldDecorator } = form;
            // console.log(relatedBuilding)
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
                                    {
                                        deviceTypeList.length === 0 ? null
                                            :
                                            deviceTypeList.map((v, i) => {
                                                return (
                                                    <Option
                                                        value={v.deviceTypeId}
                                                        key={v.deviceTypeId}>
                                                        {v.name}
                                                    </Option>
                                                )
                                            })
                                    }
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
                                    {
                                        installAddress.length === 0 ? null
                                            :
                                            installAddress.map((v, i) => {
                                                return (
                                                    <Option
                                                        value={v.id}
                                                        key={v.id}>
                                                        {v.addr}
                                                    </Option>
                                                )

                                            })
                                    }
                                </Select>
                            )
                        }
                    </Item>
                    <Item>
                        {getFieldDecorator('relatedBuildingId')
                            (
                                <Select
                                    placeholder='关联建筑物'
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    showSearch
                                    filterOption={false}
                                    onSearch={_.debounce((value) => handleSearch(value), 300)}
                                    notFoundContent={null}
                                >
                                    <Option value=''>全部</Option>
                                    {
                                        relatedBuilding.length === 0 ? null
                                            :
                                            relatedBuilding.map((v, i) => {
                                                // console.log(v)
                                                return (
                                                    <Option
                                                        value={v.buildingId}
                                                        key={v.buildingId}>
                                                        {v.name}
                                                    </Option>
                                                )

                                            })
                                    }
                                </Select>
                            )
                        }
                    </Item>
                    <Item>
                        {getFieldDecorator('warningRules', {
                        })
                            (
                                <Select
                                    placeholder='预警规则'
                                >
                                    <Option value=''>全部</Option>
                                    <Option value={true}>有</Option>
                                    <Option value={false}>无</Option>
                                </Select>
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
                            initialValue: sourceColumns
                        })
                            (
                                <CheckboxGroup>
                                    <Row>
                                        {sourceColumns.map((v, i) => {
                                            return (
                                                <Col key={i} span={8}>
                                                    <Checkbox value={sourceColumns[i]}>{v.title}</Checkbox>
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
// 添加表单
const AddForm = Form.create()(
    class extends Component {
        state = {
            // 是否选择公司
            selectCompany: false,
            // 公司管理员列表
            adminList: [],
            // 关联建筑物列表
            relatedBuilding: []
        }

        showAdmin(id) {
            if (id != '') {
                fetch(`${getManagerUserUrl}?orgId=${id}`, {
                    method: 'GET',
                    mode: 'cors',
                    credentials: "include",
                }).then((res) => {
                    Promise.resolve(res.json())
                        .then((v) => {
                            if (v.ret == 1) {
                                //判断超时
                                timeOut(v.ret);
                                // console.log(v);
                                this.setState({
                                    selectCompany: true,
                                    adminList: v.data
                                })
                            }
                        })
                }).catch((err) => {
                    console.log(err)
                })
            } else {
                this.setState({
                    selectCompany: false,
                })
            }
        }
        // 重置管护人员
        resetManager() {
            this.props.form.setFieldsValue({
                managerUserId: "",
            });
        }
        render() {
            const {
                visible,
                form,
                onOk,
                onCancel,
                deviceTypeList,
                installAddress,
                relatedBuilding,
                companyList,
                handleSearch
            } = this.props
            const { getFieldDecorator } = form;
            const { selectCompany, adminList } = this.state
            let today = new Date()
            let defaultEnd = moment(today).format('YYYY-MM-DD')
            return (
                <Modal
                    visible={visible}
                    title="添加设备"
                    cancelText='取消'
                    okText='确定'
                    onOk={onOk}
                    onCancel={onCancel}
                    className={styles.addModal}
                    centered={true}
                >
                    <Form
                        className={styles.FlexForm}
                    >
                        <Item label="设备型号">
                            {getFieldDecorator('deviceTypeId',
                                {
                                    rules: [{ required: true, message: '设备型号不能为空' }]
                                }
                            )
                                (
                                    <Select
                                        className={styles.formInput}
                                        placeholder='设备类型'
                                    >
                                        {
                                            deviceTypeList.map((v, i) => {
                                                return (
                                                    <Option
                                                        value={v.deviceTypeId}
                                                        key={v.deviceTypeId}>
                                                        {v.name}
                                                    </Option>
                                                )
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                        <Item label="设备名称">
                            {getFieldDecorator('name',
                                {
                                    rules: [{ required: true, message: '设备名称不能为空' },
                                    { max: 30, message: '不超过30个字符' }]
                                }
                            )
                                (
                                    <Input
                                        className={styles.formInput}
                                        placeholder='请输入设备名称'
                                    />
                                )
                            }
                        </Item>
                        <Item label="设备安装地">
                            {getFieldDecorator('installAddrId',
                                {
                                    rules: [{ required: true, message: '设备安装地不能为空' }]
                                }
                            )
                                (
                                    <Select
                                        className={styles.formInput}
                                        placeholder='设备安装地'
                                    >
                                        {
                                            installAddress.map((v, i) => {
                                                return (
                                                    <Option
                                                        value={v.id}
                                                        key={v.id}>
                                                        {v.addr}
                                                    </Option>
                                                )
                                            })
                                        }

                                    </Select>
                                )
                            }
                        </Item>
                        <Item label="启用日期">
                            {getFieldDecorator('enableTime',
                                {
                                    // rules: [{ required: true }],
                                    initialValue: moment(defaultEnd)
                                }
                            )
                                (
                                    <DatePicker
                                        className={styles.formInput}
                                        allowClear={false}
                                    />
                                )
                            }
                        </Item>
                        <Item label="关联建筑物">
                            {getFieldDecorator('relatedBuildingId', {
                                // rules: [{ required: true, message: '设备安装地不能为空' }]
                            })
                                (
                                    <Select
                                        placeholder='关联建筑物'
                                        className={styles.formInput}
                                        defaultActiveFirstOption={false}
                                        showArrow={false}
                                        showSearch
                                        filterOption={false}
                                        onSearch={_.debounce((value) => handleSearch(value), 300)}
                                        notFoundContent={null}
                                    >
                                        {
                                            relatedBuilding.length === 0 ? null
                                                :
                                                relatedBuilding.map((v, i) => {
                                                    // console.log(v)
                                                    return (
                                                        <Option
                                                            value={v.buildingId}
                                                            key={v.buildingId}>
                                                            {v.name}
                                                        </Option>
                                                    )

                                                })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                        <Item label='地理经度'>
                            {getFieldDecorator('longitude',
                                {
                                    rules: [{ pattern:"^\\d+\\.?\\d{7,}$", message: '地理经度精确到小数点后7位' }],
                                }
                            )
                                (
                                    <Input
                                        className={styles.formInput}
                                        placeholder='请输入地理经度'
                                    />
                                )
                            }
                        </Item>
                        <Item label='地理纬度'>
                            {getFieldDecorator('latitude',
                                {
                                    rules: [{ pattern:"^\\d+\\.?\\d{7,}$", message: '地理纬度精确到小数点后7位' }],
                                }
                            )
                                (
                                    <Input
                                        className={styles.formInput}
                                        placeholder='请输入地理纬度'
                                    />
                                )
                            }
                        </Item>
                        <Divider></Divider>
                        <Item label="运维公司">
                            {getFieldDecorator('managedCompanyId', {
                                // rules: [{ required: true, message: '运维公司不能为空' }]
                            })
                                (
                                    <Select
                                        placeholder='运维公司'
                                        className={styles.formInput}
                                        onChange={id => this.showAdmin(id)}
                                        onSelect={() => this.resetManager()}
                                    >
                                        {
                                            companyList.map((v, i) => {
                                                return (
                                                    <Option
                                                        value={v.id}
                                                        key={v.id}>
                                                        {v.name}
                                                    </Option>
                                                )

                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                        {
                            selectCompany ?
                                <Item label='管护人员'>
                                    {getFieldDecorator('managerUserId', {
                                        // rules: [{ required: true, message: '管护人员不能为空' }]
                                    })
                                        (
                                            <Select
                                                placeholder='管护人员'
                                                className={styles.formInput}

                                            >
                                                {
                                                    adminList.map((v, i) => {
                                                        return (
                                                            <Option
                                                                value={v.id}
                                                                key={v.id}>
                                                                {v.name}
                                                            </Option>
                                                        )

                                                    })
                                                }
                                            </Select>
                                        )
                                    }
                                </Item>
                                : null
                        }
                        <Divider></Divider>
                        <Item label='网关ID'>
                            {getFieldDecorator('gatewayAddr',
                                {
                                    // rules: [{ required: true, message: '网关ID不能为空' }]
                                }
                            )
                                (
                                    <Input
                                        className={styles.formInput}
                                        placeholder='请输入网关ID'
                                    />
                                )
                            }
                        </Item>
                        <Item label='出厂编号'>
                            {getFieldDecorator('deviceSerial',
                                {
                                    // rules: [{ required: true, message: '出厂编号不能为空' }]
                                }
                            )
                                (
                                    <Input
                                        className={styles.formInput}
                                        placeholder='请输入出厂编号'
                                    />
                                )
                            }
                        </Item>
                    </Form>
                </Modal>
            )
        }
    }
)
// 修改弹窗
const ModifyForm = Form.create()(
    class extends Component {
        showAdmin(id, callBack) {
            if (id != '') {
                fetch(`${getManagerUserUrl}?orgId=${id}`, {
                    method: 'GET',
                    mode: 'cors',
                    credentials: "include",
                }).then((res) => {
                    Promise.resolve(res.json())
                        .then((v) => {
                            //判断超时
                            timeOut(v.ret);
                            if (v.ret == 1) {
                                // console.log(v);
                                callBack(v)
                            }
                        })
                }).catch((err) => {
                    console.log(err)
                })
            }
        }
        // 获取 管护人员列表
        getManagerPersons() {
            const form = this.props.form
            const { setAdminList } = this.props
            form.validateFields((err, values) => {
                if (err) {
                    return
                } else {
                    this.showAdmin(values.managedCompanyId, (v) => {
                        // console.log(this.props)
                        setAdminList(v)
                    })
                    // console.log(values)
                }
                // console.log(valuse)
            })
            // console.log(1)
        }
        // 重置管护人员
        resetManager() {
            this.props.form.setFieldsValue({
                managerUserId: "",
            });
        }
        render() {
            const {
                visible,
                onOk,
                onCancel,
                modifyData,
                deviceTypeList,
                installAddress,
                companyList,
                modifyAdminList,
                relatedBuilding,
                handleSearch,
                form
            } = this.props
            const { getFieldDecorator } = form;
            // console.log(this.props.modifyAdminList)
            // console.log(relatedBuilding)
            // console.log(installAddress)
            // console.log(modifyData.enableTime)
            return (
                <Modal
                    visible={visible}
                    title="修改设备"
                    cancelText='取消'
                    okText='确定'
                    onOk={onOk}
                    onCancel={onCancel}
                    className={styles.addModal}
                    centered={true}
                >
                    <Form
                        className={styles.FlexForm}
                    >
                        <Item label="设备ID">
                            {getFieldDecorator('deviceId',
                                {
                                    // rules: [{ required: true }],
                                    initialValue: modifyData.deviceId
                                }
                            )
                                (
                                    <Input
                                        className={styles.formInput}
                                        // placeholder={modifyData.deviceId}
                                        disabled
                                    >
                                    </Input>
                                )
                            }
                        </Item>
                        <Item label="设备型号">
                            {getFieldDecorator('deviceTypeId',
                                {
                                    // rules: [{ required: true, message: '设备型号不能为空' }],
                                    initialValue: modifyData.deviceTypeId
                                }
                            )
                                (
                                    <Select
                                        className={styles.formInput}
                                        placeholder='设备类型'
                                    >
                                        {
                                            deviceTypeList.map((v, i) => {
                                                return (
                                                    <Option
                                                        value={v.deviceTypeId}
                                                        key={v.deviceTypeId}>
                                                        {v.name}
                                                    </Option>
                                                )
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                        <Item label="设备名称">
                            {getFieldDecorator('name',
                                {
                                    rules: [{ required: true, message: '设备名称不能为空' },
                                    { max: 30, message: '不超过30个字符' }],
                                    initialValue: modifyData.name
                                }
                            )
                                (
                                    <Input
                                        className={styles.formInput}
                                        placeholder='请输入设备名称'
                                    />
                                )
                            }
                        </Item>
                        <Item label="设备安装地">
                            {getFieldDecorator('installAddrId',
                                {
                                    // rules: [{ required: true, message: '设备安装地不能为空' }],
                                    initialValue: modifyData.installAddrId
                                }
                            )
                                (
                                    <Select
                                        className={styles.formInput}
                                        placeholder='设备安装地'
                                    >
                                        {
                                            installAddress.map((v, i) => {
                                                return (
                                                    <Option
                                                        value={v.id}
                                                        key={v.id}>
                                                        {v.addr}
                                                    </Option>
                                                )
                                            })
                                        }

                                    </Select>
                                )
                            }
                        </Item>
                        <Item label="启用日期">
                            {getFieldDecorator('enableTime',
                                {
                                    // rules: [{ required: true }],
                                    initialValue:
                                        modifyData.enableTime == null ?
                                            ""
                                            : moment(modifyData.enableTime)
                                }
                            )
                                (
                                    <DatePicker
                                        className={styles.formInput}
                                        allowClear={false}
                                    />
                                )
                            }
                        </Item>
                        <Item label="关联建筑物">
                            {getFieldDecorator('relatedBuildingId', {
                                // rules: [{ required: true, message: '设备安装地不能为空' }],
                                initialValue: modifyData.relatedBuildingId
                            })
                                (
                                    <Select
                                        placeholder='关联建筑物'
                                        className={styles.formInput}
                                        defaultActiveFirstOption={false}
                                        showArrow={false}
                                        showSearch
                                        filterOption={false}
                                        onSearch={_.debounce((value) => handleSearch(value), 300)}
                                        notFoundContent={null}
                                    >
                                        {
                                            relatedBuilding.length === 0 ? null
                                                :
                                                relatedBuilding.map((v, i) => {
                                                    // console.log(v)
                                                    return (
                                                        <Option
                                                            value={v.buildingId}
                                                            key={v.buildingId}>
                                                            {v.name}
                                                        </Option>
                                                    )

                                                })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                        <Item label='地理经度'>
                            {getFieldDecorator('longitude',
                                {
                                    rules: [{ pattern:"^\\d+\\.?\\d{7,}$", message: '地理经度精确到小数点后7位' }],
                                    initialValue: `${modifyData.longitude}`
                                }
                            )
                                (
                                    <Input
                                        className={styles.formInput}
                                        placeholder='请输入地理经度'
                                    />
                                )
                            }
                        </Item>
                        <Item label='地理纬度'>
                            {getFieldDecorator('latitude',
                                {
                                    rules: [{ pattern:"^\\d+\\.?\\d{7,}$", message: '地理纬度精确到小数点后7位' }],
                                    initialValue: `${modifyData.latitude}`
                                }
                            )
                                (
                                <Input
                                    className={styles.formInput}
                                    placeholder='请输入地理纬度'
                                    // onChange={()=>{
                                    //     const form = this.props.form
                                    //     form.validateFields((err, values) => {
                                    //         console.log(values)
                                    //     })
                                    // }}
                                />
                                )
                            }
                        </Item>
                        {/* 分割线 */}
                        <Divider></Divider>
                        <Item label="运维公司">
                            {getFieldDecorator('managedCompanyId', {
                                // rules: [{ required: true, message: '运维公司不能为空' }],
                                initialValue: modifyData.managedCompanyId
                                // initialValue: modifyData.managedCompanyName
                            })
                                (
                                    <Select
                                        placeholder='运维公司'
                                        className={styles.formInput}
                                        // 选择运维公司时重置管护人员
                                        onSelect={() => this.resetManager()}
                                    >
                                        {
                                            companyList.map((v, i) => {
                                                return (
                                                    <Option
                                                        value={v.id}
                                                        key={v.id}>
                                                        {v.name}
                                                    </Option>
                                                )

                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>

                        <Item label='管护人员'>
                            {getFieldDecorator('managerUserId', {
                                // rules: [{ required: true, message: '管护人员不能为空' }],
                                initialValue: modifyData.managerUserId,
                                // initialValue: modifyData.managerUserName,
                            })
                                (
                                    <Select
                                        placeholder='管护人员'
                                        className={styles.formInput}
                                        onMouseEnter={() => this.getManagerPersons()}
                                    >
                                        {
                                            modifyAdminList.map((v, i) => {
                                                return (
                                                    <Option
                                                        value={v.id}
                                                        key={v.id}>
                                                        {v.name}
                                                    </Option>
                                                )

                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                        <Divider></Divider>
                        <Item label='网关ID'>
                            {getFieldDecorator('gatewayAddr',
                                {
                                    // rules: [{ required: true, message: '网关ID不能为空' }],
                                    initialValue: modifyData.gatewayAddr
                                }
                            )
                                (
                                    <Input
                                        className={styles.formInput}
                                        placeholder='请输入网关ID'
                                    />
                                )
                            }
                        </Item>
                        <Item label='出厂编号'>
                            {getFieldDecorator('deviceSerial',
                                {
                                    // rules: [{ required: true, message: '出厂编号不能为空' }],
                                    initialValue: modifyData.deviceSerial
                                }
                            )
                                (
                                    <Input
                                        className={styles.formInput}
                                        placeholder='请输入出厂编号'
                                    />
                                )
                            }
                        </Item>
                    </Form>
                </Modal>
            )
        }
    }
)