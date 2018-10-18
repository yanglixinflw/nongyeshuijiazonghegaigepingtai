import React from 'react';
import logo from '../../assets/logo.png'
import logoT from '../../assets/logoTitle.png'
import loginBox from '../../assets/loginBox.png'
import classnames from 'classnames'
import styles from './index.less'
import { Form, Button, Input, Checkbox } from 'antd'
export default class extends React.Component {
    render() {
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
                // 是否勾选记住密码
                remberPwd: false,
                // 是否勾选自动登录
                autoLogin: false,
                // 是否显示验证码框
                showYzm: true,
                // showYzm: false,
                // 登录载入状态
                isLoading:false
            }
        }
        _loadingLogin(){
            
            this.setState({
                isLoading:true
            })
            // 模拟loading
            setTimeout(()=>{
                this.setState({
                    isLoading:false
                })
            },2000)
        }
        render() {
            const { showYzm ,isLoading} = this.state
            // 设置输入密码的外边距
            let passWordMargin
            if(!showYzm){
                 passWordMargin=0
            }else{
                 passWordMargin=null
            }
            return (
                <div>
                    <Form>
                        <FormItem style={{ textAlign: 'center' }}>
                            <Input className={styles.userInput}
                                prefix={<i className={classnames('dyhsicon', 'dyhs-weidenglu', `${styles.userIcon}`)}></i>}
                                placeholder='请输入用户名'></Input>
                        </FormItem>
                        <FormItem style={{ textAlign: 'center', marginBottom: `${passWordMargin}` }}>
                            <Input className={styles.userInput}
                                prefix={<i className={classnames('dyhsicon', 'dyhs-mima', `${styles.userIcon}`)}></i>}
                                placeholder='请输入密码'></Input>
                        </FormItem>
                        {
                            showYzm ?
                                <FormItem className={styles.yzmGroup}>
                                    <Input
                                        className={styles.yzmInput}
                                        prefix={<i className={classnames('dyhsicon', 'dyhs-safe', `${styles.yzIcon}`)}></i>}
                                        placeholder='请输入验证码'></Input>
                                    <div className={styles.yzmwindow}>
                                    </div>
                                </FormItem>
                                : null
                        }

                        <div className={styles.remberBox}>
                            <FormItem>
                                <Checkbox>记住密码</Checkbox>
                            </FormItem>
                            <FormItem >
                                <Checkbox>自动登录</Checkbox>
                            </FormItem>
                        </div>
                        <FormItem className={styles.loginButton} >
                            <Button
                            loading={isLoading}
                            onClick={()=>this._loadingLogin()}
                            >
                                登录
                            </Button>
                        </FormItem>
                        <FormItem style={{marginBottom:0,marginLeft:50,color:'white'}}>
                            <span></span>
                            {/* 显示区域 */}
                        </FormItem>
                    </Form>
                </div>
            )
        }
    }
)