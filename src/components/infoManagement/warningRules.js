import { Component } from 'react';
import styles from "./warningRules.less"
import {  Button,Select ,Table, Modal} from 'antd';
import { routerRedux } from 'dva/router';
//开发环境
const envNet='http://192.168.30.127:88';
//生产环境
// const envNet='';
//翻页调用
const dataUrl=`${envNet}/api/DeviceWaringRule/ruleList`;
// post通用设置
let postOption = {
    method: 'POST',
    credentials: "include",
    mode: 'cors',
    headers: new Headers({
        'Content-Type': 'application/json',
    }),
}
const Option = Select.Option;
//头信息
const title=[
    {index:"deviceTypeName",item:"设备型号"},
    {index:"name",item:"规则名称"},
]
export default class extends Component{
    constructor(props){
        super(props)
        const {warningRules}=props;
        this.state = {
            //表头
            title,
            itemCount:warningRules.data.data.itemCount,//总数据数
            data:warningRules.data.data.items,//表格数据源
            //表的每一列
            columns: [],
            // 设备类型列表
            deviceTypeList:warningRules.deviceTypeList.data.data,
            // 添加弹窗
            addVisible:false,
            // addVisible:true,
            // 选择的设备ID
            selectDeviceId:''
        };
    }
    componentDidMount() {
        this._getTableDatas(this.state.title, this.state.data);
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
                        
                            <Button
                                className={styles.edit}
                                icon='file-text'
                            >
                                规则详情
                            </Button>
                        
                        <Button
                            className={styles.delete}
                            onClick={()=>this.delete()}
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
            tableDatas.push({
                deviceTypeName:v.deviceTypeName,
                name:v.name,
                ruleId:v.ruleId,
                key: i,
            });
        })
        this.setState({
            columns,
            tableDatas,
        });
    }
    //选择不同的设备类型 
    selectDeviceType(selectDeviceId){
        // console.log(selectDeviceId)
        this.setState({
            selectDeviceId
        })
    }
    // 点击添加规则
    addRules(){
        this.setState({
            addVisible:true
        })
    }
    // 下一步
    _addNext(){
        const {dispatch}=this.props
        const {selectDeviceId}=this.state
        if(selectDeviceId==''){
            alert('请先选择要设置的设备类型')
        }else{
            localStorage.setItem('selectDeviceId',selectDeviceId)
            dispatch(routerRedux.push('/warningRules/addWarningRules'))
        }
        // console.log(selectDeviceId)
    }
    // 添加取消
    _addCancel(){
        this.setState({
            addVisible:false,
            selectDeviceId:''
        })
    }
    _pageChange(page){
        // 翻页传递参数
        let postObject={
            "pageIndex": 0,
            "pageSize":10
            }
            postObject.pageIndex = page - 1;
        return fetch(dataUrl, {
            ...postOption,
            body: JSON.stringify({
                ...postObject
            })
        }).then((res)=>{
            Promise.resolve(res.json())
            .then((v)=>{
                if(v.ret==1){
                    // console.log(v);
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
                    this._getTableDatas(this.state.title, this.state.data);
                }
            })
            .catch((err)=>{
                console.log(err)
            })
        })
    }
    render(){
        const { 
            columns, 
            tableDatas,
            itemCount, 
            addVisible,
            deviceTypeList
        } = this.state;
        const paginationProps = {
            showQuickJumper: true,
            total:itemCount,
            // 传递页码
            onChange: (page) => this._pageChange(page)
        };
        return(      
            <React.Fragment>
                <div className={styles.header}>
                    <span>|</span>预警规则
                </div>
                <div className={styles.searchForm}>
                    <div className={styles.buttonGroup}>
                        <Button
                            icon='plus'
                            className={styles.fnButton}
                            onClick={()=>this.addRules()}
                        >
                            添加预警规则
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
                <Modal
                    className={styles.addModal}
                    visible={addVisible}
                    title="选择设备类型"
                    cancelText='取消'
                    okText='下一步'
                    onOk={()=>this._addNext()}
                    onCancel={()=>this._addCancel()}
                    centered
                >
                    <div>
                    <span className={styles.title}>设备类型</span>
                    <Select
                        onChange={(value)=>this.selectDeviceType(value)}
                        placeholder='请选择设备类型'
                    >
                        {
                            deviceTypeList.map((v,i)=>{
                                // console.log(v)
                                return(
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
            </React.Fragment>
        )
    }
}

    