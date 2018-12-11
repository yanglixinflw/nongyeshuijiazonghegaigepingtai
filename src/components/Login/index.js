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
    _loginSumbit(e) {
        // console.log(e)
        // 阻止默认行为
        e.preventDefault()
        // 登录功能回交route
        let {loginFunc} = this.props
        const form = this.loginForm.props.form;
        form.validateFields((err, values) => {
            loginFunc(err, values)
        })

    }
    render() {
        const {
            errorMessage,
            CAPTCHA,
            reloadCAPTCHA,
            errorCount
        }=this.props

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
                                    submitHandler={(e) => {
                                        this._loginSumbit(e)
                                    }}
                                    errorMessage={errorMessage}
                                    errorCount={errorCount}
                                    {...CAPTCHA}
                                    reloadCAPTCHA={reloadCAPTCHA}
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
            let firstLogin= localStorage.getItem('firstLogin')
            if(firstLogin==null){
                firstLogin=true
            }else{
                firstLogin=false
            }
            // console.log(firstLogin)
            this.state = {
                // 是否勾选自动登录
                autoLogin: false,
                // 是否显示验证码框
                showYzm: firstLogin,
                // showYzm: true,
                // 登录载入状态
                isLoading: false,
            }
        }
        _loadingLogin() {
            this.setState({
                isLoading: true,
            })
            // 模拟loading
            setTimeout(() => {
                this.setState({
                    isLoading: false,
                })
            }, 2000)
            // 没有错误信息时消除loading并跳转
        }
        // 监听props变化
        componentWillReceiveProps(){
            let {errorCount}=this.props
            if(errorCount>=2){
                this.setState({
                    showYzm:true
                })
                return true
            }
        }
        render() {
            const { showYzm, isLoading } = this.state
            const { form, submitHandler,errorMessage ,url,reloadCAPTCHA,errorCount} = this.props
            const { getFieldDecorator } = form;
            // 设置输入密码的外边距
            let passWordMargin
            if (!showYzm) {
                passWordMargin = 25
            } else {
                passWordMargin = null
            }
            console.log(showYzm)
            return (
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
                                    {/* 点击刷新 */}
                                    <div className={styles.yzmwindow} onClick={reloadCAPTCHA} >
                                    <img src={url}/>
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
                                errorMessage === '' ? null : 
                                <span className={errorMessage === '' ? null : styles.shake}>{errorMessage}
                                </span>
                            }
                            {/* 显示区域 */}
                        </FormItem>
                    </Form>
            )
        }
    }
)