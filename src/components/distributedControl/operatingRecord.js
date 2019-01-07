import React,{Component} from 'react';
import styles from "./operatingRecord.less"
import { Input, Button, Form,Table,Icon,DatePicker} from 'antd';
import { Link } from 'dva/router';
import { timeOut } from '../../utils/timeOut';
import classnames from 'classnames';
import { parse } from 'qs';
import {ENVNet,postOption} from '../../services/netCofig'
//翻页调用
const dataUrl=`${ENVNet}/api/device/control/operateLogs`;
const tableTitle=[
    {index:"operateUserName",item:"操作员"},
    {index:"cmdName",item:"动作"},
    {index:"operateStatus",item:"状态"},
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
            if(v.operateStatus==0){
                tableDatas.push({
                    operateUserName:v.operateUserName||"系统自动化",
                    cmdName:v.cmdName,
                    operateStatus:'无操作',
                    createTime:v.createTime,
                    executeTime:v.executeTime,
                    key: i,
                });
            }else if(v.operateStatus==1){
                tableDatas.push({
                    operateUserName:v.operateUserName||"系统自动化",
                    cmdName:v.cmdName,
                    operateStatus:'正在执行中',
                    createTime:v.createTime,
                    executeTime:v.executeTime,
                    key: i,
                });
            }else if(v.operateStatus==2){
                tableDatas.push({
                    operateUserName:v.operateUserName||"系统自动化",
                    cmdName:v.cmdName,
                    operateStatus:'执行成功',
                    createTime:v.createTime,
                    executeTime:v.executeTime,
                    key: i,
                });
            }else if(v.operateStatus==3){
                tableDatas.push({
                    operateUserName:v.operateUserName||"系统自动化",
                    cmdName:v.cmdName,
                    operateStatus:'执行失败',
                    createTime:v.createTime,
                    executeTime:v.executeTime,
                    key: i,
                });
            }
            
        })
        this.setState({
            columns,
            tableDatas,
        });
    }
       // 搜索功能
    _searchTableData() {
        const { title } = this.state;
        const form = this.searchForm.props.form;
        form.validateFields((err, fieldsValue) => {
            // 未定义时给空值
            if (err) {
                return
            }
            if(fieldsValue['range-time-picker'].length!=0){
                const rangeTimeValue = fieldsValue['range-time-picker'];
                const values = {
                ...fieldsValue,
                'range-time-picker': [
                    rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
                    rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
                ]
                };
                for(var i in values){
                var val=values[i]
                }
            }else{
                var val=["",""]
            }
            var searchValue={
                "deviceId": this.state.deviceId,
                "operateUserName":fieldsValue.operateUserName,
                "beginTime": val[0],
                "endTime": val[1]
            }
            this.setState({
                searchValue
            })
            return fetch(dataUrl, {
                ...postOption,
                body: JSON.stringify({
                    ...searchValue,
                    "pageIndex": 0,
                    "pageSize": 10
                })
            }).then(res => {
                Promise.resolve(res.json())
                    .then(v => {
                        //超时判断
                        timeOut(v.ret)
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
    //重置
    _resetForm() {
        const { title } = this.state;
        const form = this.searchForm.props.form;
        // 重置表单
        form.resetFields();
        return fetch(dataUrl, {
            ...postOption,
            body: JSON.stringify({
                "deviceId": this.state.deviceId,
                "pageIndex": 0,
                "pageSize": 10
            })
        }).then((res) => {
            Promise.resolve(res.json())
                .then((v) => {
                    //超时判断
                    timeOut(v.ret)
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
    //换页
    _pageChange(page){
        const { title,searchValue,deviceId } = this.state;
        searchValue.pageIndex = page - 1;
        searchValue.pageSize=10
        return fetch(dataUrl, {
            ...postOption,
            body: JSON.stringify({
                deviceId,
                ...searchValue
            })
        }).then(res=>{
            Promise.resolve(res.json())
            .then(v=>{
                  //超时判断
                timeOut(v.ret)
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
                    this._getTableDatas(title, data);
                }
            })
            .catch(err=>{
                console.log(err)
            })
        })
    }
    render(){
        const {tableDatas,columns,deviceId,itemCount} = this.state;
        const paginationProps = {
            showQuickJumper: true,
            total:itemCount,
            // 传递页码
            onChange: (page) => this._pageChange(page)
        };
        return(
            <React.Fragment>
                <div className={styles.operatingRecord}>
                    {/* <div className={styles.headers}>
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
                    </div> */}
                    <div className={styles.searchForm}>
                        {/* 表单信息 */}
                        <SearchForm
                            wrappedComponentRef={(searchForm) => this.searchForm = searchForm}
                        />
                        <div className={styles.buttonGroup}>
                            <Button
                                className={styles.fnButton}
                                // icon="search"
                                onClick={() => this._searchTableData()}
                            >
                                <i className={classnames('dyhsicon', 'dyhs-sousuo', `${styles.searchIcon}`)}></i>
                                搜索
                            </Button>
                            <Button
                                // icon='reload'
                                className={styles.fnButton}
                                onClick={() => this._resetForm()}
                            >
                                <i className={classnames('dyhsicon', 'dyhs-zhongzhi', `${styles.resetIcon}`)}></i>
                                重置
                            </Button>
                        </div> 
                    </div>
                    <Table
                        columns={columns}
                        className={styles.table}
                        dataSource={tableDatas}
                        pagination={paginationProps}
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
                        {getFieldDecorator('range-time-picker')(
                            <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                        )}
                    </Form.Item>
                </Form>
            )

        }
    }
)
