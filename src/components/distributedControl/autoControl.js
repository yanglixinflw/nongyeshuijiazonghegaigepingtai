import React,{Component} from 'react';
import styles from "./autoControl.less"
import { Input, Button, Form, Cascader, Table, Divider} from 'antd';
import { Link } from 'dva/router';
const tableTitle=[
    {index:"num",item:"自动化编号"},
    {index:"name",item:"自动化名称"},
    {index:"rule",item:"规则"},
    {index:"state",item:"状态"},
    {index:"updateTime",item:"更新时间"},
]
const data=[
    {num:"1231",name:"宁围街道蓄水池自动化蓄水",rule:"当...",state:"启用",updateTime:"2018-07-02 08:09:21"},
    {num:"1232",name:"宁围街道蓄水池自动化蓄水",rule:"当...",state:"停用",updateTime:"2018-07-02 08:09:21"},
    {num:"1233",name:"宁围街道蓄水池自动化蓄水",rule:"当...",state:"启用",updateTime:"2018-07-02 08:09:21"},
    {num:"1234",name:"宁围街道蓄水池自动化蓄水",rule:"当...",state:"停用",updateTime:"2018-07-02 08:09:21"},
    {num:"1235",name:"宁围街道蓄水池自动化蓄水",rule:"当...",state:"启用",updateTime:"2018-07-02 08:09:21"},
    {num:"1236",name:"宁围街道蓄水池自动化蓄水",rule:"当...",state:"停用",updateTime:"2018-07-02 08:09:21"}
]
export default class extends Component{
    constructor(props) {
        super(props)
        const autoControl=data;
        var tableData=[],tableIndex=[];//数据表的item 和 index
        tableTitle.map(v=>{
            tableData.push(v.item);
            tableIndex.push(v.index)
        })
        this.state={
            autoControl,
            items:autoControl,
            tableTitle,
            tableDatas:[],
            columns: [],
            title:tableTitle
        }
    }
    componentDidMount() {
        this._getTableDatas(this.state.title, this.state.items);
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
                num:v.num,
                name:v.name,
                rule:v.rule,
                state:v.state,
                updateTime:v.updateTime,
                key: i,
            });
        })
        this.setState({
            columns,
            tableDatas,
        });
        //操作列
        columns.push({
            title: '操作',
            key: 'action',
            align: 'center',
            fixed: 'right',
            width: 100,
            render: (record) => {
                return (
                    <span className={styles.option}>
                        <Link to={`/automation/autoRules`}>
                            <Button
                                className={styles.set}
                                // onClick={() => this._set()}
                                icon='setting'
                            >
                                设置自动化规则
                            </Button>
                        </Link>
                        <Button
                            className={styles.stop}
                            icon='stop'
                        >
                            停用
                        </Button>
                        <Button
                            className={styles.edit}
                            icon='edit'
                        >
                            修改
                        </Button>
                        <Button
                        className={styles.delete}
                            icon='delete'
                        >
                            删除
                        </Button>
                        
                    </span>
                )
            }
        })
    }
    //搜索功能
    _searchTableDatas() {
        const form = this.searchForm.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return
            }
            // console.log(values)
        })
    }
    //重置
    _resetForm() {
        const form = this.searchForm.props.form;
        // 重置表单
        form.resetFields();
    }
    render(){
        const { columns, tableDatas } = this.state;
        const paginationProps = {
            showQuickJumper: true,
        };
        return(
            <React.Fragment>
                <div className={styles.header}>
                    <span>|</span>自动化控制
                </div>
                <div className={styles.searchForm}>
                    {/* 表单信息 */}
                    <SearchForm
                        wrappedComponentRef={(searchForm) => this.searchForm = searchForm}
                        searchHandler={() => this._searchTableDatas()}
                        resetHandler={() => this._resetForm()}
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
//搜索表单
const SearchForm = Form.create()(
    class extends React.Component {
        render() {
            const { form, searchHandler, resetHandler } = this.props;
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
                        {getFieldDecorator('num', {})
                            (
                            <Input
                                placeholder='自动化编号'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
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