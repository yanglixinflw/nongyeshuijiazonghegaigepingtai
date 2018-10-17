import React from 'react';
import logo from '../../assets/logo.png'
import logoT from '../../assets/logoTitle.png'
import loginBox from '../../assets/loginBox.png'
import styles from './index.less'
import { Form,Button } from 'antd'
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
                remberPaw: false,
                // 是否勾选自动登录
                autoLogin: false,
            }
        }
        render() {
            return (
                <div>
                    <Form>
                        <FormItem >
                            <input placeholder='请输入用户名'></input>
                        </FormItem>
                        <FormItem >
                            <input placeholder='请输入密码'></input>
                        </FormItem>
                        <FormItem >
                            <input placeholder='请输入验证码'></input>
                        </FormItem>
                        <FormItem >
                            记住密码
                        </FormItem>
                        <FormItem >
                            自动登录
                        </FormItem>
                        <FormItem >
                            <Button>登录</Button>
                        </FormItem>
                    </Form>
                </div>
            )
        }
    }
)