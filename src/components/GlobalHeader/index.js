import React from 'react';
import styles from './index.less'
import { Button, Menu, Dropdown, Icon } from 'antd'

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
                onClick={()=>{console.log('退出登录')}}
                >
                    退出登录
                </Menu.Item>
            </Menu>
        );
        this.state = {
            downData
        }
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
