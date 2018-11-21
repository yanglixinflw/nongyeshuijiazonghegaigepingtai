import React from 'react';
import { routerRedux, Switch } from 'dva/router';
import { Route} from 'react-router-dom';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { getRouterData } from './common/router';
const { ConnectedRouter } = routerRedux
// app为顶层信息
function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const loginLayout = routerData['/login'].component
  // 定义首屏
  const BasicLayout = routerData['/'].component;
  const MapLayout =routerData['/valveControl/map'].component;
  const WarningLayout = routerData['/warning/map:id'].component;
  // console.log(MapLayout)
  return (
    <LocaleProvider locale={zhCN}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route path="/login" exact component={loginLayout} />
        <Route path='/valveControl/map' exact  component={MapLayout}/>
        <Route path='/warning/map:id' exact  component={WarningLayout}/>
        {/* 动态注册route */}
        <Route
          path="/"
          render={
          props => <BasicLayout {...{ props, app }} />}
        />
        
      </Switch>
    </ConnectedRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;
