import React,{Component} from 'react';
import styles from "./dealRecord.less"
import { Input, Button, Form, Table,Select,message,Icon } from 'antd';
import { Link } from 'dva/router';
import { parse } from 'qs';
//头信息
const tableTitle=[
    {index:"transactionId",item:"交易编号"},
    {index:"operateUserName",item:"操作人"},
    {index:"transactionType",item:"类型"},
    {index:"money",item:"交易金额"},
    {index:"balance",item:"账户余额"},
    {index:"status",item:"交易状态"},
    {index:"transactionTime",item:"交易时间"},
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
        const{dealRecord}=props;
        this.state={
            //小组id
            userId,
            //表头
            title:tableTitle,
            itemCount:dealRecord.data.data.itemCount,//总数据数
            data:dealRecord.data.data.items,//表格数据源
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
                transactionId:v.transactionId,
                operateUserName:v.operateUserName,
                transactionType:v.transactionType,
                money:v.money,
                balance:v.balance,
                status:v.status,
                transactionTime:v.transactionTime,
                key: i,
            });
        })
        this.setState({
            columns,
            tableDatas
        });
    }
  // 搜索功能
  _searchTableData() {
    const { title,userId } = this.state;
    const form = this.searchForm.props.form;
    form.validateFields((err, values) => {
      // 未定义时给空值
      if (err) {
        return
      }
      return fetch(dataUrl, {
        ...postOption,
        body: JSON.stringify({
          "feeUserId": userId,
          "transactionId": values.transactionId,
          "transactionType":values.transactionType,
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
