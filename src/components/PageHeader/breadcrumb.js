import React, { PureComponent } from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'dva/router'
import { urlToList } from '../_utils/pathTools';
import { getMenuData } from '../../common/menu';
import styles from './index.less';
class BreadcrumbView extends PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const { location } = this.props;
    let breadcrumbData = [];
    let breadcrumbChildrenData = [];
    let breadcrumbGrandsonData = [];
    const historyName = "历史记录";
    if (!location) {
      return null
    }
    const pathSnippets = urlToList(location.pathname);

    breadcrumbData = getMenuData().filter(
      (item) => {
        let res = item.children.filter(item => item.path.indexOf(pathSnippets[0])!==-1);
        if(res.length){
          return item
        }
      }

    )
    // console.log(breadcrumbData)
    breadcrumbChildrenData = breadcrumbData[0].children;
    if (!breadcrumbChildrenData) {
      return null
    }
    breadcrumbGrandsonData = breadcrumbChildrenData.filter(item => item.children)[0];
    if (breadcrumbGrandsonData) {
      breadcrumbGrandsonData = breadcrumbGrandsonData.children
    }
    return (
      <Breadcrumb className={styles.breadcrum}>
        {
          <Breadcrumb.Item key={0}>
            {breadcrumbData[0].path ? (<Link to={breadcrumbData[0].path}>{breadcrumbData[0].name}</Link>) : breadcrumbData[0].name}
          </Breadcrumb.Item>
        }
        {breadcrumbChildrenData ? breadcrumbChildrenData.map((v, i) => (
          <Breadcrumb.Item key={1}>
            {v.path.indexOf(pathSnippets[0]) !== -1 ? (<Link to={v.path}>{v.name}</Link>) : ''}
          </Breadcrumb.Item>
        )) : null
        }
        {breadcrumbGrandsonData ? breadcrumbGrandsonData.map((v, i) => (
          <Breadcrumb.Item key={2}>
            {v.path.indexOf(pathSnippets[0]) !== -1 ? (<Link to={v.path}>{v.name}</Link>) : ''}
          </Breadcrumb.Item>
        )) : null
        }
        {location.pathname.indexOf("/history") !== -1 ?
          <Breadcrumb.Item key={3}>
            {<Link to={pathSnippets[pathSnippets.length - 1]}>{historyName}</Link>}
          </Breadcrumb.Item> : ''
        }


      </Breadcrumb>
    )
  }
}

export default BreadcrumbView;
