import React,{Component} from 'react';
import styles from "./groupManage.less"
import { Input, Button, Form, Table,Select,message,Icon,Checkbox, Row, Col} from 'antd';
import { Link } from 'dva/router';
import { parse } from 'qs';
//头信息
const tableTitle=[
    {index:"realName",item:"姓名"},
    {index:"mobilePhone",item:"电话"},
    {index:"idCard",item:"身份证"},
    {index:"areaName",item:"归属地区"},
]
//开发地址
const envNet='http://192.168.30.127:88';
//生产环境
// const envNet='';
//小组账户数据
const dataUrl=`${envNet}/fee/groupAccount/getGroupMembers`;
//获取归属地地址
const areaUrl=`${envNet}/api/Area/list`;
//保存数据接口
const saveUrl=`${envNet}/fee/groupAccount/SaveMembers`;
// post通用设置
let postOption = {
    method: 'POST',
    credentials: "include",
    mode: 'cors',
    headers: new Headers({
        'Content-Type': 'application/json',
    }),
}
export default class extends Component{
    constructor(props) {
        super(props)
        let groupId = parse(window.location.href.split(':'))[3];
        const{groupManage}=props.groupManage;
        const{farmersInfo}=props.groupManage
        // console.log(groupManage)
        this.state={
            //小组id
            groupId,
            //小组成员
            groupMember:groupManage.data.data,
            //表头信息
            title:tableTitle,
            itemCount:farmersInfo.data.data.itemCount,//总数据数
            data:farmersInfo.data.data.items,//表格数据源
            //表的每一列
            columns: [],
            //归属地去列表
            areaList:[],
            //选中的表格行
            rowSelection:{},
            //选中行的数组
            selectedRows:[],
            //选中的多选数组（其值为groupMember的id）
            checkedValue:[]
        }
    }
    componentDidMount() {
        this._getTableDatas(this.state.title, this.state.data);
        return (
            fetch(areaUrl, {
                ...postOption,
            }).then((res) => {
                Promise.resolve(res.json())
                    .then((v) => {
                        if (v.ret == 1) {
                            let areaList = v.data
                            this.setState({
                                areaList
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
        title.map(v => {
            columns.push({
                title: v.item,
                // 给表头添加字段名 必须一一对应
                dataIndex: v.index,
                align: 'center',
                className: `${styles.tbw}`
            })
        })
        let tableDatas = [];
        //表单数据
        data.map((v, i) => {
            tableDatas.push({
                realName:v.realName,
                mobilePhone:v.mobilePhone,
                idCard:v.idCard,
                areaName:v.areaName,
                userId:v.userId,
                key: i,
            });
        })
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
            //   console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
              this.setState({
                selectedRows
              })
            },
            // onSelect: (record, selected, selectedRows) => {
            //   console.log(record, selected, selectedRows);
            // },
            // onSelectAll: (selected, selectedRows, changeRows) => {
            //   console.log(selected, selectedRows, changeRows);
            // },
        };
        this.setState({
            columns,
            tableDatas,
            rowSelection
        });
    }
    //多选框选中项
    onChange(checkedValues){
        // console.log(checkedValues);
        this.setState({
            checkedValue:checkedValues
        })
    }
    //将右边的选中项移到左边
    push(){
        const{groupMember,selectedRows}=this.state
        // console.log(this.state.groupMember)
        // console.log(this.state.selectedRows)
        selectedRows.map((v,i)=>{
            groupMember.push({memberUserId:v.userId,mobilePhone:v.mobilePhone,realName:v.realName,idCard:v.idCard,areaName:v.areaName})
        })
        this.setState({
            groupMember
        })
    }
    //将左边的选中项移除
    remove(){
        const{checkedValue,groupMember}=this.state
        //如果什么都没选
        if(checkedValue==''){
            return
        }
        //grouoMember只可读，所以将它赋值给group
        var group=groupMember
        //移除选中项
        var array = checkedValue.map((v,i)=>{
            group = group.filter(item => item.memberUserId !==v);
            return group
        })
        //得到移除选中项后的数组
        var arr=array[array.length-1]
        this.setState({
            groupMember:arr
        })
    }
    //保存
    _save(){
        const{groupId,groupMember}=this.state;
        // console.log(groupMember)
        var peasantIds=[]
        groupMember.map(v=>{
            peasantIds.push(v.memberUserId)
        })
        // console.log(peasantIds)
        fetch(saveUrl,{
            ...postOption,
            body:JSON.stringify({
                "groupUserId":groupId,
                peasantIds
            })
        }).then(res=>{
            Promise.resolve(res.json())
            .then(v=>{
                if(v.ret==1){
                    fetch(dataUrl,{
                        ...postOption,
                        body:JSON.stringify({
                            "groupUserId":groupId
                        })
                    }).then(res=>{
                        Promise.resolve(res.json())
                        .then(v=>{
                            if(v.ret==1){
                                let groupMember=v.data
                                this.setState({
                                    groupMember
                                })
                                message.success("保存成功",2)
                            }
                        })
                    })
                }
            })
        })
    }
    render(){
        const{groupMember,areaList,columns,tableDatas,rowSelection,groupId}=this.state
        return(
            <React.Fragment>
                <div className={styles.groupManage}>
                    <div className={styles.headers}>
                        <div className={styles.left}>
                            <Link to={`/rent/groupAccount`}>
                                <div className={styles.arrowLeft}>
                                    <Icon type="arrow-left" theme="outlined" style={{marginTop:'22px',fontSize:'18px'}}/>
                                    <div>小组账户</div>
                                </div>
                            </Link>
                            <Link to={`/groupAccount/groupManage:${groupId}`}>
                                <div className={styles.autoControl}>
                                    <div>/</div>
                                    <div className={styles.autoRules}>用水小组管理</div>
                                </div>
                            </Link>
                        </div>
                        <div className={styles.right}>
                            <Button
                                className={styles.fnButton}
                                icon="save"
                                onClick={() => this._save()}
                            >
                                保存
                            </Button>
                        </div>
                    </div>
                    <div className={styles.body}>
                        <div className={styles.mleft}>
                            <div className={styles.title}>
                                <div className={styles.border}></div>
                                <div className={styles.mleftName}>小组成员</div>
                            </div>
                            <div className={styles.content}>
                                <Checkbox.Group onChange={(checkedValues)=>this.onChange(checkedValues)}>
                                    <Row>
                                        {groupMember.map((v,i)=>{
                                            return(
                                                <Col key={i}>
                                                    <Checkbox value={v.memberUserId}>
                                                        <ul>
                                                            <li title={v.realName}>姓名：{v.realName}</li>
                                                            <li title={v.mobilePhone}>电话：{v.mobilePhone}</li>
                                                            <li title={v.areaName}>所属片区：{v.areaName}</li>
                                                            <li title={v.idCard}>身份证：{v.idCard}</li>
                                                        </ul>
                                                    </Checkbox>
                                                </Col>
                                            )}    
                                        )} 
                                   </Row>
                                </Checkbox.Group>    
                            </div>
                        </div>
                        <div className={styles.middle}>
                            <div className={styles.btnL} onClick={()=>this.push()}>&lt;</div>
                            <div className={styles.btnR} onClick={()=>this.remove()}>&gt;</div>
                        </div>
                        <div className={styles.mright}>
                            <div className={styles.title}>
                                <div className={styles.border}></div>
                                <div className={styles.mleftName}>农户</div>
                            </div>
                            <div className={styles.tables}>
                                <div className={styles.searchForm}>
                                    {/* 表单信息 */}
                                    <SearchForm
                                        wrappedComponentRef={(searchForm) => this.searchForm = searchForm}
                                        {...{areaList}}
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
                                    </div> 
                                </div>
                                <Table
                                    columns={columns}
                                    className={styles.table}
                                    rowSelection={rowSelection}
                                    dataSource={tableDatas}
                                    scroll={{y: 490}}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
//搜索表单
const SearchForm = Form.create()(
    class extends React.Component {
        render() {
            const { form, areaList} = this.props;
            const { getFieldDecorator } = form;
            const Option = Select.Option;
            if (areaList.length == 0) {
                return null
            }
            return (
                <Form 
                    layout='inline'
                    style={{
                        display: 'flex',
                        alignItems:"center",
                        flexWrap:"wrap",
                        marginRight:'10px'
                    }}>
                    <Form.Item>
                        {getFieldDecorator('realName', {})
                            (
                            <Input
                                placeholder='姓名'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('mobilePhone', {})
                            (
                            <Input
                                placeholder='手机'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('idCard', {})
                            (
                            <Input
                                placeholder='身份证'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('areaId', {})
                            (
                            <Select
                                placeholder='归属地区'
                            >
                                <Option value="">全部</Option>
                                {areaList.map((v, i) => {
                                    return (
                                        <Option key={i} value={v.areaId}>{v.areaName}</Option>
                                    )

                                })}
                            </Select>
                            )
                        }
                    </Form.Item>
                </Form>
            )
        }
    }
)