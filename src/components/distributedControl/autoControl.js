import React,{Component} from 'react';
import styles from "./autoControl.less"
import { Input, Button, Form, Table,Modal,message } from 'antd';
import { Link } from 'dva/router';
import classnames from 'classnames';
import { timeOut } from '../../utils/timeOut';
import {ENVNet,postOption} from '../../services/netCofig'
//生产环境
// const ENVNet='';
//翻页调用
const dataUrl=`${ENVNet}/api/Automatic/list`;
//转换状态调用
const changeUrl=`${ENVNet}/api/Automatic/changeStatus`;
//快捷添加自动化规则
const addUrl=`${ENVNet}/api/Automatic/add`;
//修改自动化规则名称
const editUrl=`${ENVNet}/api/Automatic/update`;
//删除自动化规则名称
const delUrl=`${ENVNet}/api/Automatic/delete`;
const tableTitle=[
    {index:"ruleId",item:"自动化编号"},
    {index:"name",item:"自动化名称"},
    // {index:"description",item:"规则"},
    {index:"isEnabled",item:"状态"},
    {index:"updateTime",item:"更新时间"},
]
export default class extends Component{
    constructor(props) {
        super(props)
        const {autoControl}=props;
        this.state={
            //表数据源
            itemCount:autoControl.data.data.itemCount,//总数据数
            data:autoControl.data.data.items,//表格数据源
            columns: [],
            //表头
            title:tableTitle,
            //停用/启用弹窗是否显示
            changeStatusVisible:false,
            //规则id
            ruleId:"",
            //规则的状态
            isEnabled:true,
            //是否显示添加弹窗
            addvisible:false,
            //是否显示修改弹窗
            editvisible:false,
            //规则名称
            name:"",
            //是否显示删除弹窗
            delVisible:false,
            //搜索默认值
            searchValue:{},
            //初始页
            current:1
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
            if(v.isEnabled==true){
                tableDatas.push({
                    name:v.name,
                    description:v.description,
                    isEnabled:"启用",
                    updateTime:v.updateTime,
                    ruleId:v.ruleId,
                    key: i,
                });
            }else{
                tableDatas.push({
                    name:v.name,
                    description:v.description,
                    isEnabled:"停用",
                    updateTime:v.updateTime,
                    ruleId:v.ruleId,
                    key: i,
                });
            }
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
                    <div className={styles.option}>
                        <div>
                            <Link to={`/automation/autoRules:${record.ruleId}`}>
                                <Button
                                    className={styles.set}
                                    icon='setting'
                                >
                                    设置自动化规则
                                </Button>
                            </Link>
                            {record.isEnabled=="启用"?<Button
                                className={styles.stop}
                                
                                onClick={()=>this.changeStatus(record.ruleId,record.isEnabled)}
                            >
                                 <i className={classnames('dyhsicon', 'dyhs-tingyong', `${styles.OptionIcon}`)} style={{fontSize:'14px',marginRight:"7px"}}></i><span>停用</span>  
                            </Button>:<Button
                                className={styles.stop}
                                icon='poweroff'
                                onClick={()=>this.changeStatus(record.ruleId,record.isEnabled)}
                            >
                                启用   
                            </Button>
                            }
                        </div>
                        <div>
                            {/* <Button
                                className={styles.edit}
                                icon='edit'
                                onClick={()=>this.edit(record.ruleId,record.name)}
                            >
                                修改
                            </Button> */}
                            <Button
                                className={styles.delete}
                                icon='delete'
                                onClick={()=>this.delete(record.ruleId)}
                            >
                                删除
                            </Button>
                        </div>
                    </div>
                )
            }
        })
        this.setState({
            columns,
            tableDatas,
        });
    }
  // 搜索功能
  _searchTableDatas() {
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
                "name": values.name,
                "pageIndex": 0,
                "pageSize": 10
            })
        }).then(res => {
            Promise.resolve(res.json())
                .then(v => {
                    //超时判断
                    timeOut(v.ret)
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
                    //超时判断
                    timeOut(v.ret)
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
                            current:1
                        })
                        this._getTableDatas(title, data);
                    }
                })
        })
    }
    //翻页
  _pageChange(page){
        const { title,searchValue } = this.state;
        searchValue.pageIndex = page - 1;
        searchValue.pageSize=10
        return fetch(dataUrl, {
            ...postOption,
            body: JSON.stringify({
                ...searchValue
            })
        }).then(res=>{
            Promise.resolve(res.json())
            .then(v=>{
                //超时判断
                timeOut(v.ret)
                if(v.ret==1){
                    // 设置页面显示的元素
                //   console.log(v)
                    let data = v.data.items;
                    //添加key
                    data.map((v, i) => {
                        v.key = i
                    })
                    this.setState({
                        itemCount:v.data.itemCount,
                        data,
                        current:page
                    })
                    this._getTableDatas(title,data);
                }
            })
            .catch(err=>{
                console.log(err)
            })
        })
    }
    //点击启用与停用
    changeStatus(ruleId,isEnabled){
        if(isEnabled=="启用"){
            isEnabled=true
        }else{
            isEnabled=false
        }
        this.setState({
            changeStatusVisible:true,
            ruleId,
            isEnabled
        })
    }
   //点击 停/启用 确定
    changeStatusOk(){
        const {title}=this.state
        return fetch(changeUrl,{
            ...postOption,
            body:JSON.stringify({
                "id":this.state.ruleId,
                "isEnable":!this.state.isEnabled
            })
        }).then(res=>{
            Promise.resolve(res.json())
            .then(v=>{
                //超时判断
                timeOut(v.ret)
                if(v.ret==1){
                    return fetch(dataUrl,{
                        ...postOption,
                        body:JSON.stringify({
                            "pageIndex": 0,
                            "pageSize": 10
                        })
                    }).then(res=>{
                        Promise.resolve(res.json())
                        .then(v=>{
                            //超时判断
                            timeOut(v.ret)
                            if(v.ret==1){
                                let data=v.data.items;
                                this._getTableDatas(title, data);
                                this.setState({
                                    changeStatusVisible:false,
                                    data,
                                    current:1
                                })
                                if(this.state.isEnabled==false){
                                    message.success("启用成功",2)
                                }else{
                                    message.success("停用成功",2)
                                }    
                            }
                        })
                    })
                }
            })
        })
    }
    //点击 停/启用 取消
    changeStatusCancel(){
        this.setState({
            changeStatusVisible:false,
        })
    }
    //点击添加
    add(){
        this.setState({
            addvisible:true
        })
    }
    //点击添加确定
    addhandleOk(){
        const {title}=this.state
        const form = this.addForm.props.form;
        form.validateFields((err, values) => {
            // 未定义时给空值
            if (err) {
                return
            }
            fetch(addUrl,{
                ...postOption,
                body:JSON.stringify({
                    "name":values.name
                })
            }).then(res=>{
                Promise.resolve(res.json())
                .then(v=>{
                    //超时判断
                    timeOut(v.ret)
                    if(v.ret==1){
                        this._resetForm();
                        this.setState({
                            addvisible: false
                        });
                        form.resetFields();
                        message.success('添加成功', 2);
                    } else {
                        message.error(v.msg, 2);
                    }
                })
            })
        })
    }
    //点击添加取消
    addhandleCancel(){
        const form = this.addForm.props.form;
        // 重置表单
        form.resetFields();
        this.setState({
            addvisible:false
        })
    }
    //点击修改按钮
    edit(ruleId,name){
        this.setState({
            ruleId,
            name,
            editvisible:true
        })
    }
    //点击修改确定
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
                    "id":values.id,
                    "name":values.name
                })
            }).then(res=>{
                Promise.resolve(res.json())
                .then(v=>{
                    //超时判断
                    timeOut(v.ret)
                    if(v.ret==1){
                        this._resetForm();
                        this.setState({
                            editvisible: false
                        });
                        form.resetFields();
                        message.success('修改成功', 2);
                    } else {
                        message.error(v.msg, 2);
                    }
                })
            })
        })
    }
    //点击修改取消
    edithandleCancel(){
        this.setState({
            editvisible:false
        })
    }
    //点击删除
    delete(ruleId){
        this.setState({
            delVisible:true,
            ruleId
        })
    }
    //点击确认删除
    delOk(){
        fetch(delUrl,{
            ...postOption,
            body:JSON.stringify({
                ruleIds:this.state.ruleId
            })
        }).then(res=>{
            Promise.resolve(res.json())
            .then(v=>{
                //超时判断
                timeOut(v.ret)
                if(v.ret==1){
                    this._resetForm();
                    this.setState({
                        delVisible: false
                    });
                    message.success('删除成功', 2);
                } else {
                    message.error(v.msg, 2);
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
    render(){
        const { columns,itemCount,current,tableDatas,changeStatusVisible,addvisible,editvisible,name,ruleId,delVisible,isEnabled } = this.state;
        const paginationProps = {
            current,current,
            showQuickJumper: true,
            total: itemCount,
            // 传递页码
            onChange: (page) => this._pageChange(page)
      };
        return(
            <React.Fragment>
                <div className={styles.autoControl}>
                    <div className={styles.header}>
                        <span>|</span>自动化控制
                    </div>
                    <div className={styles.searchForm}>
                        {/* 表单信息 */}
                        <SearchForm
                            wrappedComponentRef={(searchForm) => this.searchForm = searchForm}
                        />
                        <div className={styles.buttonGroup}>
                            <Button
                                className={styles.fnButton}
                                // icon="search"
                                onClick={() => this._searchTableDatas()}
                            >
                                <i className={classnames('dyhsicon', 'dyhs-sousuo', `${styles.searchIcon}`)}></i>
                                搜索
                            </Button>
                            <Button
                                // icon='reload'
                                className={styles.fnButton}
                                onClick={() => this._resetForm()}
                            >
                                <i className={classnames('dyhsicon', 'dyhs-zhongzhi', `${styles.resetIcon}`)}></i>
                                重置
                            </Button>
                            <Button
                                icon='plus'
                                className={styles.fnButton}
                                onClick={()=>this.add()}
                            >
                                添加
                            </Button>
                        </div> 
                    </div>
                    <Table
                        columns={columns}
                        className={styles.table}
                        pagination={paginationProps}
                        dataSource={tableDatas}
                        // scroll={{ x: 1300 }}
                    />
                    {/* 停用/启用弹窗 */}
                    <Modal 
                        title={isEnabled==false?'启用':'停用'}
                        visible={changeStatusVisible}
                        className={styles.changeStatusModal}
                        onOk={()=>this.changeStatusOk()}
                        onCancel={()=>this.changeStatusCancel()}
                        okText="确认"
                        cancelText="取消"
                        centered//居中显示
                    >
                        <p>确认{isEnabled==true?'停用':'启用'}规则</p>
                    </Modal>
                    {/* 添加弹窗 */}
                    <AddForm
                        wrappedComponentRef={(addForm) => this.addForm = addForm}
                        visible={addvisible}
                        onCancel={() => this.addhandleCancel()}
                        onOk={() => this.addhandleOk()}
                    />
                    {/* 修改弹窗 */}
                    <EditForm
                        wrappedComponentRef={(editForm) => this.editForm = editForm}
                        visible={editvisible}
                        onCancel={() => this.edithandleCancel()}
                        onOk={() => this.edithandleOk()}
                        {...{name,ruleId}}
                    />
                    {/* 删除弹窗 */}
                    <Modal 
                        title="删除自动化规则"
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
                        {getFieldDecorator('name', {})
                            (
                            <Input
                                placeholder='自动化名称'
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
//添加弹窗表单
const AddForm = Form.create()(
    class extends React.Component {
        render() {
            const { visible, onCancel, onOk, form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    className={styles.addModal}
                    visible={visible}
                    title="添加自动化规则"
                    onCancel={onCancel}
                    onOk={onOk}
                    cancelText='取消'
                    okText='确定'
                    centered
                >
                    <Form>
                        <Form.Item label="自动化名称">
                            {getFieldDecorator('name', {initialValue: ''})
                            (
                                <Input
                                    placeholder='请输入自动化规则名称'
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
//修改弹窗表单
const EditForm = Form.create()(
    class extends React.Component {
        render() {
            const { visible, onCancel, onOk, form, name, ruleId } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    className={styles.editModal}
                    visible={visible}
                    title="修改自动化规则"
                    onCancel={onCancel}
                    onOk={onOk}
                    cancelText='取消'
                    okText='确定'
                    centered
                >
                    <Form>
                        <Form.Item label="自动化编号">
                            {getFieldDecorator('id', {initialValue: `${ruleId}`})
                            (
                                <Input
                                    disabled
                                    type='text'
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="自动化名称">
                            {getFieldDecorator('name', {initialValue: ''})
                            (
                                <Input
                                    placeholder={name}
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
