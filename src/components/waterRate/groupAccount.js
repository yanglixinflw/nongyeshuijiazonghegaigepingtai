import React,{Component} from 'react';
import styles from "./groupAccount.less"
import { Input, Button, Form, Table,Select,Modal,message} from 'antd';
import { Link } from 'dva/router';
import classnames from 'classnames';
import {ENVNet,postOption} from '../../services/netCofig'
//翻页调用
const dataUrl=`${ENVNet}/fee/groupAccount/list`;
//修改小组名称
const editUrl=`${ENVNet}/fee/groupAccount/changeName`;
//清空当前用量
const clearUrl=`${ENVNet}/fee/groupAccount/clearCurrentWaterUse`;
//分配水权
const assignUrl=`${ENVNet}/fee/groupAccount/assignWaterPower`;
//表头
const tableTitle=[
    {index:"deviceId",item:"设备ID"},
    {index:"deviceName",item:"设备名称"},
    {index:"accountName",item:"小组"},
    {index:"memberNames",item:"小组成员"},
    {index:"balance",item:"账户余额"},
    {index:"currentWaterUse",item:"当前用量"},
    {index:"waterPower",item:"剩余水权"},
    {index:"updateTime",item:"更新时间"},
]
const { Option }=Select
export default class extends Component{
    constructor(props) {
        super(props)
        const {groupAccount}=props;
        this.state={
            //表头
            title:tableTitle,
            itemCount:groupAccount.data.data.itemCount,//总数据数
            data:groupAccount.data.data.items,//表格数据源
            //表格的列
            columns: [],
            //搜索框默认值
            searchValue:{},
            //是否显示修改弹窗
            editvisible:false,
            //修改的小组名称
            name:"",
            //修改的小组id
            userId:'',
            //是否显示清除弹窗
            clearVisible:false,
            //是否显示分配水权弹窗
            assignvisible:false
        }
    }
    componentDidMount() {
        this._getTableDatas(this.state.title, this.state.data);
    }
    _getTableDatas(title, data) {
        let columns = [];
        title.map(v => {//把title里面的数据push到column里面
            columns.push({
                title: v.item,
                // 给表头添加字段名 必须一一对应
                dataIndex: v.index,
                align: 'center',
                className: `${styles.tbw}`
            })
        })
        //把数据都push到tableDatas里
        let tableDatas = [];
        data.map((v, i) => {
            tableDatas.push({
                deviceId:v.deviceId,
                deviceName:v.deviceName,
                accountName:v.accountName,
                memberNames:v.memberNames,
                balance:v.balance,
                currentWaterUse:v.currentWaterUse,
                waterPower:v.waterPower,
                updateTime:v.updateTime,
                userId:v.userId,
                key: i,
            });
        })
        //操作列
        columns.push({
            title: '操作',
            key: 'action',
            align: 'center',
            fixed: 'right',
            className: `${styles.action}`,
            width: 430,
            render: (record) => {
                return (
                    <span className={styles.option}>
                        <Link to={`/groupAccount/dealRecord:${record.userId}`}>
                            <Button
                                className={styles.record}
                                icon='file-text'
                            >
                                交易记录
                            </Button>
                        </Link>
                        <Button
                            className={styles.clear}
                            icon='delete'
                            onClick={()=>this.clear(record.userId)}
                        >
                            清空当前用量
                        </Button>
                        <Button
                            className={styles.assignment}
                            icon='share-alt'
                            onClick={()=>this.assignWater(record.userId)}
                        >
                            分配水权
                        </Button>
                        <Button
                            className={styles.edit}
                            icon='edit'
                            onClick={()=>this.edit(record.accountName,record.userId)}
                        >
                            修改
                        </Button>
                        <Link to={`/groupAccount/groupManage:${record.userId}`}>
                            <Button
                                className={styles.management}
                                icon='team'
                            >
                                管理小组成员
                            </Button>
                        </Link>
                    </span>
                )
            }
        })
        this.setState({
            columns,
            tableDatas,
        });
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
            return fetch(dataUrl, {
                ...postOption,
                body: JSON.stringify({
                    "deviceId": values.deviceId,
                    "deviceName": values.deviceName,
                    "groupName": values.groupName,
                    "memberNameOrMobile": values.memberNameOrMobile,
                    "feeStatus": values.feeStatus,
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
                            this._getTableDatas(title,data);
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
    // 重置表单
    form.resetFields();
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
                            searchValue:{}
                        })
                        this._getTableDatas(title, data);
                    }
                })
        })
    }
    //点击修改
    edit(name,userId){
        this.setState({
            editvisible:true,
            name,
            userId:userId
        })
    }
    //点击确定修改
    edithandleOk(){
        const form = this.editForm.props.form;
        form.validateFields((err, values) => {
            // 未定义时给空值
            if (err) {
                return
            }
            fetch(editUrl,{
                ...postOption,
                body:JSON.stringify({
                    "groupUserId":this.state.userId,
                    "name":values.name
                })
            }).then(res=>{
                Promise.resolve(res.json())
                .then(v=>{
                    if(v.ret==1){
                        fetch(dataUrl,{
                            ...postOption,
                            body:JSON.stringify({
                                "pageIndex": 0,
                                "pageSize": 10
                            })
                        }).then(res=>{
                            Promise.resolve(res.json())
                            .then(v=>{
                                if(v.ret==1){
                                    let data=v.data.items
                                    let itemCount=v.data.itemCount
                                    this.setState({
                                        data,
                                        itemCount,
                                        editvisible:false
                                    })
                                    this._getTableDatas(this.state.title,data)
                                    message.success("修改成功",2)
                                }
                            })
                        })
                    }
                })
            })
        })
    }
    //点击取消修改
    edithandleCancel(){
        this.setState({
            editvisible:false
        })
    }
    //点击清空当前用量
    clear(userId){
        this.setState({
            clearVisible:true,
            userId
        })
    }
    //点击确定清空
    clearOk(){
        fetch(clearUrl,{
            ...postOption,
            body:JSON.stringify({
                "groupUserId":this.state.userId,  
            })
        }).then(res=>{
            Promise.resolve(res.json())
            .then(v=>{
                if(v.ret==1){
                    fetch(dataUrl,{
                        ...postOption,
                        body:JSON.stringify({
                            "pageIndex": 0,
                            "pageSize": 10
                        })
                    }).then(res=>{
                        Promise.resolve(res.json())
                        .then(v=>{
                            if(v.ret==1){
                                let data=v.data.items;
                                let itemCount=v.data.itemCount
                                this.setState({
                                    data,
                                    itemCount,
                                    clearVisible:false
                                })
                                this._getTableDatas(this.state.title,data)
                                message.success("已清空",2)
                            }
                        })
                    })
                }
            })
        })
    }
    //点击取消清空
    clearCancel(){
        this.setState({
            clearVisible:false
        })
    }
    //点击分配水权
    assignWater(userId){
        this.setState({
            userId,
            assignvisible:true
        })
    }
    //点击确定分配水权
    assignhandleOk(){
        const form = this.assignWaterForm.props.form;
        form.validateFields((err, values) => {
            // 未定义时给空值
            if (err) {
                return
            }
            fetch(assignUrl,{
                ...postOption,
                body:JSON.stringify({
                    "groupUserId":this.state.userId,
                    "waterPower":values.waterPower 
                })
            }).then(res=>{
                Promise.resolve(res.json())
                .then(v=>{
                    if(v.ret==1){
                        fetch(dataUrl,{
                            ...postOption,
                            body:JSON.stringify({
                                "pageIndex": 0,
                                "pageSize": 10
                            })
                        }).then(res=>{
                            Promise.resolve(res.json())
                            .then(v=>{
                                if(v.ret==1){
                                    let data=v.data.items;
                                    let itemCount=v.data.itemCount
                                    this.setState({
                                        data,
                                        itemCount,
                                        assignvisible:false
                                    })
                                    this._getTableDatas(this.state.title,data)
                                    message.success("已重新分配",2)
                                }
                            })
                        })
                    }
                })
            })
        })
    }
    //点击取消分配水权
    assignhandleCancel(){
        this.setState({
            assignvisible:false
        })
    }
    render(){
        const { columns, tableDatas,editvisible,name,clearVisible,assignvisible } = this.state;
        const paginationProps = {
            showQuickJumper: true,
        };
        return(
            <React.Fragment>
                <div className={styles.groupAccount}>
                    <div className={styles.header}>
                        <span>|</span>小组账户
                    </div>
                    <div className={styles.searchForm}>
                        {/* 表单信息 */}
                        <SearchForm
                            wrappedComponentRef={(searchForm) => this.searchForm = searchForm}
                        />
                        <div className={styles.buttonGroup}>
                            <Button
                                className={styles.fnButton}
                                onClick={() => this._searchTableData()}
                            >
                                <i className={classnames('dyhsicon', 'dyhs-sousuo', `${styles.searchIcon}`)}></i>
                                <div>搜索</div>
                            </Button>
                            <Button
                                className={styles.fnButton}
                                onClick={() => this._resetForm()}
                            >
                                <i className={classnames('dyhsicon', 'dyhs-zhongzhi', `${styles.searchIcon}`)}></i>
                                <div>重置</div>
                            </Button>
                            <Button
                                className={styles.fnButton}
                            >
                                <i className={classnames('dyhsicon', 'dyhs-daochu', `${styles.searchIcon}`)}></i>
                                <div>导出数据</div>
                            </Button>
                        </div> 
                    </div>
                    <Table
                        columns={columns}
                        className={styles.table}
                        pagination={paginationProps}
                        dataSource={tableDatas}
                        scroll={{ x: 1500 }}
                    />
                    {/* 删除弹窗 */}
                    <Modal 
                        title="删除"
                        visible={clearVisible}
                        className={styles.clearModal}
                        onOk={()=>this.clearOk()}
                        onCancel={()=>this.clearCancel()}
                        okText="确认"
                        cancelText="取消"
                        centered//居中显示
                    >
                        <p>清空后，当前用水量将从即刻起重新计算</p>
                    </Modal>
                    {/* 修改弹窗 */}
                    <EditForm
                        wrappedComponentRef={(editForm) => this.editForm = editForm}
                        visible={editvisible}
                        onCancel={() => this.edithandleCancel()}
                        onOk={() => this.edithandleOk()}
                        {...{name}}
                    />
                    {/* 分配水权弹窗 */}
                    <AssignWaterForm
                        wrappedComponentRef={(assignWaterForm) => this.assignWaterForm = assignWaterForm}
                        visible={assignvisible}
                        onCancel={() => this.assignhandleCancel()}
                        onOk={() => this.assignhandleOk()}
                        {...{name}}
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
            const { form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Form 
                    layout='inline'
                    style={{
                        display: 'flex',
                        alignItems:"center",
                        flexWrap:"wrap",
                        marginRight:"10px"
                    }}>
                    <Form.Item>
                        {getFieldDecorator('deviceId', {initialValue: ''})
                            (
                            <Input
                                placeholder='设备ID'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('deviceName', {})
                            (
                            <Input
                                placeholder='设备名称'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('groupName', {})
                            (
                            <Input
                                placeholder='小组名称'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('memberNameOrMobile', {})
                            (
                            <Input
                                placeholder='农户姓名/手机'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('feeStatus', {})
                            (
                            <Select 
                                placeholder="状态"
                            >
                                <Option value="0">所有</Option>
                                <Option value="1">欠费</Option>
                            </Select>
                            )
                        }
                    </Form.Item>
                </Form>
            )

        }
    }
)
//修改弹窗表单
const EditForm = Form.create()(
    class extends React.Component {
        render() {
            const { visible, onCancel, onOk, form, name } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    className={styles.editModal}
                    visible={visible}
                    title="修改小组名称"
                    onCancel={onCancel}
                    onOk={onOk}
                    cancelText='取消'
                    okText='确定'
                    centered
                >
                    <Form>
                        <Form.Item label="小组名称">
                            {getFieldDecorator('name', {initialValue: `${name}`})
                            (
                                <Input
                                    placeholder='请输入要修改的小组名称'
                                    type='text'
                                />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            )
        }
    }
)
//分配水权弹窗表单
const AssignWaterForm = Form.create()(
    class extends React.Component {
        render() {
            const { visible, onCancel, onOk, form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    className={styles.editModal}
                    visible={visible}
                    title="分配水权"
                    onCancel={onCancel}
                    onOk={onOk}
                    cancelText='取消'
                    okText='确定'
                    centered
                >
                    <Form>
                        <Form.Item label="水权(m³)">
                            {getFieldDecorator('waterPower', {initialValue: ''})
                            (
                                <Input
                                    placeholder='请输入要分配的水权'
                                    type='text'
                                />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            )
        }
    }
)