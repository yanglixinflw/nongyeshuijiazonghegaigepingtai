import React,{Component} from 'react';
import styles from "./groupAccount.less"
import { Input, Button, Form, Cascader, Table, Divider,Select,} from 'antd';
const tableTitle=[
    {index:"id",item:"设备ID"},
    {index:"name",item:"设备名称"},
    {index:"groupName",item:"小组"},
    {index:"member",item:"小组成员"},
    {index:"amount",item:"账户余额"},
    {index:"useLevel",item:"当前用量"},
    {index:"waterRight",item:"剩余水权"},
    {index:"updateTime",item:"更新时间"},
]
const data=[
    {id:"435676651",name:" 宁圩村1#水表",groupName:"未命名",member:"张三；李四；王五",amount:"99.99",useLevel:"99",waterRight:"33",updateTime:"2018/09/23  09:03:32"},
    {id:"435676652",name:" 宁圩村2#水表",groupName:"未命名",member:"张三；李四；王五",amount:"99.99",useLevel:"99",waterRight:"33",updateTime:"2018/09/23  09:03:32"},
    {id:"435676653",name:" 宁圩村3#水表",groupName:"未命名",member:"张三；李四；王五",amount:"99.99",useLevel:"99",waterRight:"33",updateTime:"2018/09/23  09:03:32"},
    {id:"435676654",name:" 宁圩村4#水表",groupName:"未命名",member:"张三；李四；王五",amount:"99.99",useLevel:"99",waterRight:"33",updateTime:"2018/09/23  09:03:32"},
    {id:"435676655",name:" 宁圩村5#水表",groupName:"未命名",member:"张三；李四；王五",amount:"99.99",useLevel:"99",waterRight:"33",updateTime:"2018/09/23  09:03:32"},
    {id:"435676656",name:" 宁圩村6#水表",groupName:"未命名",member:"张三；李四；王五",amount:"99.99",useLevel:"99",waterRight:"33",updateTime:"2018/09/23  09:03:32"},
    {id:"435676657",name:" 宁圩村7#水表",groupName:"未命名",member:"张三；李四；王五",amount:"99.99",useLevel:"99",waterRight:"33",updateTime:"2018/09/23  09:03:32"},
    {id:"435676658",name:" 宁圩村8#水表",groupName:"未命名",member:"张三；李四；王五",amount:"99.99",useLevel:"99",waterRight:"33",updateTime:"2018/09/23  09:03:32"},
    {id:"435676659",name:" 宁圩村9#水表",groupName:"未命名",member:"张三；李四；王五",amount:"99.99",useLevel:"99",waterRight:"33",updateTime:"2018/09/23  09:03:32"}
]
export default class extends Component{
    constructor(props) {
        super(props)
        const groupAccount=data;
        var tableData=[],tableIndex=[];//数据表的item 和 index
        tableTitle.map(v=>{
            tableData.push(v.item);
            tableIndex.push(v.index)
        })
        this.state={
            groupAccount,
            items:groupAccount,
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
            })
        })
        //把数据都push到tableDatas里
        let tableDatas = [];
        items.map((v, i) => {
            tableDatas.push({
                id:v.id,
                name:v.name,
                groupName:v.groupName,
                member:v.member,
                amount:v.amount,
                useLevel:v.useLevel,
                waterRight:v.waterRight,
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
            width: 430,
            render: (record) => {
                return (
                    <span className={styles.option}>
                        <Button
                            className={styles.record}
                            // onClick={() => this._set()}
                            icon='file-text'
                        >
                            消费记录
                        </Button>
                        <Button
                            className={styles.clear}
                            icon='delete'
                        >
                            清空当前用量
                        </Button>
                        <Button
                            className={styles.assignment}
                            icon='share-alt'
                        >
                            分配水权
                        </Button>
                        <Button
                            className={styles.edit}
                            icon='edit'
                        >
                            修改
                        </Button>
                        <Button
                        className={styles.management}
                            icon='team'
                        >
                            管理小组成员
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
            <div>
               <div className={styles.header}>
                    <span>|</span>小组账户
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
                            icon='upload'
                            className={styles.fnButton}
                        >
                            导出数据
                        </Button>
                    </div> 
                </div>
                <Table
                    columns={columns}
                    className={styles.table}
                    pagination={paginationProps}
                    dataSource={tableDatas}
                    scroll={{ x: 1100 }}
                />
            </div>
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
                        flexWrap:"wrap"
                    }}>
                    <Form.Item>
                        {getFieldDecorator('id', {initialValue: ''})
                            (
                            <Cascader
                                placeholder='设备ID'
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
                        {getFieldDecorator('groupName', {})
                            (
                            <Input
                                placeholder='名称'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('name/phone', {})
                            (
                            <Input
                                placeholder='农户姓名/手机'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('state', {initialValue: ''})
                            (
                            <Cascader
                                placeholder='所有状态'
                            />
                            )
                        }
                    </Form.Item>
                </Form>
            )

        }
    }
)