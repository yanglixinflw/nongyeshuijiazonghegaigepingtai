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
//开发地址
const envNet='http://192.168.30.127:88';
//生产环境
// const envNet='';
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
        this.state={
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
        const{columns,tableDatas}=this.state
        return(
            <React.Fragment>
                <div className={styles.dealRecord}>
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
// //搜索表单
// const SearchForm = Form.create()(
//     class extends React.Component {
//         render() {
//             const { form, areaList} = this.props;
//             const { getFieldDecorator } = form;
//             const Option = Select.Option;
//             if (areaList.length == 0) {
//                 return null
//             }
//             return (
//                 <Form 
//                     layout='inline'
//                     style={{
//                         display: 'flex',
//                         alignItems:"center",
//                         flexWrap:"wrap",
//                         marginRight:'10px'
//                     }}>
//                     <Form.Item>
//                         {getFieldDecorator('realName', {})
//                             (
//                             <Input
//                                 placeholder='姓名'
//                                 type='text'
//                             />
//                             )
//                         }
//                     </Form.Item>
//                     <Form.Item>
//                         {getFieldDecorator('mobilePhone', {})
//                             (
//                             <Input
//                                 placeholder='手机'
//                                 type='text'
//                             />
//                             )
//                         }
//                     </Form.Item>
//                     <Form.Item>
//                         {getFieldDecorator('idCard', {})
//                             (
//                             <Input
//                                 placeholder='身份证'
//                                 type='text'
//                             />
//                             )
//                         }
//                     </Form.Item>
//                     <Form.Item>
//                         {getFieldDecorator('areaId', {})
//                             (
//                             <Select
//                                 placeholder='归属地区'
//                             >
//                                 <Option value="">全部</Option>
//                                 {areaList.map((v, i) => {
//                                     return (
//                                         <Option key={i} value={v.areaId}>{v.areaName}</Option>
//                                     )

//                                 })}
//                             </Select>
//                             )
//                         }
//                     </Form.Item>
//                 </Form>
//             )
//         }
//     }
// )