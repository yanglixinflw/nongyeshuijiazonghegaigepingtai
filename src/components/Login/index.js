import React from 'react';
import logo from '../../assets/logo.png'
import logoT from '../../assets/logoTitle.png'
import loginBox from '../../assets/loginBox.png'
import classnames from 'classnames'
import styles from './index.less'
import { Form, Button, Input, Checkbox } from 'antd'
export default class extends React.Component {
    constructor(props){
        super(props)
    }
    _loginSumbit() {
        // 登录功能回交route
        let {loginFunc} = this.props
        const form = this.loginForm.props.form;
        form.validateFields((err, values) => {
            loginFunc(err, values)
        })

    }
    render() {
        const {errorMassage}=this.props
        // console.log(errorMassage)
        return (
            <div className={styles.basic}>
                <header>
                    <img className={styles.logo} src={logo}></img>
                    <img className={styles.logoTitle} src={logoT} />
                </header>
                <div className={styles.content}>
                    <section>section</section>
                    {/* 登录框区域 */}
                    <aside>
                        <div className={styles.loginBox}>
                            <span className={styles.title}><img src={loginBox}></img></span>
                            {/* 登录组件 */}
                            <div className={styles.boxContent}>
                                <div className={styles.loginTitle}>登录</div>
                                <LoginForm
                                    wrappedComponentRef={(loginForm) => this.loginForm = loginForm}
                                    submitHandler={() => {
                                        this._loginSumbit()
                                    }}
                                />
                            </div>
                            <div className={styles.boxFooter}>
                                <div className={styles.footerLeft}></div>
                                <div className={styles.footerRight}>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
                <footer>footer</footer>
            </div>
        )
    }
}
const FormItem = Form.Item
const LoginForm = Form.create()(
    class extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                // 是否勾选自动登录
                autoLogin: false,
                // 是否显示验证码框
                showYzm: true,
                // showYzm: false,
                // 登录载入状态
                isLoading: false,
                // 提示信息
                errorMassage: ''
            }
        }
        _loadingLogin() {
            this.setState({
                isLoading: true,
                errorMassage: '密码错误'
            })
            // 模拟loading
            setTimeout(() => {
                this.setState({
                    isLoading: false,
                    errorMassage: ''
                })
            }, 2000)
            // 没有错误信息时消除loading并跳转
        }
        render() {
            const { showYzm, isLoading, errorMassage } = this.state
            const { form, submitHandler } = this.props
            const { getFieldDecorator } = form;
            // 设置输入密码的外边距
            let passWordMargin
            if (!showYzm) {
                passWordMargin = 0
            } else {
                passWordMargin = null
            }
            return (
                <div>
                    <Form
                        autoComplete="off"
                        onSubmit={submitHandler}
                    >
                        <FormItem style={{ marginLeft: 50 }}>
                            {
                                getFieldDecorator('userName', {
                                    initialValue: '',
                                    rules: [{ required: true, message: '请填写账号' }],
                                })(<Input
                                    type='text'
                                    autoComplete="off"
                                    className={styles.userInput}
                                    prefix={<i className={classnames('dyhsicon', 'dyhs-weidenglu', `${styles.userIcon}`)}></i>}
                                    placeholder='请输入用户名'>
                                </Input>)
                            }

                        </FormItem>
                        <FormItem style={{ marginLeft: 50, marginBottom: `${passWordMargin}` }}>

                            {
                                getFieldDecorator('pwd',
                                    {
                                        initialValue: '',
                                        rules: [
                                            { required: true, message: '密码不能为空' },
                                            { max: 20, message: '密码不超过20位' }
                                        ]
                                    })(
                                        <Input
                                            className={styles.userInput}
                                            autoComplete="off"
                                            type="password"
                                            prefix={<i className={classnames('dyhsicon', 'dyhs-mima', `${styles.userIcon}`)}></i>}
                                            placeholder='请输入密码'>
                                        </Input>
                                    )
                            }

                        </FormItem>
                        {
                            showYzm ?
                                <FormItem className={styles.yzmGroup}>
                                    {
                                        getFieldDecorator('verifyCode', {
                                            initialValue: '',
                                            rules: [
                                                { required: true, message: '验证码不能为空' },
                                            ]
                                        })(
                                            <Input
                                                className={styles.yzmInput}
                                                prefix={<i className={classnames('dyhsicon', 'dyhs-safe', `${styles.yzIcon}`)}></i>}
                                                placeholder='请输入验证码'></Input>
                                        )
                                    }

                                    <div className={styles.yzmwindow}>
                                    </div>
                                </FormItem>
                                : null
                        }

                        <div className={styles.remberBox}>
                            {/* <FormItem>
                                {
                                    getFieldDecorator('remeberPassWord', {
                                        initialValue: false,
                                    })(
                                        <Checkbox>记住密码</Checkbox>
                                    )
                                }

                            </FormItem> */}
                            <FormItem >
                                {
                                    getFieldDecorator('rememberMe', {
                                        initialValue: false,
                                    })(
                                        <Checkbox>自动登录</Checkbox>
                                    )
                                }

                            </FormItem>
                        </div>
                        <FormItem className={styles.loginButton} >
                            <Button
                                loading={isLoading}
                                onClick={() => this._loadingLogin()}
                                htmlType='submit'
                            >
                                登录
                            </Button>
                        </FormItem>
                        <FormItem style={{ marginBottom: 0, marginLeft: 50, color: 'white' }}>
                            {
                                errorMassage === '' ? null : <span>{errorMassage}</span>
                            }
                            {/* 显示区域 */}
                        </FormItem>
                    </Form>
                </div>
            )
        }
    }
)