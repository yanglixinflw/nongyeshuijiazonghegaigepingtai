import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import {getMenuData,formatter} from '../../common/menu'
function IndexPage() {
  console.log(getMenuData())
  return (
    <div>
      地图页new
    </div>
  );
}

IndexPage.propTypes = {
};

export default IndexPage;
