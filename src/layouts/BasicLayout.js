import React from 'react'
import classNames from 'classnames';
import { Layout, Icon } from 'antd';
import { Switch } from 'dva/router';
import { Route, Redirect } from 'react-router-dom';
import styles from './basicLayout.less'
import GlobalHeader from '../components/GlobalHeader'
// 响应式布局
import { ContainerQuery } from 'react-container-query';
import SliderMenu from 'components/SliderMenu/SliderMenu'
import NoRight from '../routes/Exception/403';
import { getRoutes } from '../utils/utils'
// 获取菜单列表
import { getMenuData } from '../common/menu';
import GlobalFooter from '../components/GlobalFooter';

const { Header, Footer, Sider, Content } = Layout;
/*
    根据菜单取得重定向地址
*/
const redirectData = [];
const getRedirect = item => {
    // console.log(item)
    if (item && item.children) {
        if (item.children[0] && item.children[0].path) {
            redirectData.push({
                from: `${item.path}`,
                to: `${item.children[0].path}`,
                // 默认第一个path
            });
            item.children.forEach(children => {
                getRedirect(children);
            });
        }
    }
};
getMenuData().forEach(getRedirect);

const query = {
    'screen-xs': {
        maxWidth: 575,
    },
    'screen-sm': {
        minWidth: 576,
        maxWidth: 767,
    },
    'screen-md': {
        minWidth: 768,
        maxWidth: 991,
    },
    'screen-lg': {
        minWidth: 992,
        maxWidth: 1199,
    },
    'screen-xl': {
        minWidth: 1200,
        maxWidth: 1599,
    },
    'screen-xxl': {
        minWidth: 1600,
    },
};
export default class BasicLayout extends React.PureComponent {
    // static childContextTypes = {
    //     location: PropTypes.object,
    // };
    // getChildContext() {

    // }
    constructor(props) {
        super(props)
        // console.log(props)
        this.state = {
            // 判断是否登录
            isLogin: false,
            // isLogin: true
        }
    }
    // 页面加载前获取权限列表和是否登录信息
    componentWillMount() {
        let loginOrNot = localStorage.getItem('welcome')
        if (loginOrNot >= 100) {
            this.setState({
                isLogin: true,
                // isLogin: false,
            })
        } else {
            this.setState({
                isLogin: false,
            })
        }

    }
    render() {
        // console.log(this.props.app._store)
        const { isLogin } = this.state
        const { match } = this.props.props
        const { routerData } = this.props
        // console.log(this.props.props.location.pathname)
        let pathname = this.props.props.location.pathname
        const { dispatch } = this.props.app._store
        const layout = (
            <Layout>
                <Sider>
                    <SliderMenu
                        menuData={getMenuData()}
                        location={location}
                    />
                </Sider>
                <Layout style={{ background: '#0A0C1D' }}>
                    <Header>
                        <GlobalHeader dispatch={dispatch}></GlobalHeader>
                    </Header>
                    <Content style={{ background: '#151837', minWidth: '800px' }}>
                        <Switch>
                            {redirectData.map(item => (
                                <Redirect key={item.from} exact from={item.from} to={item.to} />
                            ))}

                            {getRoutes(match.path, routerData).map(item => {
                                // debugger
                                return (
                                    <Route
                                        key={item.key}
                                        path={item.path}
                                        component={item.component}
                                        exact={item.exact}
                                    />
                                )
                            }
                            )}
                            {/* 登录前跳转login页面登录后跳转主页 */}
                            {
                                isLogin ? <Redirect exact from="/" to={redirectData[0].to} /> : <Redirect exact from='/' to='/login' />
                            }
                            <Route component={NoRight} />
                        </Switch>
                    </Content>
                    {pathname == '/gismap/gismapPage'||"/automation/autoRules" ? null :
                        <Footer style={{ background: '#151837' }}>
                            <GlobalFooter
                                links={[
                                ]}
                                copyright={
                                    <div style={{ color: '#95A5A6' }}>
                                        Copyright <Icon type="copyright" /> www.dyjs.com, All Rights Reserved.
                        </div>
                                }
                            />
                        </Footer>
                    }

                </Layout>
            </Layout>
        )
        return (
            <div className={styles.basic}>
                <ContainerQuery query={query}>
                    {params => <div className={classNames(params)}>{layout}</div>}
                </ContainerQuery>
            </div>
        );
    }

}

