import React from 'react';
import {getMenuData,formatter} from '../../common/menu'
function IndexPage() {
  console.log(getMenuData())
  return (
    <div>
      登录页
    </div>
  );
}

IndexPage.propTypes = {
};

export default IndexPage;
