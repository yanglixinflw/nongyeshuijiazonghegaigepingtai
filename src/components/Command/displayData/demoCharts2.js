import React,{Component,Fragment} from 'react';
import ReactEcharts from 'echarts-for-react';
import { Card,DatePicker } from 'antd';
import styles from './demoCharts2.less';
export default class extends Component{
    _onChangeDate(date,dateString){
        console.log(date, dateString);
    }
    _getDataTwo(){
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
                    left:90,
                    top:8,  
                    bottom:46,
                    right:14
                },
                xAxis: {
                    show:false,
                    type: 'value',
                    // boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: ['巴西','印尼','美国','印度','中国'],
                    axisLine:{
                        show:false,
                    },
                    axisTick:{
                        show:false,
                    },
                    axisLabel:{
                        color:'#327DF4',
                        align:'right',
                        margin:35,
                        fontSize:14
                    },
                },
                series: [
                    {
                        type: 'bar', 
                        data: [131744, 131744, 131744, 131744, 131744],
                        barGap: '-100%',
                        barWidth: 13,
                        color:'#38437B',
                        silent: true,
                    },
                    {
                        name: '2011年',
                        type: 'bar',
                        data: [18203, 23489, 29034, 104970, 131744],
                        barWidth: 13,
                        itemStyle:{
                            normal:{
                                color: (params)=>{
                                    const colorList = [
                                        '#13C4FD','#F2B344','#F7A88B','#F2698B','#327DF4',
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
    _getDataSix(){
        return(
            {
                
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: {c} ({d}%)",
                    textStyle:{
                        color:'#327DF4',
                        fontSize:14
                    },
                },
                color:['#A30AEF','#FF7200','#21A2F6','#327DF4'],
                legend: {
                    orient: 'vertical',
                    // x: 'right',
                    top:50,
                    right:40,
                    // height:34,
                    itemGap:43,
                    padding:[10,22],
                    data:['直接访问','邮件营销','联盟广告','视频广告'],
                    itemWidth :15,
                    itemHeight :15,
                    textStyle:{
                        color :'#71BBF8',
                        fontSize:16
                    },
                    
                },
                series: [
                    {
                        name:'访问来源',
                        type:'pie',
                        center:['30%','50%'],
                        radius: ['45%', '70%'],
                        // avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: false,
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:[
                            {value:335, name:'直接访问'},
                            {value:310, name:'邮件营销'},
                            {value:234, name:'联盟广告'},
                            {value:135, name:'视频广告'},
                        ],
                        itemStyle:{
                            // shadowColor: '#2B335E',
                            // shadowBlur: 10,
                            // shadowOffsetY:10,
                            // shadowOffsetX:10
                        }
                        
                    }
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
                        title="XXX"
                        extra={<DatePicker onChange={(date,dateString)=>this._onChangeDate(date,dateString)} />}
                    >
                        <ReactEcharts 
                            opts={{height:256}}
                            option={this._getDataTwo()}
                        />
                    </Card>
                </div>
                <div 
                    className={styles.demoCharts6}
                    >
                    <Card
                        title="XXX"
                        extra={<DatePicker onChange={(date,dateString)=>this._onChangeDate(date,dateString)} />}
                    >
                        <ReactEcharts 
                            opts={{height:344}}
                            option={this._getDataSix()}
                        />
                    </Card>
                </div>
            </Fragment>
        )
       
    }
}