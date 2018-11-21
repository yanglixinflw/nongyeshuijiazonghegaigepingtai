import React,{Component} from 'react';
import styles from "./valveControl.less"
import { Input,Button, Form,Table,Select,Modal,Radio} from 'antd';
import { Link } from 'dva/router';

//开发地址
const envNet='http://192.168.30.127:88';
//生产环境
// const envNet='';
//设备安装地列表
const installAddrUrl=`${envNet}/api/BaseInfo/installAddrList`
//翻页调用
const dataUrl=`${envNet}/api/device/control/list`;
//设备类型列表
const deviceTypeUrl=`${envNet}/api/device/control/deviceTypeList`
//获取设备型号可执行的指令列表
const instructUrl=`${envNet}/api/device/control/cmdList`
//向设备发送指令
const sendCmdUrl=`${envNet}/api/device/control/sendCmd`
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
            //是否选中
            selected:false,
            //操作指令数据
            cmd:[],
            //默认搜索框
            searchValue:{}
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
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                let data=selectedRows;
                let deviceIds=[]
                data.map((v)=>{
                    if(v.deviceTypeName=="智能球阀"){
                        this.setState({
                            deviceTypeId:1
                        })
                    }else if(v.deviceTypeName=="井电双控"){
                        this.setState({
                            deviceTypeId:2
                        })
                    }
                    deviceIds.push(v.deviceId)
                    this.setState({
                        deviceIds
                    })
                })
                // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            onSelect: (record, selected, selectedRows) => {
            //   console.log(record, selected, selectedRows);
                // console.log(selected)
                this.setState({
                    selected
                })
                
            },
            // onSelectAll: (selected, selectedRows, changeRows) => {
            //   console.log(selected, selectedRows, changeRows);
            // },
          };
        this.setState({
            columns,
            tableDatas,
            rowSelection
        });
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
            //搜索字段
            if(values.deviceId==undefined){
                values.deviceId=''
            }
            if(values.name==undefined){
                values.name=''
            }
            if(values.relatedBuilding==undefined){
                values.relatedBuilding=''
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
        form.resetFields(); // 重置表单
        return fetch(dataUrl, {
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
                            searchValue:{}
                        })
                        this._getTableDatas(title, data);
                    }
                })
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
                        v.key = i
                    })
                    this.setState({
                        itemCount:v.data.itemCount,
                        data
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
        // console.log(this.state.deviceIds)
        // console.log(this.state.deviceTypeId)
        //获取设备型号可执行的指令
        //  console.log(this.state.deviceIds)
        if(this.state.selected==false||this.state.deviceIds.length==0){
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
                            console.log(cmd)
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
                            });
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
        const { columns,itemCount, tableDatas, installAddrList,rowSelection,deviceTypeList,switchvisible,cmd} = this.state;
        const paginationProps = {
            showQuickJumper: true,
            total: itemCount,
            // 传递页码
            onChange: (page) => this._pageChange(page)
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
                        columns={columns}
                        rowSelection={rowSelection}
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
        render() {
            const { form,installAddrList,deviceTypeList} = this.props;
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
                        {getFieldDecorator('deviceTypeId', {initialValue:'智能球阀'})
                            (
                            <Select>
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
                        {getFieldDecorator('installAddrId', {initialValue:''})
                            (
                            <Select>
                                <Option value='' disabled selected style={{display:'none'}}>设备安装地</Option>
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