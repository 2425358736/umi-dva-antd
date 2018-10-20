const MenuJson = [
  {
    name: '订单',
    icon: 'credit-card',
    path: '/creditCard',
    key: 100,
    type: 1,
  },
  {
    name: '车辆',
    icon: 'car',
    path: '/car',
    key: 101,
    type: 1,
  },
  {
    name: '用户',
    icon: 'team',
    path: '/team',
    key: 102,
    type: 1,
  },
  {
    name: '站点',
    icon: 'environment',
    path: '/environment',
    key: 103,
    type: 1,
  },
  {
    name: '结算',
    icon: 'pay-circle',
    path: '/payCircle',
    key: 104,
    type: 1,
  },
  {
    name: '车辆违章',
    icon: 'alert',
    path: '/alert',
    key: 105,
    type: 1,
  },
  {
    name: '钱包',
    icon: 'wallet',
    path: '/wallet',
    key: 106,
    type: 1,
  },
  {
    name: '优惠卷',
    icon: 'gift',
    path: '/gift',
    key: 107,
    type: 1,
  },
  {
    name: '保险',
    icon: 'heart',
    path: '/heart',
    key: 108,
    type: 1,
  },
  {
    name: '系统设置',
    icon: 'setting',
    path: '',
    key: 1,
    type: 0,
    children: [
      {
        name: '角色管理',
        icon: '',
        path: '/user/role',
        key: 3,
        type: 1,
      },
      {
        name: '用户管理',
        icon: '',
        path: '/user/user',
        key: 4,
        type: 1,
      },
      {
        name: '权限管理',
        icon: '',
        path: '/user/urisdiction',
        key: 5,
        type: 1,
      },
    ]
  }
]

export default MenuJson
