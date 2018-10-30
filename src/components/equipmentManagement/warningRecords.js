import React,{Component} from 'react';
import { Input, Button, Form, Cascader, Table, Modal} from 'antd';
//ip地址
const envNet='http://192.168.30.127:88';
//翻页调用
const dataUrl=`${envNet}/api/DeviceWaringRule/eventList`;
// post通用设置
let postOption = {
    method: 'POST',
    credentials: "include",
    mode: 'cors',
    headers: new Headers({
        'Content-Type': 'application/json',
    }),
}
//头信息
const tableTitle=[
    {index:"time",item:"预警时间"},
    {index:"waringType",item:"预警类型"},
    {index:"name",item:"预警名称"},
    {index:"eventContent",item:"事件内容"},
    {index:"warningStatus",item:"状态"},
    {index:"waringType",item:"预警类型"},
    {index:"name",item:"预警名称"},
    {index:"eventContent",item:"事件内容"},
]
export default class extends Component{
    render(){
        return(
            <div>
                
            </div>
        )
    }
}