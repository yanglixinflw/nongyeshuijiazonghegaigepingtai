import React,{Component} from 'react';
import styles from "./groupManage.less"
import { Input, Button, Form,Select,message,Icon,Checkbox, Row, Col} from 'antd';
import { Link } from 'dva/router';
import classnames from 'classnames'
import { parse } from 'qs';
import { timeOut } from '../../utils/timeOut';
import {ENVNet,postOption} from '../../services/netCofig'
import InfiniteScroll from 'react-infinite-scroller';
//头信息
const tableTitle=[
    {index:"realName",item:"姓名"},
    {index:"mobilePhone",item:"电话"},
    {index:"idCard",item:"身份证"},
    {index:"areaName",item:"归属地区"},
]
//小组账户数据
const dataUrl=`${ENVNet}/fee/groupAccount/getGroupMembers`;
//获取归属地地址
const areaUrl=`${ENVNet}/api/Area/list`;
//保存数据接口
const saveUrl=`${ENVNet}/fee/groupAccount/SaveMembers`;
//农户信息接口
const farmerUrl=`${ENVNet}/api/PeasantMgr/list`;

export default class extends Component{
    constructor(props) {
        super(props)
        let groupId = parse(window.location.href.split(':'))[3];
        const{groupManage}=props.groupManage;
        const{farmersInfo}=props.groupManage
        this.state={
            //小组id
            groupId,
            //小组成员
            groupMember:groupManage.data.data,
            //表头信息
            title:tableTitle,
            itemCount:farmersInfo.data.data.itemCount,//总数据数
            data:farmersInfo.data.data.items,//表格数据源
            //归属地去列表
            areaList:[],
            //选中的表格行
            rowSelection:{},
            //选中行的数组
            selectedRows:[],
            //选中的多选数组（其值为groupMember的id）
            checkedValue:[],
            //搜索初始值
            searchValue:{},
            hasMore: true,// 判断接口是否还有数据，通过接口设置
            //当前页
            pageIndex:0,
            //样式控制
            indeterminate: true,
            //选中农户的数组
            checkedList: [],
            // //所有农户成员数组
            // plainOptions

        }  
    }
    componentDidMount() {       
        this.handleScroll();
        return (
            fetch(areaUrl, {
                ...postOption,
            }).then((res) => {
                Promise.resolve(res.json())
                    .then((v) => {
                         //超时判断
                        timeOut(v.ret)
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
    // 处理滚动监听
    handleScroll(){
        const {itemCount,data,groupMember} = this.state;
        console.log(itemCount,groupMember.length)
        let pageIndex=this.state.pageIndex;
        pageIndex=++pageIndex
        if (data.length+groupMember.length == itemCount) {
            message.warning('已加载完全');
            this.setState({
            hasMore: false,
            });
            return;
        }
        fetch(farmerUrl,{
            ...postOption,
            body:JSON.stringify({
                pageIndex:pageIndex,
                pageSize:10
            })
        }).then(res=>{
            Promise.resolve(res.json())
            .then(v=>{
                if(v.ret==1){
                    let data=this.state.data.concat(v.data.items)
                    this.setState({
                        data,
                        pageIndex
                    })
                }
            })
        })
        this._getTableDatas()
    }
    _getTableDatas() {
        const {groupMember} = this.state
        //移除农户数组中的与小组账户相同的项
        var datas = this.state.data.filter(item => !groupMember.some(v => v.idCard === item.idCard))
        this.setState({
            data:datas,
        });
    }

    //右边选中项
    onChecked(val) {
        this.setState({
          checkedList:val
        });
      }
    //左边多选框选中项
    onChange(value){
        this.setState({
            checkedValue:value
        })
    }
    //将右边的选中项移到左边
    push(){
        const{groupMember,data}=this.state
        var checkedList=this.state.checkedList
        if(checkedList==''){
            return
        }
        //将选中的行push到小组成员数组中
        checkedList.map((v,i)=>{
            groupMember.push({memberUserId:v.userId,mobilePhone:v.mobilePhone,realName:v.realName,idCard:v.idCard,areaName:v.areaName,key:i})
        })
        var groupArr = [];//新数组(定义一个新数组用于去重)
        var groupObj = {};
        //小组成员（对象）数组去重
        for(var i =0; i<groupMember.length; i++){
            if(!groupObj[groupMember[i].idCard]){
                groupArr.push(groupMember[i]);
                groupObj[groupMember[i].idCard] = true;
            }
        }
        // //移除农户数组中的与小组账户相同的项
        var datas = data.filter(item => !groupMember.some(v => v.idCard === item.idCard))
        this.setState({
            groupMember:groupArr,
            data:datas,
            checkedList:[]
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
        // console.log(arr)
        this.setState({
            groupMember:arr,
            checkedValue:[]
        })
        let pageIndex=0
        fetch(farmerUrl,{
            ...postOption,
            body:JSON.stringify({
                "pageIndex": pageIndex,
                "pageSize": 10
            })
        }).then(res=>{
            Promise.resolve(res.json())
            .then(v=>{
                timeOut(v.ret)
                if(v.ret==1){
                    let data=v.data.items
                    this.setState({
                        data,
                        pageIndex
                    })
                    this._getTableDatas()
                    this.handleScroll()
                }
            })
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
                 //超时判断
                timeOut(v.ret)
                if(v.ret==1){
                    fetch(dataUrl,{
                        ...postOption,
                        body:JSON.stringify({
                            "groupUserId":groupId
                        })
                    }).then(res=>{
                        Promise.resolve(res.json())
                        .then(v=>{
                            //超时判断
                            timeOut(v.ret)
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
    // 搜索功能
    _searchTableData() {
        const form = this.searchForm.props.form;
        form.validateFields((err, values) => {
            // 未定义时给空值
            if (err) {
                return
            }
            return fetch(farmerUrl, {
                ...postOption,
                body: JSON.stringify({
                    "name": values.realName,
                    "mobile": values.mobilePhone,
                    "idCard": values.idCard,
                    "areaId": values.areaId,
                    "pageSize": 10
                })
            }).then(res => {
                Promise.resolve(res.json())
                    .then(v => {
                         //超时判断
                        timeOut(v.ret)
                        if (v.ret == 1) {
                            // 设置页面显示的元素
                            let data = v.data.items
                            this.setState({
                                data
                            })
                            this._getTableDatas(data);
                        }
                    })
            }).catch(err => {
                console.log(err)
            })
        })
    }
    //重置
    _resetForm() {
        const form = this.searchForm.props.form;
        let pageIndex=0
        // 重置表单
        form.resetFields();
        return fetch(farmerUrl, {
            ...postOption,
            body: JSON.stringify({
                "pageIndex":pageIndex,
                "pageSize": 10
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                     //超时判断
                    timeOut(v.ret)
                    if (v.ret == 1) {
                        let data = v.data.items;
                        this.setState({
                            data,
                            pageIndex
                        })
                        this._getTableDatas();
                        this.handleScroll()
                    }
                })
        })
    }
    render(){
        const{groupMember,areaList,groupId,data,title,checkedList,checkedValue}=this.state    
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
                                <Checkbox.Group value={checkedValue} onChange={(value)=>this.onChange(value)}>
                                    <Row>
                                        {groupMember.map((v,i)=>{
                                            return(
                                                <Col key={i}>
                                                    <Checkbox value={v.memberUserId}>
                                                        <div>
                                                            <ul>
                                                                <li title={v.realName}><i className={classnames('dyhsicon', 'dyhs-xingming', `${styles.AccountIcon}`)}></i> {v.realName}</li>
                                                                <li title={v.mobilePhone}><i className={classnames('dyhsicon', 'dyhs-dianhua', `${styles.AccountIcon}`)}></i> {v.mobilePhone}</li>
                                                            </ul>
                                                            <ul>
                                                                <li title={v.idCard}><i className={classnames('dyhsicon', 'dyhs-shenfenzheng', `${styles.AccountIcon}`)}></i> {v.idCard}</li>
                                                                <li title={v.areaName}><i className={classnames('dyhsicon', 'dyhs-anzhuangdi', `${styles.AccountIcon}`)}></i> {v.areaName}</li>
                                                            </ul>
                                                        </div>
                                                    </Checkbox>
                                                </Col>
                                            )}    
                                        )} 
                                   </Row>
                                </Checkbox.Group>    
                            </div>
                        </div>
                        <div className={styles.middle}>
                            <Button type="primary" className={styles.btnL} onClick={()=>this.push()}><i className={classnames('dyhsicon', 'dyhs-xiangyou1')}></i></Button>
                            <Button type="primary" className={styles.btnR} onClick={()=>this.remove()}><i className={classnames('dyhsicon', 'dyhs-xiangyou1')}></i></Button>
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
                                    </div> 
                                </div>
                                <div className={styles.listHead}>
                                    <Checkbox
                                        // indeterminate={this.state.indeterminate}
                                        // onChange={(e)=>this.onCheckAllChange(e)}
                                        // checked={checkAll}
                                    >
                                        {   
                                            title.map((v,i)=>{
                                                return(
                                                    <div key={i}>{v.item}</div>
                                                )
                                            })
                                        }
                                    </Checkbox>
                                </div>
                                <div className={styles.list} style={{height:"500px",overflow:"auto"}}>  
                                    <InfiniteScroll
                                        initialLoad={false}
                                        pageStart={0}
                                        loadMore={()=>this.handleScroll()}
                                        hasMore={true || false}
                                        useWindow={false}
                                    >
                                        <Checkbox.Group value={checkedList} onChange={(val)=>this.onChecked(val)}>
                                            <Row>
                                                {data.map((v,i)=>{
                                                    return(
                                                        <Col key={i}>
                                                            <Checkbox value={v}>
                                                                <div>
                                                                    <ul>
                                                                        <li title={v.realName}>{v.realName}</li>
                                                                        <li title={v.mobilePhone}>{v.mobilePhone}</li>
                                                                        <li title={v.idCard}>{v.idCard}</li>
                                                                        <li title={v.areaName}>{v.areaName}</li>
                                                                    </ul>
                                                                </div>
                                                            </Checkbox>
                                                        </Col>
                                                    )}    
                                                )} 
                                        </Row>
                                        </Checkbox.Group> 
                                    </InfiniteScroll>
                                </div>
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
