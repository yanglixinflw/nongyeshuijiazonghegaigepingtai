import React,{Component} from 'react';
import styles from "./valveControl.less"
import { Input,Button, Form,Table,Select,Modal,Radio,message} from 'antd';
import { Link } from 'dva/router';
import {ENVNet} from '../../services/netCofig'
//设备安装地列表
const installAddrUrl=`${ENVNet}/api/BaseInfo/installAddrList`
//翻页调用
const dataUrl=`${ENVNet}/api/device/control/list`;
//设备类型列表
const deviceTypeUrl=`${ENVNet}/api/device/control/deviceTypeList`
//获取设备型号可执行的指令列表
const instructUrl=`${ENVNet}/api/device/control/cmdList`
//向设备发送指令
const sendCmdUrl=`${ENVNet}/api/device/control/sendCmd`
//关联建筑接口
const buildingUrl=`${ENVNet}/api/Building/list`
// post通用设置
let postOption = {
    method: 'POST',
    credentials: "include",
    mode: 'cors',
    headers: new Headers({
        'Content-Type': 'application/json',
    }),
}
//表头
const tableTitle=[
    {index:"deviceTypeName",item:"设备型号"},
    {index:"deviceId",item:"设备ID"},
    {index:"name",item:"设备名称"},
    {index:"installAddr",item:"设备安装地"},
    {index:"ownerBuilding",item:"关联建筑物"},
    {index:"networkStatusText",item:"网络"},
    {index:"electricQuantity",item:"电量"},
    {index:"statusDisplay",item:"状态"},
    {index:"operateStatusText" ,item:"操作状态"},
    {index:"updateTime",item:"更新时间"},
]
const { Option } = Select;
const RadioGroup = Radio.Group;
export default class extends Component{
    constructor(props) {
        super(props)
        const {valveControl}=props;
        this.state={
            title:tableTitle,
            itemCount:valveControl.data.data.itemCount,//总数据数
            data:valveControl.data.data.items,//表格数据源
            columns: [],
            rowSelection:{},
            //设备安装地列表
            installAddrList:[],
            //设备类型列表
            deviceTypeList:[],
            //设备类型Id
            deviceTypeId:1,
            //开关阀携带信息
            deviceIdList:[],
            //设备ID
            deviceIds:[],
            //开关阀显示
            switchvisible:false,
            //操作指令数据
            cmd:[],
            //默认搜索框
            searchValue:{},
            //默认选中行
            selectedRowKeys: [],
        }
    }
    componentDidMount() {
        this._getTableDatas(this.state.title, this.state.data);
        //获取设备安装地数据
        fetch(installAddrUrl, {
            method:'GET',
            mode:'cors',
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
        //获取数据类型数据
        fetch(deviceTypeUrl,{
            ...postOption,
            body: JSON.stringify({
                "countDevice":false
            })
        }).then(res=>{
            Promise.resolve(res.json())
                .then(v=>{
                    if(v.ret==1){
                        let deviceTypeList=v.data
                        this.setState({
                            deviceTypeList
                        })
                    }
                })
        })
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
                deviceTypeName:v.deviceTypeName,
                deviceId:v.deviceId,
                name:v.name,
                installAddr:v.installAddr,
                ownerBuilding:v.ownerBuilding,
                networkStatusText:v.networkStatusText,
                electricQuantity:v.electricQuantity,
                statusDisplay:v.statusDisplay,
                operateStatusText:v.operateStatusText,
                updateTime:v.updateTime,
                key: i,
            });
        })
          //操作列
        columns.push({
            title: '操作',
            key: 'action',
            align: 'center',
            // fixed: 'right',
            className: `${styles.action}`,
            width: 100,
            render: (record) => {
                return (
                    <span className={styles.option}>
                        <Link to={`/valveControl/operatingRecord:${record.deviceId}`}>
                            <Button
                                className={styles.set}
                                icon='file-text'
                            >
                                操作记录
                            </Button>
                        </Link>
                    </span>
                )
            }
        })
        this.setState({
            columns,
            tableDatas,
            // rowSelection
        });
    }
    onSelectChange =(selectedRowKeys,selectedRows)=>{
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        var deviceIds=[];
        selectedRows.map((v,i)=>{
            deviceIds.push(v.deviceId)
        })
        this.setState({ selectedRowKeys,deviceIds });
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
            if(values.deviceTypeId==undefined){
                values.deviceTypeId=1
            }
            return fetch(dataUrl, {
                ...postOption,
                body: JSON.stringify({
                    "deviceTypeId": values.deviceTypeId,
                    "name": values.name,
                    "deviceId": values.deviceId,
                    "installAddrId": values.installAddrId,
                    "relatedBuilding": values.relatedBuilding,
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
                            if(data.length!=0){
                                var deviceTypeId=''
                                if(data[0].deviceTypeName=='井电双控'){
                                    deviceTypeId=2
                                }else if(data[0].deviceTypeName=='智能球阀'){
                                    deviceTypeId=1
                                }
                            }
                            this.setState({
                                itemCount,
                                data,
                                deviceTypeId
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
        form.resetFields(); // 重置表单
        fetch(dataUrl, {
            ...postOption,
            body: JSON.stringify({
                "deviceTypeId": 1,
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
                            searchValue:{},
                        })
                        this._getTableDatas(title, data);
                    }
                })
        })
        //将多选框选定状态重置
        this.setState({
            selectedRowKeys:[]
        })
    }
    //换页
    _pageChange(page){
        const { title,searchValue } = this.state;
        searchValue.pageIndex = page - 1;
        searchValue.deviceTypeId=this.state.deviceTypeId;
        searchValue.pageSize=10
        return fetch(dataUrl, {
            ...postOption,
            body: JSON.stringify({
                ...searchValue
            })
        }).then(res=>{
            Promise.resolve(res.json())
            .then(v=>{
                if(v.ret==1){
                    // 设置页面显示的元素
                    let data = v.data.items;
                    //添加key
                    data.map((v, i) => {
                        v.key = i+(page-1)*searchValue.pageSize
                    })
                    this.setState({
                        itemCount:v.data.itemCount,
                        tableDatas:data
                    })
                    this._getTableDatas(title,data);
                }
            })
            .catch(err=>{
                console.log(err)
            })
        })
    }
    //开关阀按钮点击
    valveSwitch(){ 
        //获取设备型号可执行的指令
        if(this.state.selectedRowKeys.length==0){
            alert("请先选择设备")
        }else{
            fetch(instructUrl,{
                ...postOption,
                body: JSON.stringify({
                    "deviceTypeId":this.state.deviceTypeId
                })
            }).then(res=>{
                Promise.resolve(res.json())
                    .then(v=>{
                        if(v.ret==1){
                            let cmd=v.data
                            // console.log(cmd)
                            this.setState({
                                cmd,
                                switchvisible: true,
                            })
                        }
                    })
            })
        }
    }
    //点击开关阀确定
    switchHandleOk(){
        const form = this.switchForm.props.form;
        form.validateFields((err, values) => {
            // console.log(values)
            // console.log(this.state.deviceIds)
            // 未定义时给空值
            if (err) {
                return
            }
            fetch(sendCmdUrl,{
                ...postOption,
                body: JSON.stringify({
                    "deviceIds":this.state.deviceIds,
                    "strCmd":values.switch
                })
            }).then(res=>{
                Promise.resolve(res.json())
                    .then(v=>{
                        if(v.ret==1){
                            this.setState({
                                switchvisible: false,
                                selectedRowKeys:[]
                            });
                            message.success("操作成功",2)
                        }
                    })
            })
        })
    }
    //点击开关阀取消
    switchHandleCancel(){
        this.setState({
            switchvisible: false,
        });
    }
    render(){
        const { columns,itemCount, tableDatas, installAddrList,deviceTypeList,switchvisible,cmd,selectedRowKeys} = this.state;
        const paginationProps = {
            showQuickJumper: true,
            total: itemCount,
            // 传递页码
            onChange: (page) => this._pageChange(page)
        };
        const rowSelection = {
            selectedRowKeys,
            onChange:this.onSelectChange,
          };
        return(
            <React.Fragment>
                <div className={styles.valveControl}>
                    <div className={styles.header}>
                        <span>|</span>阀门控制
                    </div>
                    <div className={styles.searchForm}>
                        {/* 表单信息 */}
                        <SearchForm
                            wrappedComponentRef={(searchForm) => this.searchForm = searchForm}
                            {...{installAddrList,deviceTypeList}}
                        />
                        <div className={styles.buttonGroup}>
                            <Button
                                className={styles.fnButton}
                                icon="search"
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
                                icon='poweroff'
                                className={styles.fnButton}
                                onClick={()=>this.valveSwitch()}
                            >
                                阀门开关
                            </Button>
                            <Link to={`/valveControl/map`} target='_blank'>
                                <Button
                                    icon='environment'
                                    className={styles.fnButton}
                                >
                                    在地图操作
                                </Button>
                            </Link>
                        </div> 
                    </div>
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        className={styles.table}
                        pagination={paginationProps}
                        dataSource={tableDatas}
                        // scroll={{ x: 1300 }}
                    />
                     {/* 开关阀弹窗 */}
                     <SwitchForm
                        wrappedComponentRef={(switchForm) => this.switchForm = switchForm}
                        visible={switchvisible}
                        onCancel={() => this.switchHandleCancel()}
                        onOk={() => this.switchHandleOk()}
                        {...{cmd}}
                    />
                </div>
            </React.Fragment>
        )
    }
}
//搜索表单
const SearchForm = Form.create()(
    class extends React.Component {
        state={
            //关联建筑物列表
            buildingList:[],
        }
        //下拉搜索框搜索功能
        handleSearch = (value) => {
            // console.log(value)
            fetch(buildingUrl, {
                ...postOption,
                body: JSON.stringify({
                    "name": value,
                    "countDevice": true
                })
            }).then(res => {
                Promise.resolve(res.json())
                    .then(v => {
                        if (v.ret == 1) {
                            // 设置页面显示的元素
                            // console.log(v.data)
                            let buildingList = v.data
                            this.setState({
                                buildingList,
                                value
                            })
                        }
                    })
            }).catch(err => {
                console.log(err)
            })
        }
        render() {
            const { form,installAddrList,deviceTypeList} = this.props;
            const { getFieldDecorator } = form;
            const {buildingList}=this.state
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
                        {getFieldDecorator('deviceTypeId', {})
                            (
                            <Select
                                placeholder="智能球阀"
                            >
                                {
                                    deviceTypeList.map((v,i)=>{
                                        return(<Option key={i} value={v.deviceTypeId}>{v.name}</Option>)
                                    })
                                }  
                            </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('id', {})
                            (
                            <Input
                                placeholder='设备ID'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('name', {})
                            (
                            <Input
                                placeholder='设备名称'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('installAddrId', {})
                            (
                            <Select
                                placeholder='设备安装地'
                            >
                                {
                                    installAddrList.map((v,i)=>{
                                        return(<Option key={i} value={v.id}>{v.addr}</Option>)
                                    })
                                }
                            </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('relatedBuildingId', {})
                            (
                            <Select
                                showSearch
                                placeholder='关联建筑物'
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                onSearch={this.handleSearch}
                                notFoundContent={null}
                            >
                                {
                                    buildingList.map((v,i)=>{
                                        return(
                                            <Option key={i} value={v.buildingId}>{v.name}</Option>
                                        )
                                    })
                                }
                            </Select>
                            )
                        }
                    </Form.Item>
                </Form>
            )

        }
    }
)
//开关阀控制弹窗
const SwitchForm = Form.create()(
    class extends React.Component {
        render() {
            const { form,visible,onCancel,onOk,cmd } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    centered={true}
                    className={styles.switchModal}
                    visible={visible}
                    title="阀门开关"
                    onCancel={onCancel}
                    onOk={onOk}
                    cancelText='取消'
                    okText='确定'
                >
                    <Form>
                        <Form.Item>
                            {getFieldDecorator('switch', {initialValue:''})
                                (
                                <RadioGroup>
                                    {
                                        cmd.map((v,i)=>{
                                            return(
                                                <Radio key={i} value={v.cmd}>{v.displayName}</Radio>
                                            )
                                        })
                                    }
                                </RadioGroup>
                                )
                            }
                        </Form.Item>
                    </Form>
                </Modal>
            )

        }
    }
)