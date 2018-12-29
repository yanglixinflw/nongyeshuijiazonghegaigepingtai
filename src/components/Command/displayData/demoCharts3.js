import React,{Component} from 'react'
import styles from './demoCharts4.less'
import ReactEcharts from 'echarts-for-react'
import { Card,Select } from 'antd';
import * as echarts from 'echarts'
var data=[{id:1,name:"项家窝堡村"}]
const Option = Select.Option;
export default class extends Component{
    _getData3(){
        return(
            {
                grid: {
                        left: '8%',
                        right: '4%',
                        top: '16%',
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer: {
                            animation: false
                        }
                    },
                    xAxis : [
                        {   
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#92b1d8'                
                                },
                            },
                            type : 'category',
                            boundaryGap : false,
                            axisLine:{show:false},
                            axisTick:{show:false},
                            data: ['4.4','4.5','4.6','4.7','4.8','4.9','4.10']
                        }
                    ],
                    yAxis: [
                        {
                            axisLine:{show:false},
                            axisTick:{show:false},
                            axisLabel: {
                                    show: true,
                                    textStyle: {
                                        color: '#92b1d8'
                                    },
                            },
                            splitLine: {
                                lineStyle: {
                                    // 使用深浅的间隔色
                                    color: ['#254689']
                                }
                            },                            
                            name: '',
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name:'连网用户',
                            type:'line',
                            showSymbol: false,
                            itemStyle: {  
                                normal: {   //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1,[{
                                            offset: 0, color: '#01e6fa' // 0% 处的颜色
                                        }, {
                                            offset: 0.5, color: '#135d79' // 100% 处的颜色
                                        }, {
                                            offset: 1, color: '#1c2241' // 100% 处的颜色
                                        }]
                                    ),  //背景渐变色 
                                    lineStyle: {        // 系列级个性化折线样式  
                                        width: 3,  
                                        type: 'solid',  
                                        color: "#4fd6d2"
                                    }
                                },  
                                emphasis: {  
                                    color: '#4fd6d2',  
                                    lineStyle: {        // 系列级个性化折线样式  
                                        width:2,  
                                        type: 'dotted',  
                                        color: "#01e6fa" //折线的颜色
                                    }  
                                }  
                            },//线条样式  
                            areaStyle: {normal: {}},
                            lineStyle: {
                                normal: {
                                    width: 2
                                }
                            },                                                       
                            data:[60,20,50,60,30,50,90]
                        },    
                        {
                            name:'上网人数',
                            type:'line',
                            showSymbol: false,
                            itemStyle: {  
                                normal: {   //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1,[{
                                            offset: 0, color: '#2d89f5' // 0% 处的颜色
                                        }, {
                                            offset: 0.5, color: '#25498d' // 100% 处的颜色
                                        }, {
                                            offset: 1, color: '#1c2241' // 100% 处的颜色
                                        }]
                                    ),  //背景渐变色 
                                    lineStyle: {        // 系列级个性化折线样式  
                                        width: 3,  
                                        type: 'solid',  
                                        color: "#2d89f5"
                                    }
                                },  
                                emphasis: {  
                                    color: '#4fd6d2',  
                                    lineStyle: {        // 系列级个性化折线样式  
                                        width:2,  
                                        type: 'dotted',  
                                        color: "#2d89f5" //折线的颜色
                                    }  
                                }  
                            },//线条样式  
                            areaStyle: {normal: {}},
                            lineStyle: {
                                normal: {
                                    width: 2
                                },                            
                            },
                            data:[50,30,80,50,20,70,80]
                        },                        
                    ],

            }
        )
    }
    render(){
        return(
            <div className={styles.demoCharts4} style={{display:"flex"}}>
                <Card
                    title="xxx"
                    extra={<Select placeholder="项家窝堡村">{data.map((v,i)=>{
                        return(
                            <Option value={v.id} key={i}>{v.name}</Option>
                        )
                    })}</Select>}
                    style={{width:"388px",height:'308px',background:"#1c2241",color:"#327df4"}}
                >
                    <div style={{marginTop:"-50px"}}>
                        <ReactEcharts 
                            option= {this._getData3()}
                        />
                    </div>
                </Card>
            </div>
        ) 
    }
}