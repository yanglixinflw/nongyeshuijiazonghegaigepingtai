import React from 'react';
import styles from './index.less'
import { routerRedux } from 'dva/router';
import { Button, Menu, Dropdown, Icon ,Modal,Badge} from 'antd'
import {Link} from 'dva/router';
import {ENVNet,postOption} from '../../services/netCofig'
// 预警事件列表
const dataUrl=`${ENVNet}/api/DeviceWaringRule/eventList`;
// 确认退出className
const confirmLogout=styles.confirmLogout
const confirm = Modal.confirm;
export default class extends React.Component {
    constructor(props) {
        super(props)
        const downData = (
            <Menu>
                <Menu.Item
                onClick={()=>this.changePsw()}
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
            downData,
            //数据源
            warningDatas:[],
            //预警事件的个数
            count: 0,
        }
    }
    componentDidMount() {
        fetch(dataUrl,{
            ...postOption,
            body: JSON.stringify({
                "pageIndex": 0,
                "pageSize": 10
            })
        }).then(res=>{
            Promise.resolve(res.json())
                .then(v=>{
                    if(v.ret==1){
                        // console.log(v.data.items)
                        let data=v.data.items;
                        let warningDatas=[];
                        data.map((v, i) => {
                            if(v.warningStatus==1){
                                warningDatas.push(v);
                            };
                            v.key = i;
                        })
                        if(warningDatas.length>0){
                            var menu=(
                             <Menu>
                                 {
                                     warningDatas.map(function(v,i){
                                         return <Menu.Item key={i}>
                                                     <Link to={`/manage/warning`}>{'【设备异常】'+" "+v.eventContent+" "+v.time}</Link>
                                                 </Menu.Item>
                                     })
                                 
                                 }
                             </Menu>
                            )
                        }else{
                            var menu = (
                                <Menu style={{width:0,height:0}}>
                                </Menu>
                            );
                        }
                        this.setState({
                            warningDatas,
                            count:warningDatas.length,
                            menu
                        })
                    }
                })
        })
    }
    // 修改密码
    changePsw(){
        console.log(123)
    }
    //点击预警消息清空气泡
    clear(){
        this.setState({
            count:0
        })
    }
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
        return fetch(`${ENVNet}/api/Account/logout`, {
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
        let userName ={
            get value(){
                let username = localStorage.getItem('userName')
                return {username}
            }
        }
        // console.log(userName.value.username)
        return (
            <div className={styles.header}>
                <Dropdown overlay={menu} trigger={['click']}>
                    <Badge count={this.state.count}>
                        <Button icon='bell' className={styles.news} onClick={()=>this.clear()}>预警消息</Button>
                    </Badge>
                </Dropdown>
                <Dropdown overlay={downData}>
                    <Button icon='user' className={styles.user}>
                        {userName.value.username}<Icon type='down'></Icon>
                    </Button>
                </Dropdown>
            </div>
        )
    }
}