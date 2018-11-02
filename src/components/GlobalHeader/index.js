import React from 'react';
import styles from './index.less'
import { routerRedux } from 'dva/router';
import { Button, Menu, Dropdown, Icon ,Modal,Badge,Switch} from 'antd'
// 开发环境
const envNet = 'http://192.168.30.127:88'
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
//假数据
var data=[
    {dev:"12345",name:"设备电量低",build:"一号闸阀井",content:'慧水井电双控功能异常',time:"2018-9-10 22:30:10",waringStatus:"预警"},
    {dev:"12346",name:"设备电量低",build:"一号闸阀井",content:'慧水井电双控功能异常',time:"2018-9-10 22:30:10",waringStatus:"预警"},
    {dev:"12347",name:"设备电量低",build:"一号闸阀井",content:'慧水井电双控功能异常',time:"2018-9-10 22:30:10",waringStatus:"正常"},
    {dev:"12348",name:"设备电量低",build:"一号闸阀井",content:'慧水井电双控功能异常',time:"2018-9-10 22:30:10",waringStatus:"预警"},
    {dev:"12349",name:"设备电量低",build:"一号闸阀井",content:'慧水井电双控功能异常',time:"2018-9-10 22:30:10",waringStatus:"正常"},
    {dev:"12344",name:"设备电量低",build:"一号闸阀井",content:'慧水井电双控功能异常',time:"2018-9-10 22:30:10",waringStatus:"预警"},
]
// 确认退出className
const confirmLogout=styles.confirmLogout
const confirm = Modal.confirm;
export default class extends React.Component {
    constructor(props) {
        super(props)
        const downData = (
            <Menu>
                <Menu.Item
                onClick={()=>{console.log('修改密码')}}
                >
                    修改密码
                </Menu.Item>
                <Menu.Item
                onClick={()=>this._showConfirm()}
                >
                    退出登录
                </Menu.Item>
            </Menu>
        );
        const menu = (
            <Menu style={{width:0,height:0}}>
              
            </Menu>
          );
        this.state = {
            menu,
            //数据源
            data,
            downData,
            //预警事件的个数
            count: 0,
            //预警事件弹出框红点是否显示
            show: true,
            //搜索框初始值
            searchValue: {
                "waringType": 1,
                "warningStatus": 1,
                "deviceId": "",
                "installAddr": "",
                "pageIndex": 0,
                "pageSize": 10
            },
            //预警事件弹出框默认隐藏
            visible: false
        }
    }
    componentDidMount() {
        this._getTableDatas(this.state.data);
    }
    _getTableDatas(data){
        let tableDatas = [];
        //出现预警的数据
        data.map((v, i) => {
            if(v.waringStatus=="预警"){
                tableDatas.push(v);
            };
            v.key = i;
        })
        if(tableDatas.length>0){
           var menus=(
            <Menu>
                {
                    tableDatas.map(function(v,i){
                        return <Menu.Item key={i}>
                                    <a href={`/#/manage/warning`}>{'【设备异常】'+" "+v.content+" "+v.time}</a>
                                </Menu.Item>
                    })
                
                }
            </Menu>
           )
        }
        this.setState({
            data:tableDatas,
            count:tableDatas.length,
            menu:menus
        })
    }
    // _getTableDatas(){
    //     const { searchValue } = this.state;
    //     fetch(dataUrl, {
    //         ...postOption,
    //         body: JSON.stringify({
    //             ...searchValue
    //         })
    //     }).then((res)=>{
    //         Promise.resolve(res.json())
    //         .then((v)=>{
    //             if(v.ret==1){
    //                 // console.log(v);
    //                 // 设置页面显示的元素
    //                 let data = v.data.items;
    //                 let tableDatas = [];
    //                 //添加key      //出现预警的数据
    //                 data.map((v, i) => {
    //                     if(v.waringStatus==2){
    //                         tableDatas.push(v);
    //                     };
    //                     v.key = i;
    //                 })
    //                 this.setState({
    //                     tableDatas,
    //                     // count:tableDatas.length
    //                 })
    //             }
    //         })
    //         .catch((err)=>{
    //             console.log(err)
    //         })
    //     })
    // }
     // 退出登录
  _showConfirm(){
    const {dispatch}=this.props
    confirm({
      className:confirmLogout,
      iconType:'none',
      title: '确认退出？',
      okText:'确认',
      cancelText:'取消',
      onOk() {
        // console.log(1)
        return fetch(`${envNet}/api/Account/logout`, {
          method: 'POST',
          credentials: "include",
          mode: 'cors',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
        }).then((res) => {
          Promise.resolve(res.json())
            .then((v) => {
            //   console.log(v)
            if (v.ret==1){
                localStorage.clear()
                // 退出登录
                dispatch(routerRedux.push('/login'));
            }
            })
        })
      },
      onCancel() {
        return
      },
    });
  }
    render() {
        const { downData,menu} = this.state
        return (
            <div className={styles.header}>
                <Dropdown overlay={menu} trigger={['click']}>
                    <Badge count={this.state.count}>
                        <Button icon='bell' className={styles.news}>预警消息</Button>
                    </Badge>
                </Dropdown>
                <Dropdown overlay={downData}>
                    <Button icon='user' className={styles.user}>
                        用户名 <Icon type='down'></Icon>
                    </Button>
                </Dropdown>
            </div>
        )
    }
}