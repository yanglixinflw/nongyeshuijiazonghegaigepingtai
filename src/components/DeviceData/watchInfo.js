import React, { Fragment } from "react";
import styles from './dataAnalysis.less';
import { Select } from 'antd';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Legend,
} from "bizcharts";
import DataSet from "@antv/data-set";
import ReactEcharts from 'echarts-for-react';
const Option = Select.Option;
export default class extends React.Component {
  constructor(props) {
    super(props)
    const { weatherChart, windChart } = this.props
    let selectlist = ["项家窝堡村"]
    // data.map((v) => {
    //   selectlist.push(v.name)
    // })
    // 默认先显示第一个站点数据
    this.state = {
      weatherChart,
      windChart,
      selectlist,
      sitdata: weatherChart
    }
  }
  // 选择不同站点
  _selectchange(v, i) {
    const { data } = this.state
    // 转化为数字对应
    const key = i.key - 0
    this.setState({
      sitdata: data[key]
    })
  }
  //气象
  getWeatherChart() {
    const { weatherChart } = this.state;
    let xData = [];
    let AirTemperature = [];
    let AirHumidity = [];
    let Illumination = [];
    let Pressure = [];
    let Evaporate = [];
    let WindSpeed = [];
    let Rainfall = [];
    weatherChart.map((v, i) => {
      xData.push(v.Day);
      AirTemperature.push(v.AirTemperature)
      AirHumidity.push(v.AirHumidity)
      Illumination.push(v.Illumination)
      Pressure.push(v.Pressure)
      Evaporate.push(v.Evaporate)
      WindSpeed.push(v.WindSpeed)
      Rainfall.push(v.Rainfall)
    })
    return (
      {
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xData,
          axisLine: {
            lineStyle: {
              color: 'rgba(38,83,152,1)',
              opacity: '0'
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(38,83,152,1)'
            }
          },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: 'rgba(38,83,152,1)',
              opacity: '0'
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(38,83,152,1)'
            }
          },
        },
        tooltip: {
          trigger: 'axis',
          extraCssTeXt: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          backgroundColor: 'rgba(255,255,255,0.8)',
          textStyle: {
            color: '#222'
          },
          formatter: function(params){
            return (params[0].axisValue+'<br>'+
                    `<div style="width:10px;height:10px;display: inline-block ;background-color:${params[0].color} ;border-radius:5px; margin-right:6px"></div>`+params[0].seriesName+':'+params[0].data+' (Lux)<br>'+
                     `<div style="width:10px;height:10px;display: inline-block ;background-color:${params[1].color} ;border-radius:5px;margin-right:6px"></div>`+params[1].seriesName+':'+params[1].data+' (Kpa)<br>'+
                     `<div style="width:10px;height:10px;display: inline-block ;background-color:${params[2].color} ;border-radius:5px;margin-right:6px"></div>`+params[2].seriesName+':'+params[2].data+' (mm)<br>'+
                     `<div style="width:10px;height:10px;display: inline-block ;background-color:${params[3].color} ;border-radius:5px;margin-right:6px"></div>`+params[3].seriesName+':'+params[3].data+' (%RH)<br>'+
                     `<div style="width:10px;height:10px;display: inline-block ;background-color:${params[4].color} ;border-radius:5px;margin-right:6px"></div>`+params[4].seriesName+':'+params[4].data+' (℃)<br>'+
                     `<div style="width:10px;height:10px;display: inline-block ;background-color:${params[5].color} ;border-radius:5px;margin-right:6px"></div>`+params[5].seriesName+':'+params[5].data+' (mm)<br>'+
                     `<div style="width:10px;height:10px;display: inline-block ;background-color:${params[6].color} ;border-radius:5px;margin-right:6px"></div>`+params[6].seriesName+':'+params[6].data+' (m/s)')    
          }, 
        },
        legend: {
          data: ['光照','气压','蒸发','湿度','温度','降雨','风速'],
          textStyle:{
            color:'#05FFF1'
          }
        },
        series: [
          {
            name: '光照',
            data: Illumination,
            type: 'line',
            showSymbol: false,
            smooth: 0.5,
            itemStyle: {
              color: "#FDF423"
            },
          },
          {
            name: '气压',
            data: Pressure,
            type: 'line',
            showSymbol: false,
            smooth: 0.5,
            itemStyle: {
              color: '#A474CD'
            }
          },
          {
            name: '蒸发',
            data: Evaporate,
            type: 'line',
            showSymbol: false,
            smooth: 0.5,
            itemStyle: {
              color: '#1EFFA5'
            }
          },
          {
            name: '湿度',
            data: AirHumidity,
            type: 'line',
            showSymbol: false,
            smooth: 0.5,
            itemStyle: {
              color: '#05FFF1'
            }
          },
          {
            name: '温度',
            data: AirTemperature,
            type: 'line',
            showSymbol: false,
            smooth: 0.5,
            itemStyle: {
              color: '#EC652B'
            }
          },
          {
            name: '降雨',
            data: Rainfall,
            type: 'line',
            showSymbol: false,
            smooth: 0.5,
            itemStyle: {
              color: '#5881FF'
            }
          },
          {
            name: '风速',
            data: WindSpeed,
            type: 'line',
            showSymbol: false,
            smooth: 0.5,
            itemStyle: {
              color: '#ff03d8'
            }
          },

        ],
      }
    )
  }
  render() {
    const { selectlist } = this.state
    const { windChart } = this.props
    return (
      <Fragment>
        <div className={styles.rightHead}>
          <Select
            onChange={(v, i) => this._selectchange(v, i)}
            defaultValue={selectlist[0]}
          >
            {/* 选项菜单动态渲染 */}
            {
              selectlist.length === 0 ? null
                : selectlist.map((v, i) => {
                  return <Option value={v} key={i}>{v}</Option>
                })
            }
          </Select>
        </div>
        <div className={styles.windrose}>
          <span className={styles.wrt}>灌区风向</span>
          <div className={styles.wrtable}>
          <Rose {...{ windChart }} />
          </div>
        </div>
        <div className={styles.classdata}>
          <span className={styles.wrt}>数据分类</span>
          <div className={styles.classtable}>
            <ReactEcharts
              option={this.getWeatherChart()}
            >
            </ReactEcharts>
          </div>
        </div>
      </Fragment>
    );
  }
}
class Rose extends React.Component {
  render() {
    const { DataView } = DataSet;
    const { windChart } = this.props
    // console.log(windChart)
    const dv = new DataView().source(windChart);
    dv.transform({
      type: "fold",
      // 展开字段集
      fields: ["次数"],
      // key字段
      key: "user",
      // value字段
      value: "次数"
    });
    const cols = {
      次数: {
        min: 0,
      }
    };
    return (
      <div>
        <Chart
          height={300}
          data={dv}
          padding={[20, 30, 65, 20]}
          scale={cols}
          forceFit
        >
          <Coord type="polar" radius={0.8} />
          <Axis
            name="Code"
            line={null}
            tickLine={null}
            grid={{
              lineStyle: {
                lineDash: null,
                stroke: '#06D1CE',
              },
              hideFirstLine: false
            }}
            label={{
              textStyle:{
                fill:'#3269B9'
              }
            }}
          />
          <Tooltip />
          <Axis
            name="次数"
            line={null}
            tickLine={null}
            grid={{
              type: "polygon",
              lineStyle: {
                lineDash: null,
                stroke: '#06D1CE', // 网格线的颜色
              },
              
              alternateColor: "rgba(0, 0, 0, 0.04)"
            }}
            label={{
              textStyle:{
                fill:'#3269B9'
              }
            }}
          />
          <Geom type="area" position="Code*次数" 
          color="#34eda6" />
          <Geom type="line" position="Code*次数" 
          color="#34eda6" size={1} />
          <Geom
            type="point"
            position="Code*次数"
            color="#34eda6"
            shape="circle"
            size={3}
            style={{
              lineWidth: 1,
              fillOpacity: 1
            }}
          />
        </Chart>
      </div>
    );
  }
}





