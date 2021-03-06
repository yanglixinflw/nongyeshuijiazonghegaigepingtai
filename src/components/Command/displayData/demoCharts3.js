import React,{Component} from 'react'
import styles from './demoCharts4.less'
import ReactEcharts from 'echarts-for-react'
import { Card,Select } from 'antd';
import * as echarts from 'echarts'
// var data=[{id:1,name:"项家窝堡村"}]
// const Option = Select.Option;
export default class extends Component{
    _getData3(){
        return(
            {
                grid: {
                        left: 64,
                        right:24,
                        top: 35,
                        height:192,
                        // width:280
                        },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer: {
                            animation: false
                        },
                        backgroundColor:'#171a39',
                        extraCssText:'width:200px;'
                    },
                    xAxis : [
                        {   
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#6bb1ec'                
                                },
                                fontSize:14
                            },
                            type : 'category',
                            boundaryGap : false,
                            axisLine:{show:false},
                            axisTick:{show:false},
                            data: ['1.2','1.3','1.4','1.5','1.6','1.7','1.8']
                        }
                    ],
                    yAxis: [
                        {
                            axisLine:{show:false},
                            axisTick:{show:false},
                            axisLabel: {
                                    show: true,
                                    textStyle: {
                                        color: '#6bb1ec'
                                    },
                                    fontSize:14,
                                    margin:20
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
                            name:'本周用水量',
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
                            data:[0.4,0,0.1,0.3,0,0.2,0.1]
                        },    
//                         {
//                             name:'上网人数',
//                             type:'line',
//                             showSymbol: false,
//                             itemStyle: {  
//                                 normal: {   //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
//                                     color: new echarts.graphic.LinearGradient(0, 0, 0, 1,[{
//                                             offset: 0, color: '#2d89f5' // 0% 处的颜色
//                                         }, {
//                                             offset: 0.5, color: '#25498d' // 100% 处的颜色
//                                         }, {
//                                             offset: 1, color: '#1c2241' // 100% 处的颜色
//                                         }]
//                                     ),  //背景渐变色 
//                                     lineStyle: {        // 系列级个性化折线样式  
//                                         width: 3,  
//                                         type: 'solid',  
//                                         color: "#2d89f5"
//                                     }
//                                 },  
//                                 emphasis: {  
//                                     color: '#4fd6d2',  
//                                     lineStyle: {        // 系列级个性化折线样式  
//                                         width:2,  
//                                         type: 'dotted',  
//                                         color: "#2d89f5" //折线的颜色
//                                     }  
//                                 }  
//                             },//线条样式  
//                             areaStyle: {normal: {}},
//                             lineStyle: {
//                                 normal: {
//                                     width: 2
//                                 },                            
//                             },
//                             data:[0.4,0.3,0.1,0.5,0.2,0.1,0.4]
//                         },                        
                    ],
            }
        )
    }
    render(){
        return(
            <div className={styles.demoCharts4} style={{display:"flex"}}>
                <Card
                    title="本周用水量(m³)"
                    // extra={<Select placeholder="项家窝堡村">{data.map((v,i)=>{
                    //     return(
                    //         <Option value={v.id} key={i}>{v.name}</Option>
                    //     )
                    // })}</Select>}
                    style={{
                        width:"100%",
                        height:'308px',
                        background:"#1c2241",
                        color:"#327df4"}}
                >
                    <ReactEcharts 
                        option= {this._getData3()}
                    />
                </Card>
            </div>
        ) 
    }
}