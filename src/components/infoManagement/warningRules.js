import { Component } from 'react';
import styles from "./warningRules.less"
import { Input, Button, Form, Cascader, Table, Modal} from 'antd';
//ip地址
const envNet='http://192.168.30.127:88';
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
//头信息
const tableTitle=[
    {index:"deviceTypeName",item:"设备型号"},
    {index:"name",item:"规则名称"},
]
export default class extends Component{
    constructor(props){
        super(props)
        const {warningRules}=props;
        // console.log(this.props)
        this.state = {
            //表头数据
            tableTitle,
            title:tableTitle,
            itemCount:warningRules.data.data.itemCount,//总数据数
            data:warningRules.data.data.items,//表格数据源
            //表的每一列
            columns: [],
            //搜索框初始值
            searchValue: {
                "pageIndex": 0,
                "pageSize":10
            },
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
            })
        })
        //操作列
        columns.push({
            title: '操作',
            key: 'action',
            align: 'center',
            fixed: 'right',
            width: 200,
            render: (record) => {
                return (
                    <span className={styles.option}>
                        <Button
                            className={styles.edit}
                            onClick={() => this.ruleDetails()}
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
                        <Button
                            className={styles.editPsw}
                            icon='appstore'
                        >
                            批量应用
                        </Button>
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
                key: i,
            });
        })
        this.setState({
            columns,
            tableDatas,
        });
    }
    _pageChange(page){
        const { searchValue } = this.state;
        searchValue.pageIndex = page - 1;
        return fetch(dataUrl, {
            ...postOption,
            body: JSON.stringify({
                ...searchValue
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
        const { columns, tableDatas,itemCount } = this.state;
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
            </React.Fragment>
        )
    }
}

    