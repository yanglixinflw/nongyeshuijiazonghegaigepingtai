import React, { Component } from 'react'
import styles from './demoCharts4.less'
import ReactEcharts from 'echarts-for-react'
import { Card, Select } from 'antd';
import * as echarts from 'echarts'
// var data = [{ id: 1, name: "项家窝堡村" }]
// const Option = Select.Option;
export default class extends Component {
    _getData4() {
        return (
            {
                color: "#327df4",
                grid: {
                        left: '12%',
                        top: '16%',
                    },
                xAxis: {
                    type: 'category',
                    data: ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7'],
                    //不显示坐标轴轴线
                    axisLine: { show: false },
                    //不显示坐标刻度
                    axisTick: { show: false },
                    //刻度字体的颜色
                    axisLabel: { color: "#327df4" }
                },
                yAxis: {
                    type: 'value',
                    axisLine: { show: false },
                    axisTick: { show: false },
                    //分割线的颜色
                    splitLine: { lineStyle: { color: ['#1c2241'] } },
                    axisLabel: { color: "#327df4" }
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
                    data: [1, 1, 1, 1, 1, 1, 1]
                }, {
                    type: 'bar',
                    barWidth: 19,
                    data: [0.1, 0.3, 0.5, 0.2, 0.4, 0.2, 0.3]
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
    render() {
        return (
            <div className={styles.demoCharts4} style={{ display: "flex" }}>
                <Card
                    title="本周用水量"
                    // extra={<Select placeholder="项家窝堡村">{data.map((v, i) => {
                    //     return (
                    //         <Option value={v.id} key={i}>{v.name}</Option>
                    //     )
                    // })}</Select>}
                    style={{
                        // width:"388px",
                        width: "100%",
                        height: '308px',
                        background: "#1c2241",
                        color: "#327df4"
                    }}
                >
                    {/* <div style={{ marginTop: "-50px" }}> */}
                        <ReactEcharts
                            option={this._getData4()}
                        />
                    {/* </div> */}
                </Card>
            </div>
        )
    }
}