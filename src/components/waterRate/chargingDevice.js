import React,{Component} from 'react';
import styles from "./chargingDevice.less"
import { Input, Button, Form, Table, Modal, Select,message,Row, Col,Checkbox} from 'antd';
import {ENVNet,postOption} from '../../services/netCofig'
//翻页调用
const dataUrl=`${ENVNet}/fee/chargeFacility/list`;
//修改设备
const editUrl=`${ENVNet}/fee/chargeFacility/update`;
//添加设备
const addUrl=`${ENVNet}/fee/chargeFacility/add`;
//删除设备
const delUrl=`${ENVNet}/fee/chargeFacility/delete`;
//关联建筑接口
const buildingUrl=`${ENVNet}/api/Building/list`
//下拉搜索设备调用
const deviceUrl = `${ENVNet}/api/device/list`;
//种植类型
const plantTypeUrl = `${ENVNet}/fee/chargeFacility/plantTypeList`;
//灌区类型
const wateringTypeUrl = `${ENVNet}/fee/chargeFacility/wateringTypeList`;
//设备安装地列表
const installAddrUrl=`${ENVNet}/api/BaseInfo/installAddrList`;
//表头
const tableTitle=[
    {index:"deviceId",item:"设备ID"},
    {index:"deviceTypeName",item:"设备型号"},
    {index:"deviceName",item:"设备名称"},
    {index:"installAddr",item:"设备安装地"},
    {index:"relatedBuilding",item:"关联建筑物"},
    {index:"wateringTypeName",item:"灌区类型"},
    {index:"plantTypeName",item:"种植类型"},
    {index:"updateTime",item:"更新时间"},
]
const { Option }=Select
export default class extends Component{
    constructor(props) {
        super(props)
        const {chargingDevice}=props;
        this.state={
            //表格的列
            columns: [],
            //表头
            title:tableTitle,
            itemCount:chargingDevice.data.data.itemCount,//总数据数
            data:chargingDevice.data.data.items,//表格数据源
            //搜索框默认值
            searchValue:{},
            //是否显示删除弹窗
            delVisible:false,
            //设备id
            deviceId:'',
            //设备独有的id,修改必传字段
            facilityId:'',
            //是否显示修改弹窗
            editvisible:false,
            //是否显示添加弹窗
            addvisible:false,
            //种植类型
            plantType:[],
            //灌区类型
            wateringType:[],
            //设备安装地
            installAddrList:[],
        }
    }
    componentDidMount() {
        this._getTableDatas(this.state.title, this.state.data);
        return (
            //获取种植类型
            fetch(plantTypeUrl,{
                ...postOption
            }).then(res=>{
                Promise.resolve(res.json())
                .then(v=>{
                    let plantType=v.data
                    this.setState({
                        plantType
                    })
                })
            }),
            //获取灌区类型
            fetch(wateringTypeUrl,{
                ...postOption
            }).then(res=>{
                Promise.resolve(res.json())
                .then(v=>{
                    let wateringType=v.data
                    this.setState({
                        wateringType
                    })
                })
            }),
            //设备安装地
            fetch(installAddrUrl, {
                method: 'GET',
                mode: 'cors',
                credentials: "include",
            }).then((res) => {
                Promise.resolve(res.json())
                    .then((v) => {
                        if (v.ret == 1) {
                            console.log(v.data)
                            let installAddrList = v.data
                            this.setState({
                                installAddrList
                            })
                        }
                    })
            }).catch((err) => {
                console.log(err)
            })
        )
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
                deviceTypeName:v.deviceTypeName,
                deviceName:v.deviceName,
                installAddr:v.installAddr,
                relatedBuilding:v.relatedBuilding,
                wateringTypeName:v.wateringTypeName,
                plantTypeName:v.plantTypeName,
                updateTime:v.updateTime,
                facilityId:v.facilityId,
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
            width: 220,
            render: (record) => {
                return (
                    <span className={styles.options}>
                     <Button
                            className={styles.edit}
                            icon='edit'
                            onClick={()=>this.edit(record.deviceId,record.facilityId)}
                        >
                            修改
                        </Button>
                        <Button
                            className={styles.delete}
                            icon='delete'
                            onClick={()=>this.delete(record.facilityId)}
                        >
                            删除
                        </Button>
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
            console.log(values)
            return fetch(dataUrl, {
                ...postOption,
                body: JSON.stringify({
                    "deviceId": values.deviceId,
                    "deviceName": values.deviceName,
                    "installAddrId": values.installAddr,
                    "relatedBuilding": values.relatedBuilding,
                    "wateringType": values.wateringType,
                    "plantType": values.plantType,
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
    //点击删除
    delete(facilityId){
        this.setState({
            facilityId,
            delVisible:true
        })
    }
    //点击确定删除
    delOk(){
        let ids=[];
        ids.push(this.state.facilityId)
        fetch(delUrl,{
            ...postOption,
            body:JSON.stringify({
                ids
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
                                let itemCount = v.data.itemCount;
                                // 给每一条数据添加key
                                data.map((v, i) => {
                                    v.key = i
                                })
                                this.setState({
                                    data,
                                    itemCount,
                                    delVisible:false
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
    delCancel(){
        this.setState({
            delVisible:false
        })
    }
    //点击修改
    edit(deviceId,facilityId){
        this.setState({
            deviceId,
            facilityId,
            editvisible:true
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
            //获取设备的name
            fetch(deviceUrl,{
                ...postOption,
                body:JSON.stringify({
                    "deviceId":this.state.deviceId,
                    "pageIndex": 0,
                    "pageSize": 1
                })
            }).then(res=>{
                Promise.resolve(res.json())
                .then(v=>{
                    if(v.ret==1){
                        let name=v.data.items.name
                        //访问修改接口
                        fetch(editUrl,{
                            ...postOption,
                            body:JSON.stringify({
                                "facilityId":this.state.facilityId,
                                name,
                                "deviceId":values.deviceId,
                                "wateringType":values.wateringType,
                                "plantType":values.plantType
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
                                                this.setState({
                                                    data,
                                                    editvisible:false
                                                })
                                                this._getTableDatas(this.state.title,data)
                                            }
                                        })
                                    })
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
    //点击添加
    add(){
        this.setState({
            addvisible:true
        })
    }
    //点击确定添加
    addhandleOk(){
        const {title}=this.state
        const form = this.addForm.props.form;
        form.validateFields((err, values) => {
            // 未定义时给空值
            if (err) {
                return
            }
            //通过接口获取到name值
            fetch(deviceUrl,{
                ...postOption,
                body:JSON.stringify({
                    "deviceId":values.deviceId,
                    "pageIndex": 0,
                    "pageSize": 1
                })
            }).then(res=>{
                Promise.resolve(res.json())
                .then(v=>{
                    if(v.ret==1){
                        let name=v.data.items.name
                        //请求添加接口
                        fetch(addUrl,{
                            ...postOption,
                            body:JSON.stringify({
                                name,
                                "deviceId":values.deviceId,
                                "wateringType":values.wateringType,
                                "plantType":values.plantType
                            })
                        }).then(res=>{
                            Promise.resolve(res.json())
                            .then(v=>{
                                if(v.ret==1){
                                    //重新请求接口渲染页面
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
                                                let itemCount = v.data.itemCount;
                                                // 给每一条数据添加key
                                                data.map((v, i) => {
                                                    v.key = i
                                                })
                                                this.setState({
                                                    data,
                                                    itemCount,
                                                    addvisible:false
                                                })
                                                this._getTableDatas(title,data)
                                                message.success("添加成功",2)
                                            }
                                        })
                                    })
                                }
                            })
                        })
                    }
                })
            })
        })
    }
    //点击取消添加
    addhandleCancel(){
        this.setState({
            addvisible:false
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
    render(){
        const { columns, tableDatas,delVisible,editvisible,deviceId,addvisible,itemCount,wateringType,plantType,installAddrList } = this.state;
        const paginationProps = {
            showQuickJumper: true,
            total: itemCount,
            // 传递页码
            onChange: (page) => this._pageChange(page)
        };
        return(
            <React.Fragment>
                <div className={styles.chargingDevice}>
                    <div className={styles.header}>
                        <span>|</span>计费设施
                    </div>
                    <div className={styles.searchForm}>
                        {/* 表单信息 */}
                        <SearchForm
                            wrappedComponentRef={(searchForm) => this.searchForm = searchForm}
                            searchHandler={() => this._searchTableData()}
                            resetHandler={() => this._resetForm()}
                            {...{wateringType,plantType,installAddrList}}
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
                                icon='plus'
                                className={styles.fnButton}
                                onClick={() => this.add()}
                            >
                                添加
                            </Button>
                            <Button
                                icon='upload'
                                className={styles.fnButton}
                            >
                                导出数据
                            </Button>
                        </div> 
                    </div>
                    <Table
                        columns={columns}
                        className={styles.tables}
                        pagination={paginationProps}
                        dataSource={tableDatas}
                        // scroll={{ x:"<1200"?true:false}}
                    />
                     {/* 删除弹窗 */}
                     <Modal 
                        title="删除"
                        visible={delVisible}
                        className={styles.delModal}
                        onOk={()=>this.delOk()}
                        onCancel={()=>this.delCancel()}
                        okText="确认"
                        cancelText="取消"
                        centered//居中显示
                    >
                        <p>删除后信息将无法恢复，是否确认删除。</p>
                    </Modal>
                    {/* 修改弹窗 */}
                    <EditForm
                        wrappedComponentRef={(editForm) => this.editForm = editForm}
                        visible={editvisible}
                        onCancel={() => this.edithandleCancel()}
                        onOk={() => this.edithandleOk()}
                        {...{deviceId,wateringType,plantType}}
                    />
                    {/* 添加弹窗 */}
                    <AddForm
                        wrappedComponentRef={(addForm) => this.addForm = addForm}
                        visible={addvisible}
                        onCancel={() => this.addhandleCancel()}
                        onOk={() => this.addhandleOk()}
                        {...{wateringType,plantType}}
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
            const { form,wateringType,plantType,installAddrList } = this.props;
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
                        {getFieldDecorator('deviceId', {initialValue: ''})
                            (
                            <Input
                                placeholder='设备ID'
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
                        {getFieldDecorator('installAddr', {})
                            (
                            <Select
                                placeholder='设备安装地'
                            >
                                <Option value="">全部</Option>
                                {
                                    installAddrList.map((v,i)=>{
                                        return (<Option key={i} value={v.id}>{v.addr}</Option>)
                                    })
                                }
                            </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('relatedBuilding', {})
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
                    <Form.Item>
                        {getFieldDecorator('wateringType', {})
                            (
                            <Select
                                placeholder='灌区类型'
                            >
                                <Option value="">全部</Option>
                                {
                                    wateringType.map((v,i)=>{
                                        return(
                                            <Option key={i} value={v.id}>{v.name}</Option>
                                        )
                                    })
                                }
                            </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('plantType', {})
                            (
                            <Select
                                placeholder='种植类型'
                            >
                                <Option value="">全部</Option>
                                {
                                    plantType.map((v,i)=>{
                                        return(
                                            <Option key={i} value={v.id}>{v.name}</Option>
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
//修改弹窗表单
const EditForm = Form.create()(
    class extends React.Component {
        render() {
            const { visible, onCancel, onOk, form, deviceId,wateringType,plantType } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    className={styles.editModal}
                    visible={visible}
                    title="修改"
                    onCancel={onCancel}
                    onOk={onOk}
                    cancelText='取消'
                    okText='确定'
                    centered
                >
                    <Form>
                        <Form.Item label="设备型号">
                            {getFieldDecorator('id', {initialValue: `${deviceId}`})
                            (
                                <Input
                                    disabled
                                    type='text'
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="灌区类型">
                            {getFieldDecorator('wateringType', {initialValue: '选择灌区类型'})
                            (
                                <Select>
                                    {
                                        wateringType.map((v,i)=>{
                                            return(
                                                <Option value={v.id} key={i}>{v.name}</Option> 
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item label="种植类型">
                            {getFieldDecorator('plantType', {initialValue: '选择种植类型'})
                                (
                                <Select>
                                    {
                                        plantType.map((v,i)=>{
                                            return(
                                                <Option value={v.id} key={i}>{v.name}</Option> 
                                            )
                                        })
                                    }
                                </Select>
                                )
                            }
                        </Form.Item>
                    </Form>
                </Modal>
            )
        }
    }
)
//添加弹窗表单
const AddForm = Form.create()(
    class extends React.Component {
        state={
            //设备信息数据列表
            deviceList:[],
            //选中的值
            name:""
        }
        //下拉搜索框搜索功能
        handleSearch = (value) => {
            console.log(value)
            fetch(deviceUrl, {
                ...postOption,
                body: JSON.stringify({
                    "name":value,
                    "pageIndex": 0,
                    "pageSize": 10
                })
            }).then(res => {
                Promise.resolve(res.json())
                    .then(v => {
                        if (v.ret == 1) {
                            // 设置页面显示的元素
                            let deviceList = v.data.items
                            this.setState({
                                deviceList,
                            })
                        }
                    })
            }).catch(err => {
                console.log(err)
            })
        }
        render() {
            const { visible, onCancel, onOk, form,wateringType,plantType } = this.props;
            const { getFieldDecorator } = form;
            const {deviceList}=this.state
            return (
                <Modal
                    className={styles.addModal}
                    visible={visible}
                    title="添加"
                    onCancel={onCancel}
                    onOk={onOk}
                    cancelText='取消'
                    okText='确定'
                    centered
                >
                    <Form>
                        <Form.Item label="设备名称">
                            {getFieldDecorator('deviceId', {rules: [{required:true,message:"请填选设备名称"}]})
                            (
                                <Select
                                    showSearch
                                    placeholder='设备名称/ID'
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={this.handleSearch}
                                    notFoundContent={null}
                                >
                                    {
                                        deviceList.map((v,i)=>{
                                            return(
                                                <Option value={v.deviceId} key={i}>{v.name}</Option> 
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item label="灌区类型">
                            {getFieldDecorator('wateringType', {initialValue: '请选择灌区类型',rules: [{required:true,message:"请选择灌区类型"}]})
                            (
                                <Select>
                                    {
                                        wateringType.map((v,i)=>{
                                            return(
                                                <Option value={v.id} key={i}>{v.name}</Option> 
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item label="种植类型">
                            {getFieldDecorator('plantType', {initialValue: '请选择种植类型',rules: [{required:true,message:"请选择种植类型"}]})
                                (
                                <Select>
                                    {
                                        plantType.map((v,i)=>{
                                            return(
                                                <Option value={v.id} key={i}>{v.name}</Option> 
                                            )
                                        })
                                    }
                                </Select>
                                )
                            }
                        </Form.Item>
                    </Form>
                </Modal>
            )
        }
    }
)