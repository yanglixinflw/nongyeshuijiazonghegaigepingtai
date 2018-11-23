import React,{Component} from 'react';
import styles from "./chargingDevice.less"
import { Input, Button, Form, Table, Modal, Select} from 'antd';
//开发地址
const envNet='http://192.168.30.127:88';
//生产环境
// const envNet='';
//翻页调用
const dataUrl=`${envNet}/api/Automatic/list`;
//修改设备
const editUrl=`${envNet}/fee/chargeFacility/update`;
//添加设备
const addUrl=`${envNet}/fee/chargeFacility/add`;
//删除设备
const delUrl=`${envNet}/fee/chargeFacility/delete`;
//下拉搜索设备调用
const deviceUrl = `${envNet}/api/device/list`;
//通过id获取详细信息接口（用来获取name）
const infoUrl = `${envNet}/fee/chargeFacility/getById`
//表头
const tableTitle=[
    {index:"id",item:"设备ID"},
    {index:"type",item:"设备型号"},
    {index:"name",item:"设备名称"},
    {index:"area",item:"设备安装地"},
    {index:"building",item:"关联建筑物"},
    {index:"valveType",item:"灌区类型"},
    {index:"plantType",item:"种植类型"},
    {index:"updateTime",item:"更新时间"},
]
// post通用设置
let postOption = {
    method: 'POST',
    credentials: "include",
    mode: 'cors',
    headers: new Headers({
        'Content-Type': 'application/json',
    }),
}
//假数据
const data=[
    {id:"435676651",type:"慧水超声波表",name:" 宁圩村1#水表",area:"杭州萧山",building:"一号闸阀井",valveType:"一级灌区",plantType:"水果",updateTime:"2018/09/23  09:03:32"},
    {id:"435676652",type:"慧水超声波表",name:" 宁圩村2#水表",area:"杭州萧山",building:"一号闸阀井",valveType:"一级灌区",plantType:"水果",updateTime:"2018/09/23  09:03:32"},
    {id:"435676653",type:"慧水超声波表",name:" 宁圩村3#水表",area:"杭州萧山",building:"一号闸阀井",valveType:"一级灌区",plantType:"水果",updateTime:"2018/09/23  09:03:32"},
    {id:"435676654",type:"慧水超声波表",name:" 宁圩村4#水表",area:"杭州萧山",building:"一号闸阀井",valveType:"一级灌区",plantType:"水果",updateTime:"2018/09/23  09:03:32"},
    {id:"435676655",type:"慧水超声波表",name:" 宁圩村5#水表",area:"杭州萧山",building:"一号闸阀井",valveType:"一级灌区",plantType:"水果",updateTime:"2018/09/23  09:03:32"},
    {id:"435676656",type:"慧水超声波表",name:" 宁圩村6#水表",area:"杭州萧山",building:"一号闸阀井",valveType:"一级灌区",plantType:"水果",updateTime:"2018/09/23  09:03:32"},
    {id:"435676657",type:"慧水超声波表",name:" 宁圩村7#水表",area:"杭州萧山",building:"一号闸阀井",valveType:"一级灌区",plantType:"水果",updateTime:"2018/09/23  09:03:32"},
    {id:"435676658",type:"慧水超声波表",name:" 宁圩村8#水表",area:"杭州萧山",building:"一号闸阀井",valveType:"一级灌区",plantType:"水果",updateTime:"2018/09/23  09:03:32"},
    {id:"435676659",type:"慧水超声波表",name:" 宁圩村9#水表",area:"杭州萧山",building:"一号闸阀井",valveType:"一级灌区",plantType:"水果",updateTime:"2018/09/23  09:03:32"}
]
const { Option }=Select
export default class extends Component{
    constructor(props) {
        super(props)
        const chargingDevice=data;
        var tableData=[],tableIndex=[];//数据表的item 和 index
        tableTitle.map(v=>{
            tableData.push(v.item);
            tableIndex.push(v.index)
        })
        this.state={
            items:chargingDevice,
            tableDatas:[],
            columns: [],
            title:tableTitle,
            //搜索框默认值
            searchValue:{},
            //是否显示删除弹窗
            delVisible:false,
            //设备id
            deviceId:'',
            //是否显示修改弹窗
            editvisible:false,
            //是否显示添加弹窗
            addvisible:false,
        }
    }
    componentDidMount() {
        this._getTableDatas(this.state.title, this.state.items);
    }
    _getTableDatas(title, items) {
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
        items.map((v, i) => {
            tableDatas.push({
                id:v.id,
                type:v.type,
                name:v.name,
                area:v.area,
                building:v.building,
                valveType:v.valveType,
                plantType:v.plantType,
                updateTime:v.updateTime,
                key: i,
            });
        })
        this.setState({
            columns,
            tableDatas,
        });
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
                            onClick={()=>this.edit(record.deviceId)}
                        >
                            修改
                        </Button>
                        <Button
                            className={styles.delete}
                            icon='delete'
                            onClick={()=>this.delete(record.deviceId)}
                        >
                            删除
                        </Button>
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
        // if(values.realName==undefined){
        //     values.realName=''
        // }
        // if(values.mobilePhone==undefined){
        //     values.mobilePhone=''
        // }
        // if(values.idCard==undefined){
        //     values.idCard=''
        // }
        // if(values.areaId=='area'){
        //     values.areaId=''
        // }
        // if(values.isActivated=='isActivated'){
        //     values.isActivated=''
        // }
        return fetch(dataUrl, {
            ...postOption,
            body: JSON.stringify({
                // "name": values.realName,
                // "mobile": values.mobilePhone,
                // "idCard": values.idCard,
                // "areaId": values.areaId,
                // "isActivated": values.isActivated,
                // "pageIndex": 0,
                // "pageSize": 10
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
    delete(deviceId){
        this.setState({
            deviceId,
            delVisible:true
        })
    }
    //点击确定删除
    delOk(){
        let ids=[];
        ids.push(this.state.deviceId)
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
                                this._getTableDatas(title, data);
                                this.setState({
                                    data,
                                    delVisible:false
                                })
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
    edit(deviceId){
        this.setState({
            deviceId,
            editvisible:true
        })
    }
    //点击确定修改
    edithandleOk(){
        this.setState({
            editvisible:false
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
        const form = this.addForm.props.form;
        form.validateFields((err, values) => {
            // 未定义时给空值
            if (err) {
                return
            }
            fetch(infoUrl,{
                ...postOption,
                body:JSON.stringify({
                    "id":values.id
                })
            })
        })
        
        this.setState({
            addvisible:false
        })
    }
    //点击取消添加
    addhandleCancel(){
        this.setState({
            addvisible:false
        })
    }
    render(){
        const { columns, tableDatas,delVisible,editvisible,deviceId,addvisible } = this.state;
        const paginationProps = {
            showQuickJumper: true,
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
                            searchHandler={() => this._searchTableDatas()}
                            resetHandler={() => this._resetForm()}
                        />
                        <div className={styles.buttonGroup}>
                            <Button
                                className={styles.fnButton}
                                icon="search"
                                onClick={() => this._searchTableDatas()}
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
                        {...{deviceId}}
                    />
                    {/* 添加弹窗 */}
                    <AddForm
                        wrappedComponentRef={(addForm) => this.addForm = addForm}
                        visible={addvisible}
                        onCancel={() => this.addhandleCancel()}
                        onOk={() => this.addhandleOk()}
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
                        {getFieldDecorator('id', {initialValue: ''})
                            (
                            <Input
                                placeholder='设备ID'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('type', {})
                            (
                            <Input
                                placeholder='设备型号'
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
                        {getFieldDecorator('area', {initialValue:'area'})
                            (
                            <Select>
                                <Option value="area">设备安装地</Option>
                                <Option value="all">全部</Option>
                            </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('building', {initialValue: ''})
                            (
                            <Input
                                placeholder='关联建筑物'
                                type="text"
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('valveType', {initialValue: 'valveType'})
                            (
                            <Select>
                                <Option value="valveType">灌区类型</Option>
                                <Option value="all">全部</Option>
                            </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('plantType', {initialValue: 'plantType'})
                            (
                            <Select>
                                <Option value="plantType">种植类型</Option>
                                <Option value="all">全部</Option>
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
            const { visible, onCancel, onOk, form, deviceId } = this.props;
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
                            {getFieldDecorator('valveType', {initialValue: '选择灌区类型'})
                            (
                                <Select>
                                    
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item label="种植类型">
                            {getFieldDecorator('plantType', {initialValue: '选择种植类型'})
                                (
                                <Select>
                                    
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
            //下拉搜索框初始值
            value:undefined,
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
        handleSearch = (value,selected) => {
            console.log(value)
        }
        render() {
            const { visible, onCancel, onOk, form } = this.props;
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
                        <Form.Item label="设备型号">
                            {getFieldDecorator('id', {initialValue: ''})
                            (
                                <Select
                                    // showSearch
                                    placeholder='请选择设备型号'
                                    defaultActiveFirstOption={false}
                                    showArrow={false}
                                    filterOption={false}
                                    onSearch={this.handleSearch}
                                    onChange={this.handleChange}
                                    notFoundContent={null}
                                >
                                    {/* <Option value='1'>1</Option>
                                    <Option value='2'>2</Option> */}
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
                            {getFieldDecorator('valveType', {initialValue: '请选择灌区类型'})
                            (
                                <Select>
                                    <Option value="1">123</Option>
                                    <Option value="2">456</Option>
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item label="种植类型">
                            {getFieldDecorator('plantType', {initialValue: '请选择种植类型'})
                                (
                                <Select>
                                    <Option value="1">123</Option>
                                    <Option value="2">456</Option>
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