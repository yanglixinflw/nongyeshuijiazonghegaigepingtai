import React, { Component, Fragment } from 'react';
import styles from './demoCharts5.less';
import { Card } from 'antd'
import ReactEcharts from 'echarts-for-react'
import * as echarts from 'echarts'
import {ENVNet,postOption} from '../../../services/netCofig'
const dataUrl=`${ENVNet}/api/chartData/totalFlows`
export default class extends Component {
    state={
        // 时间
        timeArray:[],
        // 压力
        pressArray:[],
        // 液位
        waterLevelArray:[],
    }
    componentDidMount(){
        fetch(dataUrl,{
            ...postOption,
            body:JSON.stringify({
                countMinutes:6
            })
        }).then((res)=>{
            // console.log(res.json())
            Promise.resolve(res.json()).then((v)=>{
                if(v.ret==1){
                    // console.log(v.data)
                    let dataArray=v.data
                    let timeArray=[]
                    let pressArray=[]
                    let waterLevelArray=[]
                    dataArray.map((v,i)=>{
                        timeArray[i]=v.reTime
                        pressArray[i]=v.press
                        waterLevelArray[i]=v.waterLevel
                    })
                    this.setState({
                        timeArray,pressArray,waterLevelArray
                    })
                }
            })
        })
    }
    _getData3() {
        let {timeArray,pressArray,waterLevelArray}=this.state
        // console.log(timeArray)
        return (
            {
                grid: {
                    left: '8%',
                    right: '4%',
                    top: '16%',
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    axisPointer: {
                        animation: true,
                        show:true
                    }
                },
                legend: {
                    data:['压力(kpa)','液位(cm)'],
                    bottom:0,
                    textStyle:{
                        color :'#71BBF8',
                    }
                },
                xAxis: [
                    {
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#92b1d8'
                            },
                        },
                        type: 'category',
                        boundaryGap: false,
                        axisLine: { show: false },
                        axisTick: { show: false },
                        data: timeArray
                    }
                ],
                yAxis: [
                    {
                        axisLine: { show: false },
                        axisTick: { show: false },
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
                        name: '压力(kpa)',
                        type: 'line',
                        showSymbol: false,
                        itemStyle: {
                            normal: {   //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
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
                                    width: 2,
                                    type: 'dotted',
                                    color: "#01e6fa" //折线的颜色
                                }
                            }
                        },//线条样式  
                        areaStyle: { normal: {} },
                        lineStyle: {
                            normal: {
                                width: 2
                            }
                        },
                        data: pressArray
                    },
                    {
                        name: '液位(cm)',
                        type: 'line',
                        showSymbol: false,
                        itemStyle: {
                            normal: {   //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
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
                                    width: 2,
                                    type: 'dotted',
                                    color: "#2d89f5" //折线的颜色
                                }
                            }
                        },//线条样式  
                        areaStyle: { normal: {} },
                        lineStyle: {
                            normal: {
                                width: 2
                            },
                        },
                        data: waterLevelArray
                    },
                ],

            }
        )
    }
    render() {
        // let {timeArray,pressArray,waterLevelArray}=this.state
        return (
            <Fragment>
                <div className={styles.fiveCard}>
                    <Card
                        title="实时数据"
                    >

                        <ReactEcharts
                            option={this._getData3()}
                        />

                    </Card>
                </div>
            </Fragment>
        )
    }
}