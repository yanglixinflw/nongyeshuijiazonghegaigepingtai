import React,{Component} from 'react';
import styles from "./groupAccount.less"
import { Input, Button, Form, Table,Select,Modal,message} from 'antd';
//开发地址
const envNet='http://192.168.30.127:88';
//生产环境
// const envNet='';
//翻页调用
const dataUrl=`${envNet}/fee/groupAccount/list`;
//修改小组名称
const editUrl=`${envNet}/fee/groupAccount/changeName`;
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
    {index:"deviceId",item:"设备ID"},
    {index:"deviceName",item:"设备名称"},
    {index:"name",item:"小组"},
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
            name:""
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
                name:v.name,
                memberNames:v.memberNames,
                balance:v.balance,
                currentWaterUse:v.currentWaterUse,
                waterPower:v.waterPower,
                updateTime:v.updateTime,
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
                        <Button
                            className={styles.record}
                            // onClick={() => this._set()}
                            icon='file-text'
                        >
                            消费记录
                        </Button>
                        <Button
                            className={styles.clear}
                            icon='delete'
                        >
                            清空当前用量
                        </Button>
                        <Button
                            className={styles.assignment}
                            icon='share-alt'
                        >
                            分配水权
                        </Button>
                        <Button
                            className={styles.edit}
                            icon='edit'
                            onClick={()=>this.edit(record.name)}
                        >
                            修改
                        </Button>
                        <Button
                        className={styles.management}
                            icon='team'
                        >
                            管理小组成员
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
    edit(name){
        this.setState({
            editvisible:true,
            name
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
                    name:values.name
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
                                        itemCount:v.data.itemCount,
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
    render(){
        const { columns, tableDatas,editvisible,name } = this.state;
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
                                icon='upload'
                                className={styles.fnButton}
                            >
                                导出数据
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
                    {/* 修改弹窗 */}
                    <EditForm
                        wrappedComponentRef={(editForm) => this.editForm = editForm}
                        visible={editvisible}
                        onCancel={() => this.edithandleCancel()}
                        onOk={() => this.edithandleOk()}
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
                        {getFieldDecorator('id', {initialValue: ''})
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
                        {getFieldDecorator('groupName', {})
                            (
                            <Input
                                placeholder='名称'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('name/phone', {})
                            (
                            <Input
                                placeholder='农户姓名/手机'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('state', {})
                            (
                            <Select 
                                placeholder="状态"
                            >
                                <Option value="">全部</Option>
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
                    title="修改"
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