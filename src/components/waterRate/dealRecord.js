import React,{Component} from 'react';
import styles from "./dealRecord.less"
import { Input, Button, Form, Table,Select,message,Icon } from 'antd';
import { Link } from 'dva/router';
import { parse } from 'qs';
//头信息
const tableTitle=[
    {index:"dealNum",item:"交易编号"},
    {index:"optionName",item:"操作人"},
    {index:"type",item:"类型"},
    {index:"dealSum",item:"交易金额"},
    {index:"balance",item:"账户余额"},
    {index:"dealStatus",item:"交易状态"},
    {index:"dealTime",item:"交易时间"},
]
//假数据
const data=[
    {dealNum:"99303949930391",optionName:"张三",type:'充值',dealSum:"2.22",balance:"99.99",dealStatus:'交易成功',dealTime:"2018/09/23  09:03:32"},
    {dealNum:"99303949930392",optionName:"张三",type:'充值',dealSum:"2.22",balance:"99.99",dealStatus:'交易成功',dealTime:"2018/09/23  09:03:32"},
    {dealNum:"99303949930393",optionName:"张三",type:'充值',dealSum:"2.22",balance:"99.99",dealStatus:'交易成功',dealTime:"2018/09/23  09:03:32"},
    {dealNum:"99303949930394",optionName:"张三",type:'充值',dealSum:"2.22",balance:"99.99",dealStatus:'交易成功',dealTime:"2018/09/23  09:03:32"},
    {dealNum:"99303949930395",optionName:"张三",type:'充值',dealSum:"2.22",balance:"99.99",dealStatus:'交易成功',dealTime:"2018/09/23  09:03:32"},
    {dealNum:"99303949930396",optionName:"张三",type:'充值',dealSum:"2.22",balance:"99.99",dealStatus:'交易成功',dealTime:"2018/09/23  09:03:32"},
]
import {ENVNet} from '../../services/netCofig'
// post通用设置
let postOption = {
    method: 'POST',
    credentials: "include",
    mode: 'cors',
    headers: new Headers({
        'Content-Type': 'application/json',
    }),
}
let userId = parse(window.location.href.split(':'))[3];
export default class extends Component{
    constructor(props) {
        super(props)
        this.state={
            //小组id
            userId,
            //数据源
           data,
           //表头信息
           title:tableTitle,
           //列
           columns:[]
        }
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
        let tableDatas = [];
        //表单数据
        data.map((v, i) => {
            tableDatas.push({
                dealNum:v.dealNum,
                optionName:v.optionName,
                type:v.type,
                dealSum:v.dealSum,
                balance:v.balance,
                dealStatus:v.dealStatus,
                dealTime:v.dealTime,
                key: i,
            });
        })
        this.setState({
            columns,
            tableDatas
        });
    }
    render(){
        const{columns,tableDatas,userId}=this.state
        return(
            <React.Fragment>
                <div className={styles.dealRecord}>
                    <div className={styles.headers}>
                        <div className={styles.left}>
                            <Link to={`/rent/groupAccount`}>
                                <div className={styles.arrowLeft}>
                                    <Icon type="arrow-left" theme="outlined" style={{marginTop:'22px',fontSize:'18px'}}/>
                                    <div>小组账户</div>
                                </div>
                            </Link>
                            <Link to={`/groupAccount/dealRecord:${userId}`}>
                                <div className={styles.autoControl}>
                                    <div>/</div>
                                    <div className={styles.autoRules}>交易记录</div>
                                </div>
                            </Link>
                        </div>
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
                                onClick={() => this._searchTableData()}
                            >
                                搜索
                            </Button>
                            <Button
                                icon='upload'
                                className={styles.fnButton}
                                // onClick={() => this.upload()}
                            >
                                数据导出
                            </Button>
                        </div> 
                    </div>
                    <Table
                        columns={columns}
                        className={styles.table}
                        dataSource={tableDatas}
                        // scroll={{x: 490}}
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
            const Option = Select.Option;
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
                        {getFieldDecorator('dealNum', {})
                            (
                            <Input
                                placeholder='交易编号'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('type', {})
                            (
                            <Select
                                placeholder='类型'
                            >
                                <Option value="">全部</Option>
                                <Option value="1">充值</Option>
                                <Option value="2">消费</Option>
                            </Select>
                            )
                        }
                    </Form.Item>
                </Form>
            )
        }
    }
)