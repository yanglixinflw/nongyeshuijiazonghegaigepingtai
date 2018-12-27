import React,{Component} from 'react'
import ReactEcharts from 'echarts-for-react'
import { Card } from 'antd';
export default class extends Component{
    _getData(){
        return(
            {
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: [120, 200, 150, 80, 70, 110, 130],
                    type: 'bar'
                }]
            }
        )
    }
    render(){
        return(
            <Card
                title="Card title"
            >
                <div>
                    <ReactEcharts 
                        option= {this._getData()}
                    />
                </div>
            </Card>
        ) 
    }
}