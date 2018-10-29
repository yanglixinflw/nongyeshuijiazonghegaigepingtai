import React from 'react';
import styles from './index.less'
import { routerRedux } from 'dva/router';
import { Button, Menu, Dropdown, Icon ,Modal} from 'antd'
// 开发环境
const envNet = 'http://192.168.30.127:88'
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
            downData
        }
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
                <Button icon='bell' className={styles.news}>预警消息</Button>
                <Dropdown overlay={downData}>
                    <Button icon='user' className={styles.user}>
                        用户名 <Icon type='down'></Icon>
                    </Button>
                </Dropdown>
            </div>
        )
    }
}
