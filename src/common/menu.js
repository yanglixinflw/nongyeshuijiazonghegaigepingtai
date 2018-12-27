import { isUrl } from '../utils/utils';
// 权限菜单，选择性菜单消失或存在
const menuData = [
  {
    name: 'Gis地图',
    icon: 'dyhs-weibiaoti',
    path: 'gismap',
    children: [
      {
        name: 'Gis地图',
        path: 'gismapPage'
      }
    ]
  },
  {
    name: '指挥中心',
    icon: 'dyhs-zhihui',
    path: 'command',
    children: [
      {
        name: '视频监控',
        path: 'videoMonitoring'
      },
      {
        name: '数据分析',
        path: 'dataCenter'
      }
    ]
  },
  {
    name: '集散控制',
    icon: 'dyhs-jisankongzhi',
    path: 'dcs',
    children: [
      {
        name: '阀门控制',
        path: 'valveControl'
      },
      {
        name: '自动化控制',
        path: 'automation'
      }
    ]
  },
  {
    name: '设备数据',
    icon: 'dyhs-shebeishuju',
    path: 'deviceData',
    children: [
      {
        name: '开创井电',
        path: 'device:2'
      },
      {
        name: '清易气象',
        path: 'device:3'
      },
      {
        name: '某某墒情',
        path: 'device:4'
      },
      {
        name: '智能球阀',
        path: 'device:1'
      }
    ]
  },
  {
    name: '设备管护',
    icon: 'dyhs-shebeiguanhu',
    path: 'manage',
    children: [
      {
        name: '预警事件记录',
        path: 'warning'
      }
    ]
  },
  {
    name: '水费收缴',
    icon: 'dyhs-shuiquanjiaoyi',
    path: 'rent',
    children: [
      
      {
        name:'小组账户',
        path:'groupAccount'
      }
    ]
  },
  {
    name: '信息管理',
    icon: 'dyhs-xinxiguanli',
    path: 'messageManagement',
    children: [
      {
        name: '设备信息',
        path: 'deviceInformation',
      },
      {
        name: '农户信息',
        path: 'farmerInfor'
      },
      {
        name: '预警规则',
        path: 'warningRules'
      },
      {
        name: '计费设施',
        path: 'device'
      },
    ]
  },
  {
    name: '系统管理',
    icon: 'dyhs-xitongshezhi',
    path: 'system',
    children: [
      {
        name: '用户管理',
        path: 'userManagement'
      }
    ]
  }
  
];

function formatter(data, parentPath = '/') {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
export {formatter}