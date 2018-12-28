import React, { Component } from 'react';
import DemoChartsFour from '../../components/Command/displayData/demoCharts4'
export default class extends Component {
    render() {
        return (
            // 给父级提供高度100% 子才能有100%高度
            <div style={{height:'100%',background:'#08173E'}}>
                <DemoChartsFour/>
            </div>
        )
    }
}