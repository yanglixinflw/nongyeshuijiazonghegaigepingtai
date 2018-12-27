import React from "react";
import {
    Chart,
    Geom,
    Axis,
    Tooltip,
} from "bizcharts";
import DataSet from "@antv/data-set";
export default class extends React.Component {
    constructor(props){
        super(props)
        const {powerChart} = this.props;
        this.state = {
            data:powerChart,
        }
    }
    componentDidMount() {
        window.dispatchEvent(new Event('resize'));
    }
    render() {
        const {data} = this.state;
        const ds = new DataSet();
        const dv = ds.createView().source(data);
        dv.transform({
            type: "fold",
            // 展开字段集
            fields: ["电量"],
            // key字段
            key: "用电量",
            // value字段
            value: "电量"
        });
        //   console.log(dv);
        const cols = {
            日期: {
                range: [0, 1]
            },
            sales: {
                alias: '标题名称'
            }
            // title:'用电量(KW/H)'
        };
        return (
            <Chart  height={290} data={dv} scale={cols} forceFit>
                <Axis
                    name='日期'
                    label={{
                        textStyle: {
                            textAlign: 'center', // 文本对齐方向，可取值为： start center end
                            fill: '#336bbc'
                        }
                    }}
                />
                <Axis
                    name='电量'
                    label={{
                        formatter: val => `${val}`,
                        textStyle: {
                            fill: '#336bbc'
                        }
                    }}
                    grid={{
                        lineStyle: {
                            stroke: '#214082', // 网格线的颜色}
                        }
                    }}
                />
                <Tooltip
                    crosshairs={{
                        type: 'y'
                    }}
                    itemTpl='<li data-index={index}><span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>用电量：{value}KW·H</li>'
                />
                <Geom
                    type="area"
                    position="日期*电量"
                    size={2}
                    color={'#1DF39F'}
                // shape={"smooth"}
                />
            </Chart>
        );
    }
}


