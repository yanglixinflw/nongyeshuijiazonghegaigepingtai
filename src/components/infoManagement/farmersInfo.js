import React,{Component} from 'react';
import styles from './farmersInfo.less';
import { Input, Button, Form, Cascader, Table} from 'antd';
// 开发环境用以翻页调用
const envNet='http://192.168.30.127:88';
const dataUrl=`${envNet}/api/PeasantMgr/list`;
//头信息
const tableTitle=[
    {index:"realName",item:"姓名"},
    {index:"mobilePhone",item:"电话"},
    {index:"idCard",item:"身份证"},
    {index:"areaId",item:"归属地区"},
    {index:"userType",item:"用户类型"},
    {index:"orgId",item:"所属机构"}
]
export default class extends Component{
    constructor(props) {
        super(props)
        const { farmersInfo } = props;
        console.log(props)
        this.state = {
            //表头数据
            tableTitle,
            title:tableTitle,
            tableDatas:[],
            itemCount:farmersInfo.data.data.itemCount,//总数据数
            data:farmersInfo.data.data.items,//表格数据源
            //表的每一列
            columns: [],
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
            width: 100,
            render: (record) => {
                return (
                    <span className={styles.option}>
                        <Button
                            className={styles.edit}
                            // onClick={() => this._editFarmerInfo()}
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
                        <Button
                            className={styles.editPsw}
                            icon='form'
                        >
                            修改密码
                        </Button>
                    </span>
                )
            }
        })
        let tableDatas = [];
        //表单数据
        data.map((v, i) => {
            tableDatas.push({
                realName:v.realName,
                mobilePhone:v.mobilePhone,
                idCard:v.idCard,
                areaId:v.areaId,
                userType:v.userType,
                orgId:v.orgId,
                key: i,
            });
        })
        this.setState({
            columns,
            tableDatas,
        });
    }
    //修改功能
    _editFarmerInfo(){
        console.log("修改")
    }
    // 搜索功能
    _searchTableData() {
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
    //导出数据
    _exportDataHandler() {
        console.log("导出数据")
    }
    //换页
    _pageChange(page){
        let PageIndex = page - 1;
        return fetch(dataUrl,{
            method:'POST',
            mode:'cors',
            headers:new Headers({
                'Content-Type': 'application/json',
            }),
            credentials: "include",
            body:JSON.stringify({
                name: "",
                mobile: "",
                roleId: 0,
                pageIndex: PageIndex,
                pageSize:10
            })
        }).then((res)=>{
            Promise.resolve(res.json())
            .then((v)=>{
                console.log(v)
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
                    this._getTableDatas(this.state.tableTitle, this.state.data);
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
            <div>
                <div className={styles.header}>
                    <span>|</span>农户信息
                </div>
                <div className={styles.searchForm}>
                    {/* 表单信息 */}
                    <SearchForm
                        wrappedComponentRef={(searchForm) => this.searchForm = searchForm}
                        searchHandler={() => this._searchTableData()}
                        resetHandler={() => this._resetForm()}
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
                            icon='plus'
                            className={styles.fnButton}
                        >
                            添加
                        </Button>
                        <Button
                            icon='upload'
                            className={styles.fnButton}
                            onClick={() => this._exportDataHandler()}
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
                    // scroll={{ x: 1300 }}
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
                            <Cascader
                                placeholder='归属地区'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('areaId', {})
                            (
                            <Cascader
                                placeholder='全部状态'
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