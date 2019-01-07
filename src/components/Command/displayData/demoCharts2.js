import React,{Component,Fragment} from 'react';
import ReactEcharts from 'echarts-for-react';
import { Card,DatePicker } from 'antd';
import styles from './demoCharts2.less';
export default class extends Component{
    constructor(props){
        super(props)
        const {data} = props.data;
        // console.log(data)
        this.state = {
            data
        }
    }
    _onChangeDate(date,dateString){
        // console.log(date, dateString);
    }
    _getDataTwo(){
        const {data} = this.state;
        let nameData = [];
        let countData = [];
        let maxCountData = [];
        data.map((v,i)=>{
            nameData.push(v.name);
            countData.push(v.deviceCount)
        })
        let maxCount = countData.reduce((a,b)=>{
            return b>a?b:a
        })
        countData.map((v,i)=>{
            maxCountData.push(maxCount)
        })
        return(
            {   
                tooltip:{
                    trigger:'axis',
                    backgroundColor:'#171A39',
                    formatter:'{c1}',
                    textStyle:{
                        color:'#327DF4',
                        fontSize:14
                    },
                    axisPointer:{
                        type:'none'
                    }
                },
                grid:{
                    left:115,
                    top:20,  
                    bottom:30,
                    right:24
                },
                xAxis: {
                    show:false,
                    type: 'value',
                    // boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: nameData,
                    axisLine:{
                        show:false,
                    },
                    axisTick:{
                        show:false,
                    },
                    axisLabel:{
                        color:'#71BBF8',
                        align:'left',
                        margin:95,
                        fontSize:14
                    },
                },
                series: [
                    {
                        type: 'bar', 
                        data: maxCountData,
                        barGap: '-100%',
                        barWidth: 13,
                        color:'#38437B',
                        silent: true,
                    },
                    {
                        name: '2011年',
                        type: 'bar',
                        data: countData,
                        barWidth: 13,
                        itemStyle:{
                            normal:{
                                color: (params)=>{
                                    const colorList = [
                                        '#13C4FD','#F2B344','#F7A88B','#F2698B','#327DF4','#4FD6D2'
                                    ];
                                    return colorList[params.dataIndex]
                                }
                            }
                        },
                        z: '10',
                    },
                ]
            }
        )
    }
    render(){
        return(
            <Fragment>
                <div 
                    className={styles.demoCharts2}
                    >
                    <Card
                        title="设备数量"
                        // extra={<DatePicker onChange={(date,dateString)=>this._onChangeDate(date,dateString)} />}
                    >
                        <ReactEcharts 
                            opts={{height:256}}
                            option={this._getDataTwo()}
                        />
                    </Card>
                </div>
            </Fragment>
        )
       
    }
}