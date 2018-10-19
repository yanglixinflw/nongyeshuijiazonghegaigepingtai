import { isUrl } from '../utils/utils';
// 权限菜单，选择性菜单消失或存在
const menuData = [
  {
    name: 'Gis地图',
    icon: 'weibiaoti',
    path: 'gismap',
    children: [
      {
        name: 'Gis地图',
        path: 'gismapPage',
      }
    ],
  },
  {
    name: '指挥中心',
    icon: 'zhihui',
    path: 'command',
    children: [
      {
        name: '项目概况',
        path: 'itemIntroduction',
      },
      {
        name: '视频监控',
        path: 'videoMonitoring',
      },
    ],
  },
  {
    name: '辅助决策',
    icon: 'bulb',
    path: 'auxiliary',
    children: [
      {
        name: '数据分析',
        path: 'analysis',
      },
      {
        name: '运行总览',
        path: 'operation',
      },
    ],
  },
  {
    name: '集散控制',
    icon: 'laptop',
    path: 'device',
    children: [
      {
        name: '远程控制',
        path: 'remote',
      },
      {
        name: '用水限额',
        path: 'limit',
      },
      {
        name: '设备授权',
        path: 'authorize',
      },
      {
        name: '自动化控制',
        path: 'automation',
      },
    ],
  },
  {
    name: '设备数据',
    icon: 'table',
    path: 'data',
    children: [
      {
        name: '井电',
        path: 'wells',
      },
      {
        name: '气象',
        path: 'meteorology',
      },
      {
        name: '墒情',
        path: 'moisture',
      },
      {
        name: '智能球阀',
        path: 'ball',
      },
    ],
  },
  {
    name: '设备管护',
    icon: 'table',
    path: 'manage',
    children: [
      {
        name: '预警事件记录',
        path: 'warning',
      },
    ],
  },
  {
    name: '水费收缴',
    icon: 'table',
    path: 'rent',
    children: [
      {
        name: '水价制定',
        path: 'price',
      },
      {
        name: '计费设施',
        path: 'device',
      },
      {
        name: '水费账户',
        path: 'account',
        children:[
          {
            name:'小组账户',
            path:'groupAccount'
          },
          {
            name:'农户账户',
            path:'farmerAccount'
          }
        ]
      }
    ],
  },
  {
    name: '信息管理',
    icon: 'table',
    path: 'messageManagement',
    children: [
      {
        name: '设备型号信息',
        path: 'modelInformation',
      },
      {
        name: '设备信息',
        path: 'deviceInformation',
      },
      {
        name: '建筑信息',
        path: 'buildInformation',
        children:[
          {
            name:'灌区管道',
            path:'IrrigationPipe'
          },
          {
            name:'上游建筑',
            path:'upBuild'
          },
          {
            name:'下游建筑',
            path:'downBuild'
          },
        ]
      },
      {
        name: '农户信息',
        path: 'farmerInfor',
      },
      {
        name: '预警规则',
        path: 'warningRules',
      },
    ],
  },
  {
    name: '系统管理',
    icon: 'table',
    path: 'system',
    children: [
      {
        name: '系统规则',
        path: 'systemRules',
      },
      {
        name: '用户管理',
        path: 'userManagement',
      },
      {
        name: '部门组织架构',
        path: 'organizational',
      },
      {
        name: '角色权限',
        path: 'roleRight',
      },
      {
        name: '日志管理',
        path: 'systemHistory',
      },
    ],
  },
  
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