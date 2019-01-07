import React, { Component, Fragment } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Card, DatePicker } from 'antd';
import styles from './demoCharts2.less';
import { getDeviceOperateCount } from '../../../services/api';
export default class extends Component {
    constructor(props) {
        super(props)
        const { data } = props.data;
        this.state = {
            data
        }
        // console.log(data)
    }
    _onChangeDate(date, dateString) {
        // console.log(date, dateString);
        if (dateString !== '') {
            Promise.resolve(getDeviceOperateCount({ time: dateString }))
                .then((v) => {
                    if (v.data.ret == 1) {
                        // console.log(v)
                        let data = v.data.data;
                        this.setState({
                            data
                        })
                    }
                })
        }

    }
    _getDataSix() {
        const { data } = this.state;
        let legendData = [];
        let seriesData = [];
        data.map((v, i) => {
            legendData.push(v.key)
            seriesData.push({
                value: v.value,
                name: v.key
            })
        })
        return (
            {

                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: {c} ({d}%)",
                    textStyle: {
                        color: '#327DF4',
                        fontSize: 14
                    },
                    confine: true
                },
                color: ['#A30AEF', '#FF7200', '#21A2F6', '#327DF4'],
                legend: {
                    orient: 'vertical',
                    top: 50,
                    right: 10,
                    itemGap: 43,
                    padding: [10, 22],
                    data: legendData,
                    itemWidth: 15,
                    itemHeight: 15,
                    textStyle: {
                        color: '#71BBF8',
                        fontSize: 16
                    },

                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        center: ['38%', '50%'],
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
                        data: seriesData,
                    }
                ]
            }
        )
    }
    render() {
        return (
            <Fragment>
                <div
                    className={styles.demoCharts6}
                >
                    <Card
                        title="操作记录"
                        extra={<DatePicker onChange={(date, dateString) => this._onChangeDate(date, dateString)} />}
                    >
                        <ReactEcharts
                            opts={{ height: 344 }}
                            option={this._getDataSix()}
                        />
                    </Card>
                </div>
            </Fragment>
        )

    }
}