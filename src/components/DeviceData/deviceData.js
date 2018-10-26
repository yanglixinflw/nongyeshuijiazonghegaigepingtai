import React, { Component } from 'react';
import styles from './common.less';
import {Button ,Table} from 'antd';
import { Link } from 'dva/router';
export default class extends Component {
    constructor(props) {
        super(props)
        const data = props.ball || props.meteorology
        const title = data.title.data.data;
        //通用title
        const currentTitle = [
            {name:'deviceId',displayName:'设备ID'},
            {name:'name',displayName:'设备名称'},
            {name:'installAddr',displayName:'设备安装地'},
            {name:'updateTime',displayName:'更新时间'}
        ];
        //拼接完成全部columns
        if(currentTitle.length==4){
            currentTitle.splice(3,0,...title);
        }
        //全部title
        let tableTitle = [];
        //序列化  源columns拥有编号
        currentTitle.map((v,i)=>{
            v.number=i
            tableTitle.push(v.displayName)
        })
        this.state = {
            //数据源
            data: data.data.data.items,
            //数据总数
            itemCount: data.data.data.itemCount,
            //数据列表所有title
            tableTitle,
            //显示的数据列表title
            title: tableTitle,
            //表头
            columns: [],
            //表单数据
            tableData: [],
            //显示设置弹窗可见性
            showSetVisible: false,
            // 设置过滤后的表头
            filterColumns: currentTitle,
        }
        // console.log(data);
    }
    componentDidMount() {
        //console.log(currentTitle)
        this._getTableData(this.state.title, this.state.data, this.state.filterColumns);
    }
    //获取设备信息 此时使用localStorage
    _getDeviceInfo(value) {
        let deviceInfo = JSON.stringify(value);
        localStorage.setItem('deviceInfo', deviceInfo)
    }
     //获取表的数据
     _getTableData(title, data, filterColumns) {
        let columns = [];
        // 设置columns
        title.map((v, i) => {
            columns.push({
                title: v,
                // 给表头添加字段名 必须一一对应
                dataIndex: filterColumns[i].name,
                align: 'center',
                className: `${styles.tbw}`
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
                    <span>
                        <Link to={`/ball/history:${record.deviceId}`}>
                            <Button
                                icon='bar-chart'
                                onClick={() => this._getDeviceInfo(record)}
                            >
                                历史记录
                            </Button>
                        </Link>
                    </span>
                )
            }
        })
        let tableData = [];
        // 表单数据
        data.map((v, i) => {
            tableData.push({
                deviceId: v.deviceId,
                name: v.name,
                installAddr: v.installAddr,
                //球阀
                GatewayAddr: v.realTimeData.GatewayAddr,
                Press: v.realTimeData.Press,
                SunElecPress: v.realTimeData.SunElecPress,
                InstantNumber: v.realTimeData.InstantNumber,
                WaterTotalNumber: v.realTimeData.WaterTotalNumber,
                BatteryPress: v.realTimeData.BatteryPress,
                ValveStatus: v.realTimeData.ValveStatus,
                //气象
                AirTemperature: v.realTimeData.AirTemperature,
                AirHumidity: v.realTimeData.AirHumidity,
                Illumination: v.realTimeData.Illumination,
                Pressure: v.realTimeData.Pressure,
                Evaporate: v.realTimeData.Evaporate,
                WindDirection: v.realTimeData.WindDirection,
                WindSpeed: v.realTimeData.WindSpeed,
                Rainfall: v.realTimeData.Rainfall,
                updateTime: v.updateTime,
                key: i,
            });
        })
        this.setState({
            columns,
            tableData,
        });
    }
    //翻页
    _pageChange(page) {
        console.log(page)
    }
    render() {
        const { columns, tableData, itemCount } = this.state;
        const paginationProps = {
            showQuickJumper: true,
            total: itemCount,
            // 传递页码
            onChange: (page) => this._pageChange(page)
        };
        return (
            <div>
                <Table
                    columns={columns}
                    className={styles.table}
                    pagination={paginationProps}
                    dataSource={tableData}
                    scroll={
                        { x: columns.length > 10 ? 2000 : false }
                    }
                />
            </div>
        )
    }
}