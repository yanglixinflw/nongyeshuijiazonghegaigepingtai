import React,{Component} from 'react';
import styles from "./operatingRecord.less"
import { Input, Button, Form,Table,Icon,DatePicker} from 'antd';
import { Link } from 'dva/router';
import { parse } from 'qs';
import moment from 'moment';
//开发地址
const envNet='http://192.168.30.127:88';
//翻页调用
const dataUrl=`${envNet}/api/device/control/operateLogs`;
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
    //时间控件
    range(start, end) {
        const result = [];
        for (let i = start; i < end; i++) {
          result.push(i);
        }
        return result;
    }
    disabledDate(current) {
        return current && current < moment().endOf('day');
    }
    disabledRangeTime(_, type) {
        if (type === 'start') {
          return {
            disabledHours: () => range(0, 60).splice(4, 20),
            disabledMinutes: () => range(30, 60),
            disabledSeconds: () => [55, 56],
          };
        }
        return {
          disabledHours: () => range(0, 60).splice(20, 4),
          disabledMinutes: () => range(0, 31),
          disabledSeconds: () => [55, 56],
        };
    }
       // 搜索功能
    _searchTableData() {
        const { title } = this.state;
        const form = this.searchForm.props.form;
        form.validateFields((err, values) => {
            // 未定义时给空值
            if (err) {
                return
            }
            console.log(values)
            // if(values.operateUserName==undefined){
            //     values.operateUserName=''
            // }
            // return fetch(dataUrl, {
            //     ...postOption,
            //     body: JSON.stringify({
            //         "deviceId": this.state.deviceId,
            //         "operateUserName":operateUserName,
            //         "beginTime": beginTime,
            //         "endTime": endTime,
            //         "pageIndex": 0,
            //         "pageSize": 10
            //     })
            // }).then(res => {
            //     Promise.resolve(res.json())
            //         .then(v => {
            //             if (v.ret == 1) {
            //                 // 设置页面显示的元素
            //                 let itemCount = v.data.itemCount
            //                 let data = v.data.items
            //                 this.setState({
            //                     itemCount,
            //                     data
            //                 })
            //                 this._getTableDatas(title,data);
            //             }
            //         })
            // }).catch(err => {
            //     console.log(err)
            // })
        })
    }
    //重置
    _resetForm() {
        const { title } = this.state;
        const form = this.searchForm.props.form;
        // 重置表单
        form.resetFields();
        return fetch(dataUrl, {
            ...postOption,
            body: JSON.stringify({
                deviceId,
                "pageIndex": 0,
                "pageSize": 10
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    if (v.ret == 1) {
                        // console.log(v)
                        let data = v.data.items;
                        let itemCount = v.data.itemCount;
                        // 给每一条数据添加key
                        data.map((v, i) => {
                            v.key = i
                        })
                        this.setState({
                            data,
                            itemCount,
                            searchValue:{}
                        })
                        this._getTableDatas(title, data);
                    }
                })
        })
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
                            disabledDate={()=>this.disabledDate()}
                            disabledTime={()=>this.disabledRangeTime()}
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
            const { getFieldDecorator,disabledDate,disabledRangeTime } = form;
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
                        {getFieldDecorator('operateUserName', {})
                            (
                            <Input
                                placeholder='操作员'
                                type='text'
                            />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('time')(
                            <RangePicker 
                                disabledDate={disabledDate}
                                disabledTime={disabledRangeTime}
                                showTime={{
                                    hideDisabledOptions: true,
                                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                }}
                                format="YYYY-MM-DD HH:mm:ss"
                            />
                        )}
                    </Form.Item>
                </Form>
            )

        }
    }
)