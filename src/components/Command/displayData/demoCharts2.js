import React,{Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import { Card } from 'antd';
export default class extends Component{
    _getData(){
        return(
            {

            }
        )
    }
    render(){
        return(
            <div className={styles.demoCharts2}>
                <ReactEcharts 
                    option={this._getData()}
                />
            </div>
        )
       
    }
}