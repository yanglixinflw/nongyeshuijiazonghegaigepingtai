import React,{Component} from 'react'
import ReactEcharts from 'echarts-for-react'
import { Card } from 'antd';
import * as echarts from 'echarts'
var data=[{id:1,name:"项家窝堡村"}]
export default class extends Component{
    _getData4(){
        return(
            {
                color:"#327df4",
                xAxis: {
                    type: 'category',
                    data: ['8-1', '8-1', '8-1', '8-1', '8-1', '8-1', '8-1'],
                    //不显示坐标轴轴线
                    axisLine:{show:false},
                    //不显示坐标刻度
                    axisTick:{show:false},
                    //刻度字体的颜色
                    axisLabel:{color:"#327df4"}
                },
                yAxis: {
                    type: 'value',
                    axisLine:{show:false},
                    axisTick:{show:false},
                    //分割线的颜色
                    splitLine:{lineStyle:{color:['#1c2241']}},
                    axisLabel:{color:"#327df4"}
                },
                series: [{
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: '#38437b'
                        }
                    },
                    silent: true,
                    barWidth: 19,
                    barGap: '-100%', // Make series be overlap
                    data: [60, 60, 60, 60,60,60,60]
                }, {
                    type: 'bar',
                    barWidth: 19,
                    data: [45, 60, 13, 25,30,10,50]
                }],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                }
            }
        )
    }
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
                            data: ['4.4','4.5','4.6','4.7','4.8','4.9','4.10']
                        }
                    ],
                    yAxis: [
                        {
                              axisLabel: {
                                    show: true,
                                    textStyle: {
                                        color: '#92b1d8'
                                    },
                            },
                            splitLine: {
                                lineStyle: {
                                    // 使用深浅的间隔色
                                    color: ['#393e4c']
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
                                            offset: 0, color: '#d7f4f8' // 0% 处的颜色
                                        }, {
                                            offset: 0.5, color: '#eefcfd' // 100% 处的颜色
                                        }, {
                                            offset: 1, color: '#fff' // 100% 处的颜色
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
                                        color: "#4fd6d2" //折线的颜色
                                    }  
                                }  
                            },//线条样式  
                            areaStyle: {normal: {}},
                            lineStyle: {
                                normal: {
                                    width: 1
                                }
                            },                            
//                             itemStyle:{  
//                                 normal:{  
//                                     barBorderColor:'#24573b',  
//                                     color:'#24573b' 
//                                 },
//                                 emphasis:{
//                                     color:'#24573b'
//                                 },                                    
//                           },                            
                            data:[50,40,30,60,90,80,70]
                        },    
                        {
                            name:'上网人数',
                            type:'line',
                            showSymbol: false,
                            itemStyle: {  
                                normal: {   //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1,[{
                                            offset: 0, color: '#d7f4f8' // 0% 处的颜色
                                        }, {
                                            offset: 0.5, color: '#eefcfd' // 100% 处的颜色
                                        }, {
                                            offset: 1, color: '#fff' // 100% 处的颜色
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
                                        color: "#4fd6d2" //折线的颜色
                                    }  
                                }  
                            },//线条样式  
                            areaStyle: {normal: {}},
                            lineStyle: {
                                normal: {
                                    width: 1
                                },                            
                            },
//                             itemStyle:{  
//                                 normal:{  
//                                     barBorderColor:'#722f2f',  
//                                     color:'#722f2f'   
//                                 },
//                                 emphasis:{
//                                     color:'#722f2f'
//                                 },                                    
//                             }, 
                           
                            data:[20,30,40,50,60,70,80]
                        },                        
                    ],

            }
        )
    }
    render(){
        return(
            <div style={{display:"flex"}}>
                <Card
                    title="xxx"
                    extra={<select>{data.map((v,i)=>{
                        return(
                            <option value={v.id} key={i}>{v.name}</option>
                        )
                    })}</select>}
                    style={{width:"388px",height:'308px',background:"#1c2241",color:"#327df4"}}
                >
                    <div style={{marginTop:"-50px"}}>
                        <ReactEcharts 
                            option= {this._getData4()}
                        />
                    </div>
                </Card>
                <Card
                    title="xxx"
                    extra={<select>{data.map((v,i)=>{
                        return(
                            <option value={v.id} key={i}>{v.name}</option>
                        )
                    })}</select>}
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