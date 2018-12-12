import React from 'react';
import styles from './index.less'
import { routerRedux } from 'dva/router';
import { Button, Menu, Dropdown, Icon, Modal, Badge, Form, Input, message } from 'antd'
import { Link } from 'dva/router';
import { ENVNet, postOption } from '../../services/netCofig'
import classnames from 'classnames';
import { timeOut } from '../../utils/timeOut';
// 预警事件列表
const dataUrl = `${ENVNet}/api/DeviceWaringRule/eventList`;
// 修改用户密码
const changePassWordUrl = `${ENVNet}/api/Account/changePwd`
// 确认退出className
const confirmLogout = styles.confirmLogout
const confirm = Modal.confirm;
export default class extends React.Component {
    constructor(props) {
        super(props)

        const downData = (
            <Menu>
                <Menu.Item
                    onClick={() => this.changePsw()}
                >
                    修改密码
                </Menu.Item>
                <Menu.Item
                    onClick={() => this._showConfirm()}
                >
                    退出登录
                </Menu.Item>
            </Menu>
        ); 
        const menu = (
            <Menu style={{ width: 0, height: 0 }}>
            </Menu>
        );
        this.state = {
            menu,
            downData,
            //数据源
            warningDatas: [],
            //预警事件的个数
            count: 0,
            // 修改密码弹窗
            modifyPasswordVisble: false
            // modifyPasswordVisble: true
        }
    }
    componentDidMount() {
        fetch(dataUrl, {
            ...postOption,
            body: JSON.stringify({
                "pageIndex": 0,
                //只判断了一页
                "pageSize": 10
            })
        }).then(res => {
            Promise.resolve(res.json())
                .then(v => {
                    if (v.ret == 1) {
                        let data = v.data.items;
                        let warningDatas = [];
                        data.map((v, i) => {
                            if (v.warningStatus == 1) {
                                warningDatas.push(v);
                            };
                            v.key = i;
                        })
                        if (warningDatas.length > 0) {
                            var menu = (
                                <Menu>
                                    {
                                        warningDatas.map(function (v, i) {
                                            return <Menu.Item key={i}>
                                                <Link to={{pathname:`/manage/warning`}}><Button>{'【设备异常】' + " " + v.eventContent + " " + v.time}</Button></Link>
                                            </Menu.Item>
                                        })
                                    }
                                </Menu>
                            )
                        } else {
                            var menu = (
                                <Menu style={{ width: 0, height: 0 }}>
                                </Menu>
                            );
                        }
                        this.setState({
                            warningDatas,
                            count: warningDatas.length,
                            menu
                        })
                    }
                })
        })
    }
    // 修改密码
    changePsw() {
        this.setState({
            modifyPasswordVisble: true,
        });
    }
    // 退出登录
    _showConfirm() {
        const { dispatch } = this.props
        confirm({
            className: confirmLogout,
            // iconType: 'none',
            title: '确认退出？',
            okText: '确认',
            cancelText: '取消',
            // centered,
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
                            if (v.ret == 1) {
                                // localStorage.clear()
                                // 初始化登录状态
                                localStorage.removeItem('monitorNum')
                                localStorage.removeItem('userName')
                                localStorage.removeItem('welcome')
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
        const { downData, menu, modifyPasswordVisble } = this.state
        // 获取用户名
        let userName = {
            get value() {
                let username = localStorage.getItem('userName')
                return { username }
            }
        }
        return (
            <div className={styles.header}>
                <Dropdown overlay={menu} trigger={['click']}>
                    <Badge count={this.state.count}>
                        <div className={styles.news}>
                            <i className={classnames('dyhsicon', 'dyhs-yujingshijian', `${styles.headerIcon}`)}></i>
                            <Button>预警消息</Button>
                        </div>
                    </Badge>
                </Dropdown>
                <Dropdown overlay={downData}>
                    <div className={styles.user}>
                        <i className={classnames('dyhsicon', 'dyhs-zhanghudenglu', `${styles.headerIcon}`)}></i>
                        <Button>
                            {userName.value.username}<Icon type='down'></Icon>
                        </Button>
                    </div>
                </Dropdown>
                <ChangePwdForm
                    wrappedComponentRef={(ChangePwdForm) => this.ChangePwdForm = ChangePwdForm}
                    visible={modifyPasswordVisble}
                    onCancel={() => this.changePwdCancelHandler()}
                    onOk={() => this.changePwdOkHandler()}
                />
            </div>
        )
    }
}
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};
const ChangePwdForm = Form.create()(
    class extends React.Component {
        state = {
            confirmDirty: false,
        };
        compareToFirstPassword = (rule, value, callback) => {
            const form = this.props.form;
            if (value && value == form.getFieldValue('oldPwd')) {
                callback('两次输入密码不能相同!');
            } else {
                callback();
            }
        }

        validateToNextPassword = (rule, value, callback) => {
            const form = this.props.form;
            if (value && this.state.confirmDirty) {
                form.validateFields(['newPwd'], { force: true });
            }
            callback();
        }
        render() {
            const { visible, onCancel, onOk, form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    centered={true}
                    className={styles.editPwdModal}
                    visible={visible}
                    title="修改密码"
                    onCancel={onCancel}
                    onOk={onOk}
                    cancelText='取消'
                    okText='确定'
                >
                    <Form>
                        <Form.Item
                            {...formItemLayout}
                            label="旧密码"
                        >
                            {getFieldDecorator('oldPwd', {
                                rules: [{
                                    required: true, pattern: '^[0-9a-zA-Z]{6,20}$', message: '请输入旧密码'
                                },
                                { validator: this.validateToNextPassword }
                                ],
                            })(
                                <Input placeholder='请输入旧密码' type="password" />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="新密码"
                        >
                            {getFieldDecorator('newPwd', {
                                rules: [
                                    { required: true, pattern: '^[0-9a-zA-Z]{6,20}$', message: '输入新密码', },
                                    { min: 6, message: '不要小于6个字符' },
                                    { max: 20, message: '不要超过20个字符' },
                                    { validator: this.compareToFirstPassword }
                                ],
                            })(
                                <Input type="password" placeholder='密码由6~20位字母和数字组成' onBlur={this.onBlur} />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            )
        }

    }
)
