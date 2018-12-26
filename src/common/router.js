import React, { createElement } from 'react';
import { Spin } from 'antd';
import pathToRegexp from 'path-to-regexp';
import Loadable from 'react-loadable';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
    //判断models是否全部存在   
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// 动态注册models
const dynamicWrapper = (app, models, component) => {
  // register models
  models.forEach(model => {
    if (modelNotExisted(app, model)) {
      // eslint-disable-next-line
      app.model(require(`../models/${model}`).default);
    }
  });

  if (component.toString().indexOf('.then(') < 0) {
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  return Loadable({
    loader: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
    loading: () => {
      return <Spin size="large" className="global-spin" />;
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, [], () => import('../layouts/BasicLayout')),
    }, 
    '/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/login')),
    }, 
    '/gismap/gismapPage':{
      component: dynamicWrapper(app, ['mapGis'], () => import('../routes/gisMap')),
    },
    '/deviceData/dataCenter':{
      component: dynamicWrapper(app, [], () => import('../routes/deviceData/dataCenter')),
    },
    '/deviceData/device:id':{
      component: dynamicWrapper(app, ['deviceData'], () => import('../routes/deviceData/deviceData')),
    },
    '/device:id/history:id':{
      component: dynamicWrapper(app, ['deviceDataHistory'], () => import('../routes/deviceData/deviceDataHistory')),
    },
    '/messageManagement/deviceInformation':{
      component: dynamicWrapper(app, ['deviceInformation'], () => import('../routes/messageManagement/deviceInfo')),
    },
    '/deviceInformation/warningDetail:id':{
      component: dynamicWrapper(app, ['warningDetail'], () => import('../routes/messageManagement/warningDetail')),
    },
    '/messageManagement/farmerInfor':{
      component: dynamicWrapper(app, ['farmersInfo'], () => import('../routes/messageManagement/farmersInfo')),
    },
    '/messageManagement/warningRules':{
      component: dynamicWrapper(app, ['warningRules'], () => import('../routes/messageManagement/warningRules')),
    },
    '/warningRules/addWarningRules':{
      component: dynamicWrapper(app, [], () => import('../routes/messageManagement/addWarningRules')),
    },
    '/warningRules/rulesDetail:id':{
      component: dynamicWrapper(app, ['rulesDetail'], () => import('../routes/messageManagement/rulesDetail')),
    },
    '/system/userManagement':{
      component: dynamicWrapper(app, ['userManagement'], () => import('../routes/systemManagement/userManagement')),
    },
    '/manage/warning':{
      component: dynamicWrapper(app, ['warningRecords'], () => import('../routes/equipmentManagement/warningRecords')),
    },
    '/warning/map:id':{
      component: dynamicWrapper(app, [], () => import('../routes/equipmentManagement/mapWarning')),
    },
    // '/dcs/remote':{
    //   component: dynamicWrapper(app, [], () => import('../routes/distributedControl/remoteControl')),
    // },
    '/dcs/valveControl':{
      component: dynamicWrapper(app, ['valveControl'], () => import('../routes/distributedControl/valveControl')),
    },
    '/valveControl/map':{
      component: dynamicWrapper(app, [], () => import('../routes/distributedControl/mapControl')),
    },
    '/valveControl/operatingRecord:id':{
      component: dynamicWrapper(app, ['operatingRecord'], () => import('../routes/distributedControl/operatingRecord')),
    },
    '/dcs/automation':{
      component: dynamicWrapper(app, ["autoControl"], () => import('../routes/distributedControl/autoControl')),
    },
    '/automation/autoRules:id':{
      component: dynamicWrapper(app, ["autoRules"], () => import('../routes/distributedControl/autoRules')),
    },
    // 可调用式视频播放页面
    '/command/videoMonitoring:id':{
      component: dynamicWrapper(app, ['monitor'], () => import('../routes/command/monitor')),
    },
    '/command/videoMonitoring':{
      component: dynamicWrapper(app, ['monitor'], () => import('../routes/command/monitor')),
    },
    '/rent/groupAccount':{
      component: dynamicWrapper(app, ["groupAccount"], () => import('../routes/waterRate/groupAccount')),
    },
    '/groupAccount/dealRecord:id':{
      component: dynamicWrapper(app, ["dealRecord"], () => import('../routes/waterRate/dealRecord')),
    },
    '/groupAccount/groupManage:id':{
      component: dynamicWrapper(app, ["groupManage"], () => import('../routes/waterRate/groupManage')),
    },
    '/messageManagement/device':{
      component: dynamicWrapper(app, ['chargingDevice'], () => import('../routes/waterRate/chargingDevice')),
    },
    // '/user': {
    //   component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    // },
    // '/user/login': {
    //   component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    // },
    
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    router = {
      ...router,
      name: router.name || menuItem.name,
    };
    routerData[path] = router;
  });
  return routerData;
};
