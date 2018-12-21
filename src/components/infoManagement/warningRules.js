import { Component } from 'react';
import styles from "./warningRules.less"
import { Button, Select, Table, Modal, message } from 'antd';
import { routerRedux } from 'dva/router';
import { Link } from 'dva/router';
import { timeOut } from '../../utils/timeOut';
import {ENVNet,postOption} from '../../services/netCofig'
//翻页调用
const dataUrl = `${ENVNet}/api/DeviceWaringRule/ruleList`;
// 删除调用
const deleteUrl = `${ENVNet}/api/DeviceWaringRule/delete`
const Option = Select.Option;
//头信息
const title = [
    { index: "deviceTypeName", item: "设备型号" },
    { index: "name", item: "规则名称" },
]
export default class extends Component {
    constructor(props) {
        super(props)
        const { warningRules } = props;
        this.state = {
            //表头
            title,
            itemCount: warningRules.data.data.itemCount,//总数据数
            data: warningRules.data.data.items,//表格数据源
            //表的每一列
            columns: [],
            // 设备类型列表
            deviceTypeList: warningRules.deviceTypeList.data.data,
            // 添加弹窗
            addVisible: false,
            // addVisible:true,
            // 选择的设备ID
            selectDeviceId: '',
            // 删除弹窗
            // deleteModalVisible:false,
            deleteModalVisible: false,
            // 删除Id
            deleteId: '',
            //初始页
            current:1
        };
    }
    componentDidMount() {
        this._getTableDatas(this.state.title, this.state.data);
    }
    //保存当前设备的类型ID
    _saveDeviceTypeId(deviceTypeId){
        // console.log(deviceTypeId)
        localStorage.setItem('selectDeviceTypeId',deviceTypeId)
    }
    // 删除规则
    delete(deleteId) {
        // console.log(ruleId)
        this.setState({
            deleteModalVisible: true,
            deleteId
        })
    }
    //点击确定删除
    _deleteOk() {
        const { deleteId } = this.state
        return fetch(deleteUrl, {
            ...postOption,
            body: JSON.stringify({
                ruleIds: deleteId
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    //判断超时
                    timeOut(v.ret);
                    if (v.ret == 1) {
                        fetch(dataUrl,{
                            ...postOption,
                            body:JSON.stringify({
                                "pageIndex": this.state.current-1,
                                "pageSize": 10
                            })
                        }).then(res=>{
                            Promise.resolve(res.json())
                            .then(v=>{
                                //判断超时
                                timeOut(v.ret);
                                if(v.ret==1){
                                    let data=v.data.items;
                                    let itemCount = v.data.itemCount;
                                    // 给每一条数据添加key
                                    data.map((v, i) => {
                                        v.key = i
                                    })
                                    message.success('删除成功', 2)
                                    this.setState({
                                        data,
                                        itemCount,
                                        deleteModalVisible: false,
                                    })
                                    this._getTableDatas(this.state.title, data);
                                }
                            })
                        }) 
                    }
                })
        })
    }
    //点击取消删除
    _deleteCancel() {
        // console.log('Cancel')
        this.setState({
            deleteModalVisible: false,
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
            fixed: 'right',
            className: `${styles.action}`,
            width: 200,
            render: (record) => {
                // console.log(record)
                return (
                    <span className={styles.option}>
                        <Link to={`/warningRules/rulesDetail:${record.ruleId}`}>
                            <Button
                                className={styles.edit}
                                icon='file-text'
                                onClick={()=>this._saveDeviceTypeId(record.deviceTypeId)}
                            >
                                规则详情
                            </Button>
                        </Link>
                        <Button
                            className={styles.delete}
                            onClick={() => this.delete(record.ruleId)}
                            icon='delete'
                        >
                            删除
                        </Button>
                        {/* <Button
                            className={styles.editPsw}
                            icon='appstore'
                        >
                            批量应用
                        </Button> */}
                    </span>
                )
            }
        })
        let tableDatas = [];
        //表单数据
        data.map((v, i) => {
            // console.log(v)
            tableDatas.push({
                deviceTypeName: v.deviceTypeName,
                name: v.name,
                ruleId: v.ruleId,
                deviceTypeId:v.deviceTypeId,
                key: i,
            });
        })
        this.setState({
            columns,
            tableDatas,
        });
    }
    //选择不同的设备类型 
    selectDeviceType(selectDeviceId) {
        // console.log(selectDeviceId)
        this.setState({
            selectDeviceId
        })
    }
    // 点击添加规则
    addRules() {
        this.setState({
            addVisible: true
        })
    }
    // 下一步
    _addNext() {
        const { dispatch } = this.props
        const { selectDeviceId } = this.state
        if (selectDeviceId == '') {
            alert('请先选择要设置的设备类型')
        } else {
            localStorage.setItem('selectDeviceId', selectDeviceId)
            dispatch(routerRedux.push('/warningRules/addWarningRules'))
        }
        // console.log(selectDeviceId)
    }
    // 添加取消
    _addCancel() {
        this.setState({
            addVisible: false,
            selectDeviceId: ''
        })
    }
    // 翻页功能
    _pageChange(page) {
        // 翻页传递参数
        let postObject = {
            "pageIndex": 0,
            "pageSize": 10
        }
        postObject.pageIndex = page - 1;
        return fetch(dataUrl, {
            ...postOption,
            body: JSON.stringify({
                ...postObject
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    //判断超时
                    timeOut(v.ret);
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
                            data,
                            current:page
                        })
                        this._getTableDatas(this.state.title, data);
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        })
    }
    render() {
        const {columns,tableDatas,current,itemCount,addVisible,deviceTypeList,deleteModalVisible} = this.state;
        const paginationProps = {
            current:current,
            showQuickJumper: true,
            total: itemCount,
            // 传递页码
            onChange: (page) => this._pageChange(page)
        };
        return (
            <div className={styles.deleteGlobal}>
                <div className={styles.header}>
                    <span>|</span>预警规则
                </div>
                <div className={styles.tableData}>
                    <div className={styles.buttonGroup}>
                        <Button
                            icon='plus'
                            className={styles.fnButton}
                            onClick={() => this.addRules()}
                        >
                            添加预警规则
                        </Button>
                    </div>
                </div>
                <Table
                    columns={columns}
                    pagination={paginationProps}
                    dataSource={tableDatas}
                // scroll={{ x: 1300 }}
                />
                {/* 删除弹窗 */}
                <Modal
                    visible={deleteModalVisible}
                    title="删除"
                    cancelText='取消'
                    okText='确定'
                    onOk={() => this._deleteOk()}
                    onCancel={() => this._deleteCancel()}
                    className={styles.deleteModal}
                    centered={true}
                >
                    <span>删除后信息将无法恢复，是否确认删除</span>
                </Modal>
                <Modal
                    className={styles.addModal}
                    visible={addVisible}
                    title="选择设备类型"
                    cancelText='取消'
                    okText='下一步'
                    onOk={() => this._addNext()}
                    onCancel={() => this._addCancel()}
                    centered
                >
                    <div>
                        <span className={styles.title}>设备类型</span>
                        <Select
                            onChange={(value) => this.selectDeviceType(value)}
                            placeholder='请选择设备类型'
                        >
                            {
                                deviceTypeList.map((v, i) => {
                                    // console.log(v)
                                    return (
                                        <Option
                                            value={v.deviceTypeId}
                                            key={v.deviceTypeId}
                                        >
                                            {v.name}
                                        </Option>
                                    )
                                })
                            }
                        </Select>
                    </div>
                </Modal>
            </div>
        )
    }
}

