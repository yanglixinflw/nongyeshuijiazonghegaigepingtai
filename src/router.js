import React from 'react';
import { routerRedux, Switch } from 'dva/router';
import { Route, Redirect } from 'react-router-dom';
import { getRouterData } from './common/router';
const { ConnectedRouter } = routerRedux
// app为顶层信息
function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const loginLayout = routerData['/login'].component
  // 定义首屏
  const BasicLayout = routerData['/'].component;
  // console.log(BasicLayout)
  return (
    <ConnectedRouter history={history}>
      <Switch>
        <Route path="/login" exact component={loginLayout} />
        {/* 动态注册route */}
        <Route
          path="/"
          render={
          props => <BasicLayout {...{ props, app }} />}
        />
      </Switch>
    </ConnectedRouter>
  );
}

export default RouterConfig;
