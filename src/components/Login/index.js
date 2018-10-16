import React from 'react';
import logo from '../../assets/logo.png'
import logoT from '../../assets/logoTitle.png'
import loginBox from '../../assets/loginBox.png'
import styles from './index.less'
import {Form} from 'antd'
export default class extends React.Component {

    render() {
        return (
            <div className={styles.basic}>
                <header>
                    <img className={styles.logo} src={logo}></img>
                    <img className={styles.logoTitle} src={logoT}/>    
                </header>
                <div className={styles.content}>
                <section>section</section>
                {/* 登录框区域 */}
                <aside>
                    <div className={styles.loginBox}>
                        <img className={styles.title} src={loginBox}></img>
                        <div className={styles.boxContent}>
                            
                        </div>
                    </div>
                </aside>
                </div>
                <footer>footer</footer>
            </div>
        )
    }
}

const LoginForm = Form.create()(
    class extends React.Component{
        render(){
            <div>123</div>
        }
    }
)