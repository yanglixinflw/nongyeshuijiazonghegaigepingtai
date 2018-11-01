import React,{Component} from 'react';
import styles from './warningRecords.less';
import { Input, Button, Form, Cascader, Table, Modal} from 'antd';
//ip地址
const envNet='http://192.168.30.127:88';
//翻页调用
const dataUrl=`${envNet}/api/DeviceWaringRule/eventList`;
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
    {index:"time",item:"预警时间"},
    {index:"waringType",item:"预警类型"},
    {index:"name",item:"预警名称"},
    {index:"eventContent",item:"事件内容"},
    {index:"warningStatus",item:"状态"},
    {index:"deviceId",item:"设备ID"},
    {index:"building",item:"关联建筑物"}
]
export default class extends Component{
    constructor(props){
        super(props)
        const {warningRecords}=props;
        this.state = {
            //表头数据
            tableTitle,
            title:tableTitle,
            itemCount:warningRecords.data.data.itemCount,//总数据数
            data:warningRecords.data.data.items,//表格数据源
            //表的每一列
            columns: [],
            //搜索框初始值
            searchValue: {
                "waringType": 1,
                "warningStatus": 1,
                "deviceId": "",
                "installAddr": "",
                "pageIndex": 0,
                "pageSize": 10
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
                            icon='stop'
                        >
                            关闭预警
                        </Button>
                        <Button
                            className={styles.delete}
                            onClick={()=>this.delete()}
                            icon='environment'
                        >
                            定位至事件地点
                        </Button>
                    </span>
                )
            }
        })
        let tableDatas = [];
        //表单数据
        data.map((v, i) => {
            tableDatas.push({
                time:v.time,
                waringType:v.waringType,
                name:v.name,
                eventContent:v.eventContent,
                deviceId:v.deviceId,
                building:v.building,
                warningStatus:v.warningStatus,
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
                    <span>|</span>预警事件记录
                </div>
                <div className={styles.searchForm}>
                    {/* 表单信息 */}
                    <SearchForm
                        wrappedComponentRef={(searchForm) => this.searchForm = searchForm}
                    />
                    <div className={styles.buttonGroup}>
                        <Button
                            icon='search'
                            className={styles.fnButton}
                        >
                            搜索
                        </Button>
                        <Button
                            icon='reload'
                            className={styles.fnButton}
                        >
                            重置
                        </Button>
                        <Button
                            icon='eye'
                            className={styles.fnButton}
                        >
                            显示设置
                        </Button>
                        <Button
                            icon='upload'
                            className={styles.fnButton}
                        >
                            数据导出
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
            const { form } = this.props;
            const { getFieldDecorator } = form;
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
                        {getFieldDecorator('waringType', {})
                            (
                            <Cascader
                                placeholder='所有类型'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('warningStatus', {})
                            (
                            <Cascader
                                placeholder='所有状态'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('id', {})
                            (
                            <Input
                                placeholder='设备ID'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('area', {})
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
                                placeholder='设备安装地'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('building', {})
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
