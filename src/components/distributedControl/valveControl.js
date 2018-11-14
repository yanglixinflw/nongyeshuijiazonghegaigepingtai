import React,{Component} from 'react';
import styles from "./valveControl.less"
import { Input, Button, Form, Cascader, Table, Divider,Select} from 'antd';
import { Link } from 'dva/router';
//开发地址
const envNet='http://192.168.30.127:88';
//生产环境
// const envNet='';
//设备安装地列表
const installAddrUrl=`${envNet}/api/BaseInfo/installAddrList`
//表头
const tableTitle=[
    {index:"valveType",item:"设备型号"},
    {index:"id",item:"设备ID"},
    {index:"name",item:"设备名称"},
    {index:"area",item:"设备安装地"},
    {index:"build",item:"关联建筑物"},
    {index:"inter",item:"网络"},
    {index:"electric",item:"电量"},
    {index:"state",item:"状态"},
    {index:"updateTime",item:"更新时间"},
]
//假数据
const data=[
    {valveType:"大禹水阀",id:"123456789",name:"宁圩村水阀",area:"杭州市-萧山区-宁围街道",build:"一号闸阀井",inter:"正常",electric:"90%",state:"A开",updateTime:"2018-07-02 08:09:21"},
    {valveType:"大禹水阀",id:"123456789",name:"宁圩村水阀",area:"杭州市-萧山区-宁围街道",build:"一号闸阀井",inter:"正常",electric:"90%",state:"B开",updateTime:"2018-07-02 08:09:21"},
    {valveType:"大禹水阀",id:"123456789",name:"宁圩村水阀",area:"杭州市-萧山区-宁围街道",build:"一号闸阀井",inter:"正常",electric:"90%",state:"B开",updateTime:"2018-07-02 08:09:21"},
    {valveType:"大禹水阀",id:"123456789",name:"宁圩村水阀",area:"杭州市-萧山区-宁围街道",build:"一号闸阀井",inter:"正常",electric:"90%",state:"全关",updateTime:"2018-07-02 08:09:21"},
    {valveType:"大禹水阀",id:"123456789",name:"宁圩村水阀",area:"杭州市-萧山区-宁围街道",build:"一号闸阀井",inter:"正常",electric:"90%",state:"A开",updateTime:"2018-07-02 08:09:21"},
    {valveType:"大禹水阀",id:"123456789",name:"宁圩村水阀",area:"杭州市-萧山区-宁围街道",build:"一号闸阀井",inter:"正常",electric:"90%",state:"A开",updateTime:"2018-07-02 08:09:21"},
]
const { Option } = Select;
export default class extends Component{
    constructor(props) {
        super(props)
        const valveControl=data;
        var tableData=[],tableIndex=[];//数据表的item 和 index
        tableTitle.map(v=>{
            tableData.push(v.item);
            tableIndex.push(v.index)
        })
        this.state={
            valveControl,
            items:valveControl,
            tableTitle,
            tableDatas:[],
            columns: [],
            rowSelection:{},
            title:tableTitle,
            //设备安装地列表
            installAddrList:[],
        }
    }
    componentDidMount() {
        this._getTableDatas(this.state.title, this.state.items);
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
                valveType:v.valveType,
                id:v.id,
                name:v.name,
                area:v.area,
                build:v.build,
                inter:v.inter,
                electric:v.electric,
                state:v.state,
                updateTime:v.updateTime,
                key: i,
            });
        })
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            onSelect: (record, selected, selectedRows) => {
              console.log(record, selected, selectedRows);
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
              console.log(selected, selectedRows, changeRows);
            },
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
                        <Button
                            className={styles.set}
                            // onClick={() => this._set()}
                            icon='tool'
                        >
                            操作
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
            //搜索字段
            // if(values.waringType=="waringType"){
            //     values.waringType=''
            // }
            // if(values.warningStatus=="state"){
            //     values.warningStatus=''
            // }
            // if(values.deviceId==undefined){
            //     values.deviceId=''
            // }
            // if(values.installAddr=='installAddress'){
            //     values.installAddr=''
            // }
            // if(values.building==undefined){
            //     values.building=''
            // }
            return fetch(dataUrl, {
                ...postOption,
                body: JSON.stringify({
                    // "waringType": values.waringType,
                    // "warningStatus": values.warningStatus,
                    // "deviceId": values.deviceId,
                    // "installAddr": values.installAddr,
                    // "building": values.building,
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
        form.resetFields(); // 重置表单
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
    render(){
        const { columns, tableDatas, installAddrList,rowSelection} = this.state;
        const paginationProps = {
            showQuickJumper: true,
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
                            {...{installAddrList}}
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
                </div>
            </React.Fragment>
        )
    }
}
//搜索表单
const SearchForm = Form.create()(
    class extends React.Component {
        render() {
            const { form, searchHandler, resetHandler, installAddrList} = this.props;
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
                        {getFieldDecorator('installAddr', {initialValue:'installAddress'})
                            (
                            <Select>
                                <Option value='installAddress'>大禹阀门</Option>
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
                        {getFieldDecorator('installAddr', {initialValue:'installAddress'})
                            (
                            <Select>
                                <Option value='installAddress'>设备安装地</Option>
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
                        {getFieldDecorator('build', {})
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