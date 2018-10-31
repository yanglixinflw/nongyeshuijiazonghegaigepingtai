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
//头信息
const tableTitle=[
    {index:"time",item:"预警时间"},
    {index:"waringType",item:"预警类型"},
    {index:"name",item:"预警名称"},
    {index:"eventContent",item:"事件内容"},
    {index:"warningStatus",item:"状态"},
    {index:"deviceId",item:"设备ID"},
    {index:"building",item:"关联建筑物"}
]
const menu = (
    <Menu>
        <Menu.Item key="0">
            <a href="#">1st menu item1st menu item1st menu item1st menu item1st menu item</a>
        </Menu.Item>
    </Menu>
  );
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
        this.state = {
            //预警事件的内容
            menu,
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
        }
    }
    componentDidMount() {
        this._getTableDatas(this.state.data);
    }
    _getTableDatas(){
        const { searchValue } = this.state;
        fetch(dataUrl, {
            ...postOption,
            body: JSON.stringify({
                ...searchValue
            })
        }).then((res)=>{
            Promise.resolve(res.json())
            .then((v)=>{
                if(v.ret==1){
                    // console.log(v);
                    // 设置页面显示的元素
                    let data = v.data.items;
                    let tableDatas = [];
                    //添加key      //出现预警的数据
                    data.map((v, i) => {
                        if(v.waringStatus==2){
                            tableDatas.push(v);
                        };
                        v.key = i;
                    })
                    this.setState({
                        tableDatas,
                        count:tableDatas.length
                    })
                }
            })
            .catch((err)=>{
                console.log(err)
            })
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
        const { downData } = this.state
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
