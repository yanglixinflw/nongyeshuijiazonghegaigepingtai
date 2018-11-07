import React,{Component} from 'react';
import styles from "./chargingDevice.less"
import { Input, Button, Form, Cascader, Table, Divider,Select} from 'antd';
//表头
const tableTitle=[
    {index:"id",item:"设备ID"},
    {index:"type",item:"设备型号"},
    {index:"name",item:"设备名称"},
    {index:"area",item:"设备安装地"},
    {index:"building",item:"关联建筑物"},
    {index:"valveType",item:"灌区类型"},
    {index:"plantType",item:"种植类型"},
    {index:"updateTime",item:"更新时间"},
]
//假数据
const data=[
    {id:"435676651",type:"慧水超声波表",name:" 宁圩村1#水表",area:"杭州萧山",building:"一号闸阀井",valveType:"一级灌区",plantType:"水果",updateTime:"2018/09/23  09:03:32"},
    {id:"435676652",type:"慧水超声波表",name:" 宁圩村2#水表",area:"杭州萧山",building:"一号闸阀井",valveType:"一级灌区",plantType:"水果",updateTime:"2018/09/23  09:03:32"},
    {id:"435676653",type:"慧水超声波表",name:" 宁圩村3#水表",area:"杭州萧山",building:"一号闸阀井",valveType:"一级灌区",plantType:"水果",updateTime:"2018/09/23  09:03:32"},
    {id:"435676654",type:"慧水超声波表",name:" 宁圩村4#水表",area:"杭州萧山",building:"一号闸阀井",valveType:"一级灌区",plantType:"水果",updateTime:"2018/09/23  09:03:32"},
    {id:"435676655",type:"慧水超声波表",name:" 宁圩村5#水表",area:"杭州萧山",building:"一号闸阀井",valveType:"一级灌区",plantType:"水果",updateTime:"2018/09/23  09:03:32"},
    {id:"435676656",type:"慧水超声波表",name:" 宁圩村6#水表",area:"杭州萧山",building:"一号闸阀井",valveType:"一级灌区",plantType:"水果",updateTime:"2018/09/23  09:03:32"},
    {id:"435676657",type:"慧水超声波表",name:" 宁圩村7#水表",area:"杭州萧山",building:"一号闸阀井",valveType:"一级灌区",plantType:"水果",updateTime:"2018/09/23  09:03:32"},
    {id:"435676658",type:"慧水超声波表",name:" 宁圩村8#水表",area:"杭州萧山",building:"一号闸阀井",valveType:"一级灌区",plantType:"水果",updateTime:"2018/09/23  09:03:32"},
    {id:"435676659",type:"慧水超声波表",name:" 宁圩村9#水表",area:"杭州萧山",building:"一号闸阀井",valveType:"一级灌区",plantType:"水果",updateTime:"2018/09/23  09:03:32"}
]
const { Option }=Select
export default class extends Component{
    constructor(props) {
        super(props)
        const chargingDevice=data;
        var tableData=[],tableIndex=[];//数据表的item 和 index
        tableTitle.map(v=>{
            tableData.push(v.item);
            tableIndex.push(v.index)
        })
        this.state={
            chargingDevice,
            items:chargingDevice,
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
                id:v.id,
                type:v.type,
                name:v.name,
                area:v.area,
                building:v.building,
                valveType:v.valveType,
                plantType:v.plantType,
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
            className: `${styles.action}`,
            width: 220,
            render: (record) => {
                return (
                    <span className={styles.options}>
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
                    <span>|</span>计费设施
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
                        {getFieldDecorator('id', {initialValue: ''})
                            (
                            <Input
                                placeholder='设备ID'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('type', {})
                            (
                            <Input
                                placeholder='设备型号'
                                type='text'
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
                        {getFieldDecorator('area', {initialValue:'area'})
                            (
                            <Select>
                                <Option value="area">设备安装地</Option>
                                <Option value="all">全部</Option>
                            </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('building', {initialValue: ''})
                            (
                            <Input
                                placeholder='关联建筑物'
                                type="text"
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('valveType', {initialValue: 'valveType'})
                            (
                            <Select>
                                <Option value="valveType">灌区类型</Option>
                                <Option value="all">全部</Option>
                            </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('plantType', {initialValue: 'plantType'})
                            (
                            <Select>
                                <Option value="plantType">种植类型</Option>
                                <Option value="all">全部</Option>
                            </Select>
                            )
                        }
                    </Form.Item>
                </Form>
            )

        }
    }
)