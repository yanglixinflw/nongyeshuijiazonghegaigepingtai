import React,{Component} from 'react';
import styles from "./operatingRecord.less"
import { Input, Button, Form, Cascader, Table, Divider,Select, Icon,DatePicker} from 'antd';
import { Link } from 'dva/router';
import { parse } from 'qs';
//开发地址
const envNet='http://192.168.30.127:88';
//生产环境
// const envNet='';
//表头
const tableTitle=[
    {index:"operateUserName",item:"操作员"},
    {index:"cmdName",item:"动作"},
    {index:"result",item:"状态"},
    {index:"createTime",item:"操作时间"},
    {index:"executeTime",item:"执行时间"},
]
const { RangePicker } = DatePicker;
export default class extends Component{
    constructor(props) {
        super(props)
        const {operatingRecord}=props;
        let deviceId = parse(window.location.href.split(':'))[3];
        this.state={
            title:tableTitle,
            columns: [],
            itemCount:operatingRecord.data.data.itemCount,//总数据数
            data:operatingRecord.data.data.items,//表格数据源
            //当前设备id
            deviceId,
            //默认搜索框
            searchValue:{}
        }
    }
    componentDidMount() {
        this._getTableDatas(this.state.title, this.state.data);
    }
    _getTableDatas(title, data) {
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
        data.map((v, i) => {
            tableDatas.push({
                operateUserName:v.operateUserName,
                cmdName:v.cmdName,
                result:v.result,
                createTime:v.createTime,
                executeTime:v.executeTime,
                key: i,
            });
        })
        this.setState({
            columns,
            tableDatas,
        });
    }
    render(){
        const {tableDatas,columns,deviceId} = this.state;
        return(
            <React.Fragment>
                <div className={styles.operatingRecord}>
                    <div className={styles.headers}>
                        <div className={styles.left}>
                            <Link to={`/dcs/valveControl`}>
                                <div className={styles.arrowLeft}>
                                    <Icon type="arrow-left" theme="outlined" style={{marginTop:'22px',fontSize:'18px'}}/>
                                    <div>阀门控制</div>
                                </div>
                            </Link>
                            <Link to={`/valveControl/operatingRecord${deviceId}`}>
                                <div className={styles.warningRules}>
                                    <div>/</div>
                                    <div className={styles.addRules}>操作记录</div>
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
                                icon='reload'
                                className={styles.fnButton}
                                onClick={() => this._resetForm()}
                            >
                                重置
                            </Button>
                        </div> 
                    </div>
                    <Table
                        columns={columns}
                        className={styles.table}
                        dataSource={tableDatas}
                        // scroll={{ x: 1300 }}
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
            const { form} = this.props;
            const { getFieldDecorator } = form;
            const rangeConfig = {
                rules: [{ type: 'array', required: true, message: 'Please select time!' }],
            };
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
                                placeholder='操作员'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('range-picker', rangeConfig)(
                            <RangePicker />
                        )}
                    </Form.Item>
                </Form>
            )

        }
    }
)