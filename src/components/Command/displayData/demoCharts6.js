import React,{Component,Fragment} from 'react';
import ReactEcharts from 'echarts-for-react';
import { Card,DatePicker } from 'antd';
import styles from './demoCharts2.less';
export default class extends Component{
    _onChangeDate(date,dateString){
        console.log(date, dateString);
    }
    _getDataSix(){
        return(
            {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: {c} ({d}%)",
                    textStyle:{
                        color:'#327DF4',
                        fontSize:14
                    },
                },
                color:['#A30AEF','#FF7200','#21A2F6','#327DF4'],
                legend: {
                    orient: 'vertical',
                    // x: 'right',
                    top:50,
                    right:40,
                    // height:34,
                    itemGap:43,
                    padding:[10,22],
                    data:['直接访问','邮件营销','联盟广告','视频广告'],
                    itemWidth :15,
                    itemHeight :15,
                    textStyle:{
                        color :'#71BBF8',
                        fontSize:16
                    },
                    
                },
                series: [
                    {
                        name:'访问来源',
                        type:'pie',
                        center:['30%','50%'],
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
                        data:[
                            {value:335, name:'直接访问'},
                            {value:310, name:'邮件营销'},
                            {value:234, name:'联盟广告'},
                            {value:135, name:'视频广告'},
                        ],
                        itemStyle:{
                            // shadowColor: '#2B335E',
                            // shadowBlur: 10,
                            // shadowOffsetY:10,
                            // shadowOffsetX:10
                        }
                        
                    }
                ]
            }
        )
    }
    render(){
        return(
            <Fragment>
                <div 
                    className={styles.demoCharts6}
                    >
                    <Card
                        title="XXX"
                        extra={<DatePicker onChange={(date,dateString)=>this._onChangeDate(date,dateString)} />}
                    >
                        <ReactEcharts 
                            opts={{height:344}}
                            option={this._getDataSix()}
                        />
                    </Card>
                </div>
            </Fragment>
        )
       
    }
}