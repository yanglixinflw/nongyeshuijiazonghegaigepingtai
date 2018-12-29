import React, { Component, Fragment } from 'react';
import styles from './demoCharts5.less';
import { Card } from 'antd'
import ReactEcharts from 'echarts-for-react'
import * as echarts from 'echarts'
export default class extends Component {
    _getData3() {
        return (
            {
                grid: {
                    left: '8%',
                    right: '4%',
                    top: '16%',
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        animation: false
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
                        data: ['12.4', '12.5', '12.6', '12.7', '12.8', '12.9', '12.10', '12.13']
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
                        name: '开通用户',
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
                        data: [60, 20, 50, 60, 30, 50, 90,70,60]
                    },
                    {
                        name: '登录人数',
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
                        data: [50, 30, 80, 50, 20, 70, 80,20,100]
                    },
                ],

            }
        )
    }
    render() {
        return (
            <Fragment>
                <div className={styles.fiveCard}>
                    <Card
                        title="XXXX"
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