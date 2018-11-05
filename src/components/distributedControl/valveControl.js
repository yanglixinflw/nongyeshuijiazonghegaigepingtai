import React,{Component} from 'react';
import styles from "./valveControl.less"
import { Input, Button, Form, Cascader, Table, Divider,Select} from 'antd';
//表头
const tableTitle=[
    {index:"valveType",item:"阀门型号"},
    {index:"id",item:"阀门ID"},
    {index:"name",item:"阀门名称"},
    {index:"area",item:"阀门安装地"},
    {index:"build",item:"关联建筑物"},
    {index:"inter",item:"网络"},
    {index:"electric",item:"电量"},
    {index:"state",item:"阀门状态"},
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
                    <span>|</span>阀门控制
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
                            icon='poweroff'
                            className={styles.fnButton}
                        >
                            阀门开关
                        </Button>
                        <Button
                            icon='environment'
                            className={styles.fnButton}
                        >
                            在地图操作
                        </Button>
                    </div> 
                </div>
                <Table
                    columns={columns}
                    className={styles.table}
                    pagination={paginationProps}
                    dataSource={tableDatas}
                    scroll={{ x: 1300 }}
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
                        {getFieldDecorator('id', {})
                            (
                            <Input
                                placeholder='阀门ID'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('name', {})
                            (
                            <Input
                                placeholder='阀门名称'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('areaId', {initialValue:'area'})
                            (
                            <Select>
                                <Option value='area'>设备安装地</Option>
                                <Option value='all'>全部</Option>
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